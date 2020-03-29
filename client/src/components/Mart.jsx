import React, { Component } from "react";
import MainGrid from "./MainGrid";

class Mart extends Component {
  render() {
    return (
      <div style={{ marginTop: "6em" }}>
        

        {this.props.loading 
        ? <div> Loading..</div> 
        : <h1>this is the Mart .. load MainGrid here</h1>}
        <p>Number of cases in total {this.props.caseCount}</p>

        <MainGrid cases={this.props.cases} purchaseCase={this.props.purchaseCase}/>


      </div>
    );
  }
}

export default Mart;
