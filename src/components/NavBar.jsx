import React, { Component } from "react";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

class NavBar extends Component {
  render() {
    return (
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
      >
        <Navbar.Brand href="/">Whistled</Navbar.Brand>

        <Nav
          className="mr-auto"
          variant="pills"
          activeKey="/home"
        //onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/mart">Market</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/newCase">Submit a Case</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/mycases">Follow Up</Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav>
          <Nav.Item>
            <h6 className="whited">
              Your account is: {this.props.account}
            </h6>
          </Nav.Item>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
