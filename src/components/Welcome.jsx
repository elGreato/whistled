import React, { Component } from 'react';
import img_whis from '../assets/whistleImg.png';
import img_mart from '../assets/marketImg.png'
import img_folo from '../assets/followupImg.png'
import './Welcome.css';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';

class Welcome extends Component {
	render() {
		return (
			<div className='App'>
				<div className='CardDeck'>
					<Card className='welCard'>
						<Card.Img className='cImg' variant='top' src={img_whis} />
						<Card.Body>
							<Card.Title>Blow the Whistle</Card.Title>
							<Card.Text>To submit a new case. have you witnessed misconduct?</Card.Text>
						</Card.Body>
						<Card.Footer>
							<Button href='/newCase' variant='primary'>
								Submit Case
							</Button>
						</Card.Footer>
					</Card>
				</div>
				<div className='CardDeck'>
					<Card className='welCard'>
						<Card.Img className='cImg' variant='top' src={img_mart} />
						<Card.Body>
							<Card.Title>Whistleblowing Marketplace</Card.Title>
							<Card.Text>
								Are you a journalist? Check the cases listed in the Marketplace
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<Button href='/mart' variant='primary'>
								Marketplace
							</Button>
						</Card.Footer>
					</Card>
				</div>
				<div className='CardDeck'>
					<Card className='welCard'>
						<Card.Img className='cImg' variant='top' src={img_folo} />
						<Card.Body>
							<Card.Title>Already submitted a case?</Card.Title>
							<Card.Text>Follow up on a case you already submitted and chat with buyers</Card.Text>
						</Card.Body>
						<Card.Footer>
							<Button href='/mycases' variant='primary'>
								Follow Up
							</Button>
						</Card.Footer>
					</Card>
				</div>
			</div>
		);
	}
}

export default Welcome;
