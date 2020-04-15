import React, { Component } from "react";
import img_whis from "../assets/whistleImg.jpg";
import "./Welcome.css";
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Button from 'react-bootstrap/Button'

class Welcome extends Component {

  render() {
    return (

      /*    <div className="container-fluid d-flex justify-content-center">
   
           <div className="row">
             <div className="card text-center">
               <div className="overflow">
                 <img
                   src={img_whis}
   
                   className="card-img-top"
                 />
               </div>
               <div className="card-body text-dark">
                 <h4 className="card-title">Submit a new Case</h4>
                 <p className="card-text text-secondary">blow the whislte here</p>
                 <a href="/newcase" className="btn btn-outline-success">
                   click here
                 </a>
               </div>
             </div>
   
             <div className="card text-center">
               <div className="overflow">
                 <img
                   src={img_whis}
   
                   className="card-img-top"
                 />
               </div>
               <div className="card-body text-dark">
                 <h4 className="card-title">Blow the Whistle</h4>
                 <p className="card-text text-secondary">blow the whislte here</p>
                 <a href="mart" className="btn btn-outline-success">
                   click here
                 </a>
               </div>
             </div>
   
             <div className="card text-center">
               <div className="overflow">
                 <img
                   src={img_whis}
   
                   className="card-img-top"
                 />
               </div>
               <div className="card-body text-dark">
                 <h4 className="card-title">Blow the Whistle</h4>
                 <p className="card-text text-secondary">blow the whislte here</p>
                 <a href="mart" className="btn btn-outline-success">
                   click here
                 </a>
               </div>
             </div>
           </div>
         </div> */

      <CardDeck className="CardDeck">
        <Card className="welCard">
          <Card.Img variant="top" src={img_whis} />
          <Card.Body>
            <Card.Title>Blow the Whistle</Card.Title>
            <Card.Text>
              To submit a new case. have you witnessed misconduct?
      </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button href="/newCase" variant="primary">Submit Case</Button>
          </Card.Footer>
        </Card>
        <Card className="welCard">
          <Card.Img variant="top" src="holder.js/100px160" />
          <Card.Body>
            <Card.Title>Whistleblowing  Marketplace</Card.Title>
            <Card.Text>
              Are you a journalist or a corruption fighter? Check the
              cases listed in the Market place
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button href="/mart" variant="primary">Marketplace</Button>
          </Card.Footer>
        </Card>
        <Card className="welCard">
          <Card.Img variant="top" src="holder.js/100px160" />
          <Card.Body>
            <Card.Title>Already submitted a case?</Card.Title>
            <Card.Text>
              Follow up on a case
      </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button href="/chat" variant="primary">Chat</Button>
          </Card.Footer>
        </Card>
      </CardDeck>
    );
  }
}

export default Welcome;
