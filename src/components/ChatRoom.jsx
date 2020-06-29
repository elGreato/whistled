import React, { Component, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import myTools from '../components/myUtils/myTools';
import './chatroom.css'
import Loader from '../components/loading/index'

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
			privateKey: '',
			chatingTo: '',
			currentRelations: [], //to deactivate accept button
			updating: false, //to force re-render
			errormsg: '',
			isNowMember: false,
			isRequestConnected: false,
			sectionFirst: 'is-active',
			sectionSecond: '',
			sectionThird: ''
		};

		this.joinChat = this.joinChat.bind(this); //bind even if  you don't export
		this.requestContact = this.requestContact.bind(this);
		this.getRelation = this.getRelation.bind(this);
		this.getRequestingContacts = this.getRequestingContacts.bind(this);
		this.sendMsg = this.sendMsg.bind(this);
		this.updateInput = this.updateInput.bind(this);
		this.getChatHistory = this.getChatHistory.bind(this);
		this.changeChattingTo = this.changeChattingTo.bind(this);
		this.checkMembership = this.checkMembership.bind(this);
		this.getRelationWith = this.getRelationWith.bind(this);
		this.updatePK = this.updatePK.bind(this);
	}

	componentDidMount = async () => {
		document.title = 'Secure Chat';
		//set the contacts
		await this.getRequestingContacts();
		//set welcome message
		this.setState({ chatingTo: this.props.selKase.owner });
		//set chat history
		//	this.getChatHistory(); Now it's done by a button
		this.setState({ updating: false });
		this.getRelation();
		this.checkMembership();
	};

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.cleanBrowserData);
	}

	cleanBrowserData() {
		sessionStorage.removeItem("pvtkey");
	}

	async getChatHistory() {
		console.log("chatingTo", this.state.chatingTo);
		let msgEvents = await this.state.chatContract.getPastEvents('messageSentEvent', {
			fromBlock: this.props.currentBlockNum - this.props.userStartBlock,
			toBlock: this.props.currentBlockNum,
		});
		const copy = [];
		console.log("getChatHistory", msgEvents);

		for (let i = 0; i < msgEvents.length; i++) {
			console.log("messages length", msgEvents.length)
			let from = msgEvents[i].returnValues[0];
			let to = msgEvents[i].returnValues[1];
			let senderPubKey;
			if (from == this.state.account || to == this.state.account) {
				if (msgEvents[i].returnValues[0] == this.state.account) {
					from = 'You';
					let contractMethods = this.state.chatContract.methods;
					let senderObject = await contractMethods.members(to).call();
					senderPubKey = senderObject.pubKey;
				}

				if (msgEvents[i].returnValues[1] == this.state.account) {
					to = 'You';
					let contractMethods = this.state.chatContract.methods;
					let senderObject = await contractMethods.members(from).call();
					senderPubKey = senderObject.pubKey;
				}

				let msg = msgEvents[i].returnValues[2];

				//compute the secret to encrypt the message
				console.log(" secret = myTools.computeSec --------------- pvt", this.state.privateKey)
				console.log(" secret = myTools.computeSec --------------- session pvt", sessionStorage.getItem("pvtkey"))
				let secret = myTools.computeSecret(this.state.privateKey, Buffer.from(senderPubKey, 'hex'));

				//decrypt the messages
				console.log("msg", msg);
				let decMsg = myTools.decrypt(msg, secret);

				if (from == this.state.chatingTo || to == this.state.chatingTo) {
					if (from == this.state.chatingTo) {
						from = 'whistler';
					} else if (to == this.state.chatingTo) {
						to = 'whistler';
					}
					
					copy.push({"from": (from + " to " + to), "message": decMsg});
				}
			} else continue;
		}

		this.setState({ txtArea: copy });
		this.setState({ updating: false });
	}

	async checkMembership() {
		var mbr = await this.state.chatContract.methods.members(this.state.account).call();
		this.setState({ isNowMember: mbr.isMember });
		if (mbr.isMember) {
			this.onNextStep(1)
			// if (this.state.account != undefined) {
				// this.setState({ isRequestConnected: await this.getRelationWith(this.state.account) });
			// }
			this.updatePK(sessionStorage.getItem('pvtkey'));
		}
	}

	async joinChat(e) {
		e.preventDefault();
		const pubKey = '04' + myTools.privateToPublic(this.state.privateKey).toString('hex');
		console.log('priv Key', this.state.privateKey, 'pub Key', pubKey);

		try {
			console.log(this.state.chatContract);
			this.setState({ loading: true });
			let contractMethods = this.state.chatContract.methods;
			await contractMethods
				.join(pubKey)
				.send({ from: this.state.account })
				.once('joined chat', (rec) => {
					console.log("joined chat rec", rec);
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
		await contractMethods
			.addContact(owner)
			.send({ from: this.state.account })
			.once('Contact requested', (rec) => {
				this.setState({ loading: false });
			});
		this.onNextStep(2);
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
	async getRelationWith(add) {
		let results;
		let contractMethods = this.state.chatContract.methods;
		results = await contractMethods.getRelationWith(add).call();
		if (results == 1) {
			this.onNextStep(2);
		}
		// this.setState({ isRequestConnected: results == 0 });
		return results == 1;
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

			//send the msg using smart contract
			let contractMethods = this.state.chatContract.methods;
			let to = this.state.chatingTo;
			let messages = this.state.msgToSend;
			//get public key of the person we want to send message to
			let receiverObject = await contractMethods.members(to).call();
			let receiverPubKey = receiverObject.pubKey;

			//compute the secret to encrypt the message
			let secret = myTools.computeSecret(this.state.privateKey, Buffer.from(receiverPubKey, 'hex'));

			let encryptedMessages = myTools.encrypt(messages, secret);

			contractMethods
				.sendMessage(to, encryptedMessages)
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

	updatePK(_inputValue) {
		
		if (_inputValue != null && _inputValue != '') {
			sessionStorage.setItem("pvtkey", _inputValue);
			this.setState({ privateKey: Buffer.from(_inputValue, 'hex') });
		}
		console.log("updatePK -- ", _inputValue)
	}
	
	changeChattingTo(add) {
		this.setState({ chatingTo: add });

		this.getChatHistory();
	}

	
	onNextStep(stepNo) {
		if (stepNo == 2 && this.state.sectionThird != '') {
			return;
		}
		if (stepNo == 0) {
			this.setState({
				sectionFirst: 'is-active',
				sectionSecond: '',
				sectionThird: '',
				loading: false
			});
		} else if (stepNo == 1) {
			this.setState({
				sectionFirst: '',
				sectionSecond: 'is-active',
				sectionThird: '',
				loading: false
			});
		} else if (stepNo == 2) {
			this.setState({
				sectionFirst: '',
				sectionSecond: '',
				sectionThird: 'is-active',
				loading: false
			});
		}
	}

	render() {
		if (!this.state.updating) {
			return (
				<div className='chatContainer'>
					<div className="container">
						<div className="wrapper">
							<ul className="steps">
								<li className={`${this.state.sectionFirst}`}><a onClick={() => this.onNextStep(0)}>Step 1</a></li>
								<li className={`${this.state.sectionSecond}`}><a onClick={() => this.onNextStep(1)}>Step 2</a></li>
							</ul>
							<form className="form-wrapper">
								<fieldset className={`section ${this.state.sectionFirst}`}>
									<h3>To be able to chat, you must join. for that you need your private key.</h3>
									<input type="text" name="pvtkey" placeholder="Enter your private key" onChange={(e) => this.updatePK(e.target.value)} />
									<button type="button" className="btn-primary next-btn" onClick={this.joinChat}>Next</button>
								</fieldset>
								<fieldset className={`section ${this.state.sectionSecond}`}>
									<h3>Chatting with Whistleblower of address:</h3>
									<p>{this.state.chatingTo}</p>
									<button type="button" className="btn-primary" disabled={this.state.isRequestConnected} onClick={this.requestContact}>Request to Contact</button>
									{/* If you fix that contract result, let me know I will fix by removing this NEXT button */}
									<button type="button" className="btn-primary next-btn" onClick={() => this.onNextStep(2)}>Next</button>
								</fieldset>
								<fieldset className={`section ${this.state.sectionThird}`}>
									<h3>Connected!</h3>
									<p>Your account has been connected to the chat ({this.state.chatingTo}).</p>
								</fieldset>
							</form>
						</div>
						{
							this.state.sectionThird != '' ?
								<div className="tabs">
									<input type="radio" id="tab1" name="tab-control" defaultChecked="true" />
									<input type="radio" id="tab2" name="tab-control" />
									<ul>
										<li title="Chat"><label htmlFor="tab1" role="button"><svg viewBox="0 0 512.012 512.012" ><g><path d="m495.266 394.775c11.112-23.435 16.742-48.57 16.742-74.794 0-93.61-74.304-170.285-167.347-174.787-20.968-75.53-89.845-128.213-168.653-128.213-97.047 0-176 78.505-176 175 0 26.224 5.63 51.359 16.742 74.794l-16.451 82.265c-2.094 10.472 7.144 19.728 17.618 17.656l83.279-16.465c20.862 9.896 43.054 15.426 66.17 16.529 29.148 104.951 146.217 157.593 243.452 111.471 91.207 18.032 84.094 16.75 86.189 16.75 9.479 0 16.56-8.686 14.709-17.941zm-385.17-73.6c-3.001-1.534-6.433-2.013-9.737-1.359l-66.24 13.097 13.049-65.25c.663-3.315.187-6.759-1.354-9.77-10.487-20.516-15.806-42.691-15.806-65.912 0-79.953 65.495-145 146-145 62.915 0 118.319 40.91 137.681 99.417-91.706 11.725-160.775 94.472-151.914 189.891-18.075-1.737-35.391-6.787-51.679-15.114zm354.753 74.488 13.049 65.25-66.24-13.097c-3.306-.653-6.736-.175-9.737 1.359-20.516 10.487-42.691 15.806-65.912 15.806-79.953 0-145-65.047-145-145s65.047-145 145-145c80.505 0 146 65.047 146 145 0 23.221-5.318 45.396-15.806 65.912-1.541 3.011-2.017 6.454-1.354 9.77z" /></g></svg><br /><span>Chat</span></label></li>
										<li title="Contacts"><label htmlFor="tab2" role="button"><svg viewBox="0 0 512.012 512.012"><g><path d="M239.7,260.2c0.5,0,1,0,1.6,0c0.2,0,0.4,0,0.6,0c0.3,0,0.7,0,1,0c29.3-0.5,53-10.8,70.5-30.5c38.5-43.4,32.1-117.8,31.4-124.9c-2.5-53.3-27.7-78.8-48.5-90.7C280.8,5.2,262.7,0.4,242.5,0h-0.7c-0.1,0-0.3,0-0.4,0h-0.6c-11.1,0-32.9,1.8-53.8,13.7c-21,11.9-46.6,37.4-49.1,91.1c-0.7,7.1-7.1,81.5,31.4,124.9C186.7,249.4,210.4,259.7,239.7,260.2zM164.6,107.3c0-0.3,0.1-0.6,0.1-0.8c3.3-71.7,54.2-79.4,76-79.4h0.4c0.2,0,0.5,0,0.8,0c27,0.6,72.9,11.6,76,79.4c0,0.3,0,0.6,0.1,0.8c0.1,0.7,7.1,68.7-24.7,104.5c-12.6,14.2-29.4,21.2-51.5,21.4c-0.2,0-0.3,0-0.5,0l0,0c-0.2,0-0.3,0-0.5,0c-22-0.2-38.9-7.2-51.4-21.4C157.7,176.2,164.5,107.9,164.6,107.3z" /><path d="M446.8,383.6c0-0.1,0-0.2,0-0.3c0-0.8-0.1-1.6-0.1-2.5c-0.6-19.8-1.9-66.1-45.3-80.9c-0.3-0.1-0.7-0.2-1-0.3c-45.1-11.5-82.6-37.5-83-37.8c-6.1-4.3-14.5-2.8-18.8,3.3c-4.3,6.1-2.8,14.5,3.3,18.8c1.7,1.2,41.5,28.9,91.3,41.7c23.3,8.3,25.9,33.2,26.6,56c0,0.9,0,1.7,0.1,2.5c0.1,9-0.5,22.9-2.1,30.9c-16.2,9.2-79.7,41-176.3,41c-96.2,0-160.1-31.9-176.4-41.1c-1.6-8-2.3-21.9-2.1-30.9c0-0.8,0.1-1.6,0.1-2.5c0.7-22.8,3.3-47.7,26.6-56c49.8-12.8,89.6-40.6,91.3-41.7c6.1-4.3,7.6-12.7,3.3-18.8c-4.3-6.1-12.7-7.6-18.8-3.3c-0.4,0.3-37.7,26.3-83,37.8c-0.4,0.1-0.7,0.2-1,0.3c-43.4,14.9-44.7,61.2-45.3,80.9c0,0.9,0,1.7-0.1,2.5c0,0.1,0,0.2,0,0.3c-0.1,5.2-0.2,31.9,5.1,45.3c1,2.6,2.8,4.8,5.2,6.3c3,2,74.9,47.8,195.2,47.8s192.2-45.9,195.2-47.8c2.3-1.5,4.2-3.7,5.2-6.3C447,415.5,446.9,388.8,446.8,383.6z" /></g></svg><br /><span>Contacts</span></label></li>

									</ul>

									<div className="slider"><div className="indicator"></div></div>
									<div className="content">
										<section>
											<div className="chat__messages__title">{this.state.chatingTo}</div>
											<div className="chat__messages">
												{this.state.txtArea.map((item, key) => {
													return (
														<blockquote className="speech-bubble" key={key.toString()}>
															<p>{item.message}</p>
															<span>{item.from}</span>
														</blockquote>
													);
												})}
											</div>
											<div className="chat__input">
												<input type="text" name="message" placeholder="Enter your message here" value={this.state.msgToSend} onChange={this.updateInput} onSubmit={this.sendMsg} />
												<button type="submit" className="btn-primary" onClick={this.sendMsg}>Send</button>
												<button type="button" className="btn-primary" onClick={this.getChatHistory}>Get Chat History</button>
											</div>

										</section>
										<section>
											<table className="sender-table">
												<thead>
													<tr>
														<th>Sender Address</th>
													</tr>
												</thead>
												<tbody>
													{this.state.requestingList.map((con, key) => {
														return (
															<tr key={key.toString()}>
																<td width="70%">{con}</td>
																<td width="15%"><button className="btn-primary" disabled={this.state.currentRelations[con] != 0}
																	name={con}
																	onClick={(event) => this.acceptContact(event.target.name)}>Accept</button></td>
																<td width="15%"><button className="btn-primary" name={con} onClick={(event) => this.changeChattingTo(event.target.name)}>Chat</button></td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</section>
									</div>
								</div>
								: null
						}


					</div>
				</div>
			);
		} else return (
			<div>
			 <Loader></Loader> 
			<h1>Loading..</h1>
			</div>
		);
	}
}

export default ChatRoom;
