import React, { Component } from "react";
import './navbar.css'

class NavBar extends Component {
  render() {
    return (
      <header>
        <nav className="nav-section">
          <label htmlFor="navdrop" className="toggle">Menu</label>
          <input type="checkbox" id="navdrop" />
          <div>
            <a className="logo" href="/">Whistled</a>
            <a href="/">Home</a>
            <a href="/mart">Market</a>
            <a href="/newCase">Submit a Case</a>
            <a href="/mycases">Follow Up</a>
            <span>Your account is: {this.props.account}</span>
          </div>
        </nav>
      </header>
    );
  }
}

export default NavBar;
