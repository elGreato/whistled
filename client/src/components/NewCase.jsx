import React, { Component } from "react";

class NewCase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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

              <div class="u_fNK">
                <div>
                  <div>
                    <div class="_3-ITD">
                      <div class="_5WizN aN9_b _1QzSN _1Nifw">
                        <div class="_3YmQx">
                          <div class="_3QdKe"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <form role="form">

                {/*Case Title*/}
                <div class="form-group">
                  <legend  for="caseTitle">Case Title</legend >
                  <input
                    type="text"
                    class="form-control"
                    id="caseTitle"
                    required
                  />
                </div>

                 {/*Case Context or Type*/}
                 <legend  for="radioDiv"> Case Context </legend > 
                 <div class="form-check form-check-inline" id="radioDiv">
                 <input class="form-check-input" type="radio" name="inlineRadioOptions" id="caseType1" value="option1"/>
                  <label for="caseType1">Birbary
                  </label>
                </div>


                <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="caseType2" value="option2" />
                <label for="caseType2">Money Laundary
                </label>
                </div>

                <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="caseType3" value="option3" />
                <label for="caseType3">Other
                </label>
                </div>


                {/*Case Describtion*/}
                <div class="form-group">
                  <legend  for="caseDes">Case Describtion</legend >
                  <textarea
                    type="text"
                    class="form-control"
                    id="caseDes"
                    required
                  />
                </div>

                {/*Case Title*/}
                <div class="form-group">
                  <label for="exampleInputFile">File input</label>
                  <input
                    type="file"
                    class="form-control-file"
                    id="exampleInputFile"
                  />
                  <p class="help-block">Example block-level help text here.</p>
                </div>
                <div class="checkbox">
                  <label>
                    <input type="checkbox" /> Check me out
                  </label>
                </div>
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
