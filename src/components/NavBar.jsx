import React, { Component } from "react";
import { Link } from "react-router-dom";
class NavBar extends Component {
  render() {
    return (
      <nav
        className="navbar navbar-expand-md info-color navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow"
        style={{ margin: "0" + "em" }}
      >
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Ali Tester
        </a>
        <ul className="navbar-nav px-3">
          <li className="navitem text-nowrap d-none d-sm-none d-sm-block mr-right">
            <small className="text-white">
              <span id="account">
                your account address:
                {this.props.account}
              </span>
            </small>
          </li>
          <li className="navitem text-nowrap d-none d-sm-none d-sm-block">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="/mart"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mart
            </a>
          </li>
          <li className="navitem text-nowrap d-none d-sm-none d-sm-block">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Home
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavBar;
