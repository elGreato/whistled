import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'


class ChatRoom extends Component {
  constructor(props) {
    super(props)
        
    this.state = {
      account: this.props.account,
      chatContract: this.props.chatContract,
      loading: false,
      relationships: [],
      members: [],
      requestingList: [],
      msgToSend: "",
      txtArea: []
 
     }

    console.log("chat cont", this.state.chatContract)

    this.getRequestingContacts();
    this.joinChat = this.joinChat.bind(this) //bind even if  you don't export
    this.requestContact = this.requestContact.bind(this)
    this.getRelation = this.getRelation.bind(this)
    this.getRequestingContacts= this.getRequestingContacts.bind(this)
    this.sendMsg= this.sendMsg.bind(this)
    this.updateInput= this.updateInput.bind(this)
  }

  componentDidMount(){

  }


   async joinChat(e){

    e.preventDefault();

    try{ 

      console.log(this.state.chatContract)
      this.setState({ loading: true })
      let contractMethods = this.state.chatContract.methods;
      contractMethods.join().send({from: this.state.account}).once("joined chat", rec=>{this.setState({loading: false})
      })     
    
    } 
    catch (error) {

      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, relations, or contract. Check console for details.`,)
      console.error(error)
    } 
  }


  
  
  async requestContact(e){

    e.preventDefault();
    console.log("members till now", await this.state.chatContract.methods.membersCount().call());
    let owner = this.props.selKase.owner;
    let contractMethods = this.state.chatContract.methods;
    contractMethods.addContact(owner).send({from: this.state.account}).once("Contact requested", rec=>{
      this.setState({loading: false})
    })
    

  }

  async getRelation(e){

    console.log("this account: ", this.state.account, "sending to ", this.props.selKase.owner)
    let rez;
    console.log("ger relation with start")
    try{
      rez = await this.state.chatContract.methods.getRelationWith(this.props.selKase.owner).call()
    }
    catch(er){
      console.error(er)
    }

  console.log(rez)
}

  async getRequestingContacts (){

    let invEvents = await this.state.chatContract.getPastEvents('addContactEvent', {
    filter: {returnValues: [1]}, 
    fromBlock: this.props.currentBlockNum -100,
    toBlock: this.props.currentBlockNum});
    //load these contacts to state: 

    let copy=[]; //react can't setstate in a loop
    for (var kontact of invEvents){
        if(kontact.returnValues.receiver==this.state.account) 
        copy.push(kontact.returnValues.requester)
    }
    this.setState({requestingList: copy})
  }

  async acceptContact(address){


    let owner = this.props.selKase.owner;
    let contractMethods = this.state.chatContract.methods;
    contractMethods.acceptContactRequest(address).send({from: this.state.account})
    .once("Contact accepted", rec=>{
      this.setState({loading: false})
      this.setState({disChatBtn: true})
    })
    



  }

  async sendMsg(e){
    e.preventDefault();
    if(this.state.msgToSend!=""){

    console.log(this.state.msgToSend)

    //send the msg using smart contract



    //delete the msg from the field after adding to tempHistory
  
    this.state.txtArea.push("You: " +this.state.msgToSend +"\n")
    this.setState({msgToSend: ""})

    console.log("history", this.state.txtArea)




    }
    else{
      console.error("please enter a correct msg")
    }
    
  }
  updateInput(event){
    this.setState({msgToSend: event.target.value})
  }

  render() {
    return (
      
      <div className="chatContainer">
      
        <Container className="Container" fluid="md">
          <Form>
            {/* First Block */}
            <Col>
            <Row className="r1">
              Chatting with Whistleblower of address: 
             
              {this.props.selKase.owner}

              <br/>owner of Case: {this.props.selKase.caseTitle}
     
            </Row>
            </Col>
            <Col >
            <Button onClick={this.joinChat}>Join Chat</Button>
            <Button onClick={this.requestContact}>Request to Contact</Button>
            </Col>

            <br />
            <Row>
              {/* Chat Window */}
              <Col className="chatCol" xs={6}>
                <Form.Control
                  as="textarea"
                  id="chatWindow"
                  rows="9"
                  placeholder="chats go here"
                  value={this.state.txtArea}
                />
              </Col>
              <Col>
                {/* Contacts Window */}
                <Form.Label as="legend"> Contacts</Form.Label>
                <Table borderless size="sm" responsive="sm">
                  <thead>
                    <tr>
                     
                      <th>Sender Address</th>
                      
                    </tr>
                  </thead>
                  <tbody id="cotactList">
                    { this.state.requestingList.map((con, key)=>{
                        return(
                          <tr key={key.toString()}>
                            
                            <td>
                            {con}
                            </td>
                            <td>
                              <Button 
                              name ={con}
                              onClick={
                                (event)=>
                                this.acceptContact(event.target.name)

                              }
                                
                              >accept</Button>
                            </td>
                            <td>
                              <Button>Chat</Button>
                            </td>
                          </tr>
                        )
                      })
                    }
                   
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col className="chatCol" xs={5}>
                <Form.Control id="userMsg" placeholder="write your message here" 
                value={this.state.msgToSend}
                onChange={this.updateInput}
                required
                />
              </Col>
              <Col xs={1}>
                <Button onClick={this.sendMsg}>Send </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

export default ChatRoom
