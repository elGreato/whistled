import React, { Component } from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Popup from 'reactjs-popup';

//Decrypt stuff
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
	host: 'ipfs.infura.io',
	port: 5001,
	protocol: 'https',
});

class MainGrid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tempText: 'output: ',
			selectedCase: '',
			isKaseOwner: false,
			account: this.props.account,
		};
		this.checkOwnership = this.checkOwnership.bind(this);
		this.getCaseDocs = this.getCaseDocs.bind(this);
    this.getKey = this.getKey.bind(this);
    this.decrypt = this.decrypt.bind(this)
	}


	checkOwnership(kase) {
		const isOwner = kase.owner == this.state.account;
		return isOwner;
	}

	getCaseDocs(kase) {
    console.log("vvv")
    const caseDocumentLink =document.createElement("dekrypt")
    caseDocumentLink.src = `https://ipfs.infura.io/ipfs/${kase.caseDocs}`
    caseDocumentLink.async = true;
    caseDocumentLink.onload = () =>

    console.log(this.decrypt(caseDocumentLink,kase.caseDecKey))
    
		
	}

	getKey(kase) {
		//this.setState({tempText : kase.caseDecKey})
		return kase.caseDecKey;
	}
	// e.g. http://ipfs.infura.io/ipfs/Qmb8dunuNT5bVr5yZ2GJkWQ2VABrN9xPUsyVpX8kwEX8aA
	decrypt(encrypted,key){
	
		key = crypto
			.createHash('sha256')
			.update(key)
			.digest('base64')
			.substr(0, 32);
		// Get the iv: the first 16 bytes
		const iv = encrypted.slice(0, 16); // Get the rest
		encrypted = encrypted.slice(16); // Create a decipher
		const decipher = crypto.createDecipheriv(algorithm, key, iv); // Actually decrypt it
		const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		return result;
	};

	render() {
		return (
			<CardColumns style={{ columnCount: '3', margin: '1rem', padding: '1rem' }}>
				{/*loop through cases to list them in a table */}

				{this.props.cases.map((kase, key) => {
					return (
						<Card key={key}>
							<Card.Body>
								<Card.Title>{kase.caseTitle}</Card.Title>
								<Card.Text>Describtion: {kase.caseDescribtion}</Card.Text>
								<Card.Text>Price: {kase.casePrice / 1e18} ETH</Card.Text>

								{!kase.isPurchased && !this.checkOwnership(kase) ? (
									<div>
										<div className='btnHolder'>
											<Button
												variant='primary'
												onClick={(event) => {
													this.props.purchaseCase(kase.caseId, kase.casePrice);
												}}>
												Buy
											</Button>
										</div>
										<div className='btnHolder'>
											<Button variant='dark' disabled>
												Get Case Documents
											</Button>
										</div>
										<div className='btnHolder'>
											<Button variant='dark' disabled>
												Get Decryption Key
											</Button>
										</div>
									</div>
								) : (
									<div>
										<div className='btnHolder'>
											<Button variant='dark' disabled>
												Already Bought
											</Button>
										</div>
										<div className='btnHolder'>
											<Popup
												trigger={
													<Button
														variant='info'
														onClick={(event) => {
															this.getCaseDocs(kase);
														}}>
														Get Case Documents
													</Button>
												}
												position='right center'>
												<div>
												{this.getCaseDocs(kase)}
													<img
														src={`https://ipfs.infura.io/ipfs/${kase.caseDocs}`}
														alt='new'
													/>
												</div>
											</Popup>
										</div>

										<div className='btnHolder'>
											<Popup
												trigger={
													<Button variant='danger' onClick={(event) => {}}>
														Get Decryption Key
													</Button>
												}
												position='right center'>
												<div>{this.getKey(kase)}</div>
											</Popup>
										</div>
									</div>
								)}

								<br />
								<Button variant='success' style={{ margin: '1rem' }} href={`/chat/${kase.caseId}`}>
									Chat With Whistleblower "Secure"
								</Button>
								<br />
								{/* <Card.Text type='text'>{this.state.tempText}</Card.Text> */}
							</Card.Body>

							<Card.Footer>
								<small className='text-muted'>Location: {kase.caseLocation}</small>
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
