import React, { Component } from 'react'
import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'




class MainGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    tempText: 'output: ',
    selectedCase: "",
    isKaseOwner: false,
    account: this.props.account
  }
  this.checkOwnership = this.checkOwnership.bind(this)
  this.getCaseDocs = this.getCaseDocs.bind(this)
  this.getKey = this.getKey.bind(this)
  console.log(this.props)
  }

  updateHistory(){
    console.log("nothing")
  
   // this.props.history.push(`/chat/${this.state.selectedCase}`)
  }

  checkOwnership(kase){
    const isOwner = (kase.owner == this.state.account)
    console.log("is ownership checked", isOwner, "current user", this.state.account, "case owner", kase.owner)
    return isOwner
  }

  getCaseDocs(kase){

   this.setState({tempText : kase.caseDocs})

  }

  getKey(kase){

    this.setState({tempText : kase.caseDecKey})

  }

  render() {
    return (
      <CardColumns
        style={{ columnCount: '3', margin: '1rem', padding: '1rem' }}
      >
        {/*loop through cases to list them in a table */}

        {this.props.cases.map((kase, key) => {
          return (
            <Card key={key}>
              <Card.Body>
                <Card.Title>{kase.caseTitle}</Card.Title>
                <Card.Text>Describtion: {kase.caseDescribtion}</Card.Text>
                <Card.Text>Price: {kase.casePrice / 1e18} ETH</Card.Text>

                {!kase.isPurchased && !this.checkOwnership(kase)? (
                  <div>
                    <div className="btnHolder">
                      <Button
                        variant="primary"
                        onClick={event => {
                          this.props.purchaseCase(kase.caseId, kase.casePrice)
                        }}
                      >
                        Buy
                      </Button>
                    </div>
                    <div className="btnHolder">
                      <Button variant="dark" disabled>
                        Get Case Documents
                      </Button>
                    </div>
                    <div className="btnHolder">
                      <Button variant="dark" disabled>
                        Get Decryption Key
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="btnHolder">
                      <Button variant="dark" disabled>
                        Already Bought
                      </Button>
                    </div>
                    <div className="btnHolder">
                      <Button
                        variant="info"
                        onClick={event => {
                          this.setState({ tempText: kase.caseDocs })
                        }}
                      >
                        Get Case Documents
                      </Button>
                    </div>
                    <div className="btnHolder">
                      <Button
                        variant="danger"
                        onClick={event => {

                          this.getKey(kase)
                        }}
                      >
                        Get Decryption Key
                      </Button>{' '}
                    </div>
                  </div>
                )}

                <br />
                <Button
                  variant="success"
                  style={{ margin: '1rem' }}
                  href={`/chat/${kase.caseId}`}
         
                > 
                  Chat With Whistleblower "Secure"
                </Button>
                <br />
                <Card.Text type="text">{this.state.tempText}</Card.Text>
              </Card.Body>

              <Card.Footer>
                <small className="text-muted">
                  Location: {kase.caseLocation}
                </small>
              </Card.Footer>
            </Card>
          )
        })}
      </CardColumns>
    )
  }
}

export default MainGrid
//style={{ width: "18rem" }}

  /* <Card.Img variant="top" src="holder.js/100px160" />
  
   handleTemp = e => {
    e.preventDefault()
    ipfs.get('Qmb8dunuNT5bVr5yZ2GJkWQ2VABrN9xPUsyVpX8kwEX8aA', (err, res) => {
      console.log('Ipfs from', this.decrypt(Buffer.from(res[0].content))) 

      if (err) {
        console.error(err)
        return
      }
    })
  }
  */

