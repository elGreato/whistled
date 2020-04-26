import React, { Component } from "react";
import MainGrid from "./MainGrid";


class Mart extends Component {
  render() {
    return (
      <div style={{ marginTop: "6em" }}>
        
        {document.title= "Marketplace"}
        {this.props.loading 
        ? <div> Loading..</div> 
        : <h1>Current Casees</h1>}
        <p>Number of cases in total {this.props.caseCount}</p>

        <MainGrid cases={this.props.cases} account = {this.props.account} 
        getCaseDocs={this.props.getCaseDocs} purchaseCase={this.props.purchaseCase}/>
          

      </div>
    );
  }
}

export default Mart;
