import React, { Component } from 'react'
import { request } from 'https'
import axios from 'axios'
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
})

class NewCase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 0,
      buffer: null,
      caseHash: null,
      caseDecKey: 'Temp',
    }

    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  handleOptionChange = changeEvent => {
    this.setState({ selectedOption: changeEvent.target.value })
  }

  handleTemp = e => {
    e.preventDefault()
    ipfs.get('Qmb8dunuNT5bVr5yZ2GJkWQ2VABrN9xPUsyVpX8kwEX8aA', (err, res) => {
      console.log('Ipfs from', this.decrypt(Buffer.from(res[0].content))) //Result should be a hash e.g. QmVpeceu7JCWLBskJgudkdQ8XnM2ExMZRorsv6sQchACjW

      if (err) {
        console.error(err)
        return
      }
    })
  }

  handleFileChange = event => {
    event.preventDefault()
    //fetch the file
    const file = event.target.files[0]

    //reader converts file to a buffer
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  encrypt = buffer => {
    let key = this.state.caseDecKey
    key = crypto
      .createHash('sha256')
      .update(key)
      .digest('base64')
      .substr(0, 32)
    // Create an initialization vector
    const iv = crypto.randomBytes(16) // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(algorithm, key, iv) // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()])
    return result
  }

  // e.g. http://ipfs.infura.io/ipfs/Qmb8dunuNT5bVr5yZ2GJkWQ2VABrN9xPUsyVpX8kwEX8aA
  decrypt = encrypted => {
    let key = this.state.caseDecKey
    key = crypto
      .createHash('sha256')
      .update(key)
      .digest('base64')
      .substr(0, 32)
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16) // Get the rest
    encrypted = encrypted.slice(16) // Create a decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv) // Actually decrypt it
    const result = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return result
  }

  render() {
    return (
      <div style={{ marginTop: '6em' }}>
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
                  event.preventDefault()

                  const caseDecKey = this.caseDecKey.value
                  const caseType = this.state.selectedOption
                  const caseTitle = this.caseTitle.value
                  const caseLocation = this.caseLocation.value
                  const casePrice = this.casePrice.value
                  const caseDescribtion = this.caseDescribtion.value

                  this.setState({ caseDecKey })
                  console.log('cawes pass', caseDecKey)
                  console.log('state caseDecKey', this.state.caseDecKey)

                  //Now encrypt
                  const encryptedBuffer = this.encrypt(this.state.buffer)

                  //Submit file to IPFS -- view file fia https://ipfs.infura.io/ipfs/$HASH
                  var promises = new Promise((resolve, reject) => {
                    ipfs.add(encryptedBuffer, (err, res) => {
                      resolve(res) //Result should be a hash e.g. QmVpeceu7JCWLBskJgudkdQ8XnM2ExMZRorsv6sQchACjW
                      console.log('Ipfs result', res)
                      if (err) {
                        console.error(err)
                        return
                      }
                    })
                  })

                  promises
                    .then(res => {
                      this.setState({ caseHash: res[0].path })
                      console.log('case hash', this.state.caseHash)
                      
                  this.props.createCase(
                    caseType,
                    caseTitle,
                    caseDescribtion,
                    caseLocation,
                    casePrice,
                    this.state.caseHash,
                    this.state.caseDecKey,
                  )


                    })
                    .catch(error => {
                      console.log(error)
                    })

                }}
              >
                {/*Case Title*/}
                <div class="form-group">
                  <legend for="caseTitle">Case Title</legend>
                  <input
                    type="text"
                    ref={input => {
                      this.caseTitle = input
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
                      this.caseLocation = input
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
                      this.caseDescribtion = input
                    }}
                    class="form-control"
                    id="caseDescribtion"
                    required
                  />
                </div>

                {/*Case Price*/}
                <div class="form-group">
                  <legend for="casePrice">Case Price (ETH) </legend>
                  <input
                    type="text"
                    class="form-control"
                    ref={input => {
                      this.casePrice = input
                    }}
                    id="casePrice"
                    required
                  />
                </div>

                {/*Case Files*/}
                <div class="form-group">
                  <label for="caseFile">File input</label>
                  <input
                    type="file"
                    onChange={this.handleFileChange}
                    class="form-control-file"
                    id="caseFile"
                  />
                </div>
                {/*Case Encryption Key*/}
                <div class="form-group">
                  <legend for="caseDecKey">
                    Case Encryption/Decryption Key
                  </legend>
                  <h5>
                    Warning: Enter a password that will encrypt your files
                    before uploading it to IPFS. This password WILL NOT be saved
                    anywhere, so make sure to remember to be able to access the
                    files again.
                  </h5>
                  <input
                    type="password"
                    ref={input => {
                      this.caseDecKey = input
                    }}
                    class="form-control"
                    id="caseDecKey"
                    required
                  />
                </div>

                <button type="submit" class="btn btn-primary">
                  Submit
                </button>
                <button onClick={this.handleTemp} class="btn btn-primary">
                  read
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewCase