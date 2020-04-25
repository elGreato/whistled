import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

class ChatRoom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: this.props.account,
			chatContract: this.props.chatContract,
			loading: false,
			relationships: [],
			members: [],
			requestingList: [],
			msgToSend: '',
			txtArea: [],
			chatingTo: '',
			currentRelations: [], //to deactivate accept button
			updating: false, //to force re-render
			errormsg: '',
			isNowMember: false
		};

		console.log('chat cont', this.state.chatContract);

		this.joinChat = this.joinChat.bind(this); //bind even if  you don't export
		this.requestContact = this.requestContact.bind(this);
		this.getRelation = this.getRelation.bind(this);
		this.getRequestingContacts = this.getRequestingContacts.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.updateInput = this.updateInput.bind(this);
		this.getChatHistory = this.getChatHistory.bind(this);
		this.changeChattingTo = this.changeChattingTo.bind(this);
		this.checkMembership= this.checkMembership.bind(this)
		this.getRelationWith=this.getRelationWith.bind(this)
	}

	componentDidMount = async () => {
		{
			document.title = 'Secure Chat';
		}

		//set the contacts
		await this.getRequestingContacts();
		//set welcome message
		this.setState({ chatingTo: this.props.selKase.owner });
		//set chat history
		this.getChatHistory();
		this.setState({ updating: false });

		this.getRelation();
		this.checkMembership();

	};

	async getChatHistory() {
		let msgEvents = await this.state.chatContract.getPastEvents('messageSentEvent', {
			//filter: { returnValues: [1] },
			fromBlock: this.props.currentBlockNum - this.props.userStartBlock,
			toBlock: this.props.currentBlockNum,
		});
		const copy = [];

		for (let i = 0; i < msgEvents.length; i++) {
			let from = msgEvents[i].returnValues[0];
			let to = msgEvents[i].returnValues[1];

			if (from == this.state.account || to == this.state.account) {
				if (msgEvents[i].returnValues[0] == this.state.account) {
					from = 'You';
				}

				if (msgEvents[i].returnValues[1] == this.state.account) {
					to = 'You';
				}

				let msg = msgEvents[i].returnValues[2];
				if (from == this.state.chatingTo || to == this.state.chatingTo) {
					if (from == this.state.chatingTo) {
						from = 'whistler';
					} else if (to == this.state.chatingTo) {
						to = 'whistler';
					}
					copy.push( from + ' to ' + to +":"+ '\n'  + msg + '\n\n');
				}
			} else continue;
		}

		this.setState({ txtArea: copy });

		this.setState({ updating: false });
	}
	async checkMembership(){
		var mbr =  await this.state.chatContract.methods.members(this.state.account).call();
		this.setState({isNowMember: mbr.isMember})
		console.log("is member: ", this.state.isNowMember)
	}

	async joinChat(e) {
		e.preventDefault();

		try {
			console.log(this.state.chatContract);
			this.setState({ loading: true });
			let contractMethods = this.state.chatContract.methods;
			contractMethods
				.join()
				.send({ from: this.state.account })
				.once('joined chat', (rec) => {
					this.setState({ loading: false });
				});
				this.checkMembership();
				
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(`Failed to load web3, relations, or contract. Check console for details.`);
			console.error(error);
			this.setState({ errormsg: error });
			window.alert(this.state.errormsg);
		

		}
	}

	async requestContact(e) {
		e.preventDefault();
		console.log('members till now', await this.state.chatContract.methods.membersCount().call());
		let owner = this.props.selKase.owner;
		let contractMethods = this.state.chatContract.methods;
		contractMethods
			.addContact(owner)
			.send({ from: this.state.account })
			.once('Contact requested', (rec) => {
				this.setState({ loading: false });
			});
	}

	async getRelation() {
		await this.getRequestingContacts();

		let copy = [];

		for (var i = 0; i < this.state.requestingList.length; i++) {
			let requester = this.state.requestingList[i];
			let relation = await this.state.chatContract.methods.getRelationWith(requester).call();

			copy[requester] = relation;
		}
		this.setState({ currentRelations: copy });
	}
	async getRelationWith(add){
		let results;
		let contractMethods = this.state.chatContract.methods;
		results = contractMethods.getRelationWith(add).call()
		return results

	}

	async getRequestingContacts() {
		let invEvents = await this.state.chatContract.getPastEvents('addContactEvent', {
			filter: { returnValues: [1] },
			fromBlock: this.props.currentBlockNum - this.props.userStartBlock,
			toBlock: this.props.currentBlockNum,
		});
		//load these contacts to state:

		let copy = []; //react can't setstate in a loop
		for (var kontact of invEvents) {
			if (kontact.returnValues.receiver == this.state.account) copy.push(kontact.returnValues.requester);
		}
		this.setState({ requestingList: copy });
	}

	async acceptContact(address) {
		let contractMethods = this.state.chatContract.methods;
		contractMethods
			.acceptContactRequest(address)
			.send({ from: this.state.account })
			.once('Contact accepted', (rec) => {
				this.setState({ loading: false });
			});
	}

	async sendMsg(e) {
		//e.preventDefault();
		if (this.state.msgToSend != '') {
			this.setState({ updating: true });

			console.log(this.state.msgToSend);

			//send the msg using smart contract
			let contractMethods = this.state.chatContract.methods;
			let to = this.state.chatingTo;
			let messages = this.state.msgToSend;

			contractMethods
				.sendMessage(to, messages)
				.send({ from: this.state.account })
				.once('msg sent', (rec) => {
					this.getChatHistory();
				})
				.then(this.setState({ updating: false }))
				.then(this.getChatHistory())
				.then(console.log('done'));

			
			this.setState({ msgToSend: '' });

			console.log('history', this.state.txtArea);
		} else {
			console.error('please enter a correct msg');
		}
	}
	updateInput(event) {
		this.setState({ msgToSend: event.target.value });
	}
	changeChattingTo(add) {
		this.setState({ chatingTo: add });

		this.getChatHistory();
	}

	render() {
		if (!this.state.updating) {
			return (
				<div className='chatContainer'>
					<Container className='Container' fluid='lg'>
						<Form>
							<Row>
							<Col lg="6"> To be able to chat, you must Join. Click Here >> 
							<Button variant="success" 
							disabled = {this.state.isNowMember}
							
							onClick={this.joinChat}
							 >Join Chat</Button>
							</Col>
							{/* First Block */}
							<Col>
								<Row className='r1'>
									Chatting with Whistleblower of address: {this.state.chatingTo}
								</Row>
							</Col>
							
							<Col>
								
								<Button variant="success" 
								disabled={this.getRelationWith(this.props.selKase.owner) ==0}
								onClick={this.requestContact}>Request to Contact</Button>
							</Col>
							</Row>
							<br />
							<Row>
								{/* Chat Window */}
								<Col className='chatCol' md={6}>

									<Form.Control
										readOnly
										as='textarea'
										id='chatWindow'
										rows='9'
										placeholder='chats go here'
										value={this.state.txtArea.join("")}
									/>
								</Col>
								<Col>
									{/* Contacts Window */}
									<Form.Label as='legend'> Contacts</Form.Label>
									<Table borderless size='sm' responsive='sm'>
										<thead>
											<tr>
												<th>Sender Address</th>
											</tr>
										</thead>
										<tbody id='cotactList'>
											{this.state.requestingList.map((con, key) => {
												return (
													<tr key={key.toString()}>
														<td>{con}</td>
														<td>
															<Button
																disabled={this.state.currentRelations[con] != 0}
																name={con}
																onClick={(event) =>
																 this.acceptContact(event.target.name)}>
																accept
															</Button>
														</td>
														<td>
															<Button
																name={con}
																onClick={(event) =>
																 this.changeChattingTo(event.target.name)}>
																Chat
															</Button>
														</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
								</Col>
							</Row>

							<Row>
								<Col className='chatCol' xs={5}>
									<Form.Control
										id='userMsg'
										placeholder='write your message here'
										value={this.state.msgToSend}
										onChange={this.updateInput}
										onSubmit={this.sendMsg}
										required
									/>
								</Col>
								<Col xs={1}>
									<Button type='submit' onClick={this.sendMsg}>
										Send{' '}
									</Button>
								</Col>
							</Row>
						</Form>
					</Container>
				</div>
			);
		} else return <h1>Loading..</h1>;
	}
}

export default ChatRoom;
