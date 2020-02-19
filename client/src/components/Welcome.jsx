import React, { Component } from "react";
import img_whis from "../assets/whistleImg.jpg";
import "./Welcome.css";

class Welcome extends Component {
  state = {};
  render() {
    return (
      <div className="container-fluid d-flex justify-content-center">
        <div className="row">
          <div className="card text-center">
            <div className="overflow">
              <img
                src={img_whis}
                alt="whistle image"
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
                alt="whistle image"
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
                alt="whistle image"
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
      </div>
    );
  }
}

export default Welcome;
