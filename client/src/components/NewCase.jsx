import React, { Component } from "react";

class NewCase extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: 0 };

    this.handleOptionChange = this.handleOptionChange.bind(this)
  }
  handleOptionChange = changeEvent => {
    console.log("selected >>", this.state.selectedOption)
    this.setState({
      selectedOption: changeEvent.target.value
    });
    console.log("after >>", this.state.selectedOption)
  };
  render() {
    return (
      <div style={{ marginTop: "6em" }}>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <h3>Open a new case:</h3>
              <h5>
                Warning: if you wish to remain anonymous, do not enter any
                personal information - such as your name or your relationship
                with to the tip-off - nor any information that could be traced
                back to you.
              </h5>
              <br />


              <form
                role="form"
                onSubmit={event => {
                  event.preventDefault();
                  console.log(event)
                  const caseType = this.state.selectedOption;
                  const caseTitle = this.caseTitle.value;
                  const caseLocation = this.caseLocation.value;
                  //const casePrice = window.web3.utils.toWei(this.casePrice.value.toString(),"Ether");
                  const casePrice = this.casePrice.value;
                  const caseDescribtion = this.caseDescribtion.value;
                  this.props.createCase(caseType,caseTitle,caseDescribtion,caseLocation,casePrice);
                }}
              >
                {/*Case Title*/}
                <div class="form-group">
                  <legend for="caseTitle">Case Title</legend>
                  <input
                    type="text"
                    ref={input => {
                      this.caseTitle = input;
                    }}
                    class="form-control"
                    id="caseTitle"
                    required
                  />
                </div>

                 {/*Case Location*/}
                 <div class="form-group">
                  <legend for="caseLocation">Case Location</legend>
                  <input
                    type="text"
                    ref={input => {
                      this.caseLocation = input;
                    }}
                    class="form-control"
                    id="caseLocation"
                    required
                  />
                </div>

                {/*Case Context or Type*/}
                <legend for="radioDiv"> Case Context </legend>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                   /*  checked={this.state.selectedOption===0 ? true : false} */
                    type="radio"
                    name="inlineRadioOptions"
                    id="caseType1"
                    value="0"
                    onChange={this.handleOptionChange}
                  />
                  <label for="caseType1">Birbary</label>
                </div>

                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                   /*  checked={this.state.selectedOption===1 ? true : false} */
                    name="inlineRadioOptions"
                    id="caseType2"
                    value="1"
                    onChange={this.handleOptionChange}
                  />
                  <label for="caseType2">Money Laundary</label>
                </div>

                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    /* checked={this.state.selectedOption===2 ? true : false} */
                    name="inlineRadioOptions"
                    id="caseType3"
                    value="2"
                    onChange={this.handleOptionChange}
                  />
                  <label for="caseType3">Other</label>
                </div>

                {/*Case Describtion*/}
                <div class="form-group">
                  <legend for="caseDes">Case Describtion</legend>
                  <textarea
                    type="text"
                    ref={input => {
                      this.caseDescribtion = input;
                    }}
                    class="form-control"
                    id="caseDescribtion"
                    required
                  />
                </div>

                {/*Case Price*/}
                <div class="form-group">
                  <legend for="casePrice">Case Price</legend>
                  <input
                    type="text"
                    class="form-control"
                    ref={input => {
                      this.casePrice = input;
                    }}
                    id="casePrice"
                    required
                  />
                </div>

                {/*Case Files*/}
                <div class="form-group">
                  <label for="exampleInputFile">File input</label>
                  <input
                    type="file"
                    class="form-control-file"
                    id="exampleInputFile"
                  />
                  {/* <p class="help-block">Example block-level help text here.</p> */}
                </div>
                {/* <div class="checkbox">
                  <label>
                    <input type="checkbox" /> Check me out
                  </label>
                </div> */}
                <button type="submit" class="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewCase;
