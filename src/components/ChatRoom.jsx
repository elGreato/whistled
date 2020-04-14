import React, { Component } from 'react'
import Iframe from 'react-iframe'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'

class ChatRoom extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="chatContainer">
        <Container className="Container" fluid="md">
          <Form>
            {/* First Block */}
            <Row className="r1">
              Chatting with Whistleblower of address: 
              {/* {this.props.cases.map((kase, key) => {

              })} */}
              {this.props.selKase.owner}
              
              {console.log("id", this.props.match.params.id)}
              {console.log("dad", this.props)}
            </Row>

            <br />
            <Row>
              {/* Chat Window */}
              <Col className="chatCol" xs={6}>
                <Form.Control
                  as="textarea"
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
                <Form.Control placeholder="write your message here" />
              </Col>
              <Col xs={1}>
                <Form.Control as="button">Send </Form.Control>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    )
  }
}

export default ChatRoom
