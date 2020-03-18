import React, { Component } from "react";
import MainGrid from "./MainGrid";

class Mart extends Component {
  state = {};
  render() {
    return (
      <div style={{ marginTop: "6em" }}>
        <h1>this is the Mart .. load MainGrid here</h1>
        <MainGrid />
      </div>
    );
  }
}

export default Mart;
