import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class MainGrid extends Component {
  
  render() {
    
    return (
      <CardColumns style={{columnCount: '3', margin: '1rem', padding: '1rem'}}>
          {/*loop through cases to list them in a table */}
         
        {this.props.cases.map((kase,key)=>{
          return (
            <Card>
            <Card.Body>
          <Card.Title>{kase.caseTitle}</Card.Title>
              <Card.Text>
                Describtion: {kase.caseDescribtion}
              </Card.Text>
              <Card.Text>
                Price: {kase.casePrice} ETH
              </Card.Text>
              <Button variant="primary">Buy</Button> <br/>
              <Button variant="info" style={{margin: '1rem'}}>Chat With Whistleblower "Secure"</Button>
            </Card.Body>
            <Card.Footer>
          <small className="text-muted">Location: {kase.caseLocation}</small>
            </Card.Footer>
          </Card>
          );
        })}
        
        

      </CardColumns>
    );
  }
}

export default MainGrid;
//style={{ width: "18rem" }}
{/* <Card.Img variant="top" src="holder.js/100px160" /> */}