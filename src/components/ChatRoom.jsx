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
      members: []

    }
   

    this.joinChat = this.joinChat.bind(this) //bind even if  you don't export
    this.requestContact = this.requestContact.bind(this)
  }


   async joinChat(e){
    e.preventDefault();

     try{ 
      console.log(this.state.chatContract)
      this.setState({ loading: true })
      this.state.chatContract.methods.join()
      .send({from: this.state.account}).once("joined chat", rec=>{
        this.setState({loading: false})
      })
      
    
     } 
     catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, relations, or contract. Check console for details.`,
      )
      console.error(error)
    } 
  }


  
  
  async requestContact(e){
    e.preventDefault();
    console.log("members till now", await this.state.chatContract.methods.membersCount().call())

  }

 
  

  sendMsg(e){
    e.preventDefault();
    
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
                />
              </Col>
              <Col>
                {/* Contacts Window */}
                <Form.Label as="legend"> Contacts</Form.Label>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sender Address</th>
                      <th>
                        <Button >Chat</Button>
                      </th>
                    </tr>
                  </thead>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col className="chatCol" xs={5}>
                <Form.Control id="userMsg" placeholder="write your message here" />
              </Col>
              <Col xs={1}>
                <Form.Control onClick={this.sendMsg}  as="button">Send </Form.Control>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

export default ChatRoom
