import React, { Component } from 'react'
import MarketplaceContract from './abis/Marketplace.json'
import ChatContract from './abis/WhistledChat.json'
import getWeb3 from './utils/getWeb3'
import NavBar from './components/NavBar'
import './App.css'
import ChatRoom from './components/ChatRoom'
import Welcome from './components/Welcome'
import Mart from './components/Mart'
import NewCase from './components/NewCase'
import MainGrid from './components/MainGrid'

import {
  withRouter,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      chatContract: null,
      loading: false,
      cases: [],
      userCases:[],
      caseCount: 0,
      userStartBlock: null,
      currentBlockNum: null
    }

    //bind all function here

    this.createCase = this.createCase.bind(this)
    this.purchaseCase = this.purchaseCase.bind(this)
    this.getCaseDocs = this.getCaseDocs.bind(this)
  }

  componentDidMount = async () => {
    document.title= "Whistled"
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the main contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = MarketplaceContract.networks[networkId]
      const instance = new web3.eth.Contract(
        MarketplaceContract.abi,
        deployedNetwork && deployedNetwork.address,
      )

      //get Chat Contract
      const deployedNetwork2 = ChatContract.networks[networkId]
      const chatContract = new web3.eth.Contract(ChatContract.abi, deployedNetwork2 && deployedNetwork2.address)
      this.setState({ chatContract })

      //get block number 
       web3.eth.getBlockNumber().then(data => {
        this.setState({ currentBlockNum: data })
      }); 

      //get member join block
      const user = await chatContract.methods.members(accounts[0]).call();
      this.setState({userStartBlock: user.messageStartBlock});

      console.log("this user's block is ", this.state.userStartBlock)
      console.log("while curret block is ", this.state.currentBlockNum)
      

      const count = await instance.methods.caseCount().call()
      this.setState({ caseCount: count })

      //Load the cases
      for (var i = 1; i <= this.state.caseCount; i++) {
        const kase = await instance.methods.cases(i).call()
       
        this.setState({
          cases: [...this.state.cases, kase],
        })
      
        //use specific cases
        if(kase.owner==accounts[0]){
        this.setState({userCases: [...this.state.userCases, kase]})
        }
      }


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }
  createCase(
    _caseType,
    _caseTitle,
    _caseDescribtion,
    _caseLocation,
    _casePrice,
    _caseDocs,
    _caseDecKey,
  ) {
    //we have to tell react everytime that we are loading to change its state
    this.setState({ loading: true })

    this.state.contract.methods
      .createCase(
        _caseType,
        _caseTitle,
        _caseDescribtion,
        _caseLocation,
        _casePrice,
        _caseDocs,
        _caseDecKey,
      )
      .send({ from: this.state.accounts[0] })
      .once('receipt', receipt => {
        this.setState({ loading: false })
      })
  }

  purchaseCase(_caseId, _casePrice) {
    this.setState({ loading: true })
    console.log('id we receive', _caseId)
    this.state.contract.methods
      .purchaseCase(_caseId)
      .send({ from: this.state.accounts[0], value: _casePrice })
      .once('receipt', receipt => {
        this.setState({ loading: false })
      })
  }

  getCaseDocs(_caseId) {
    let res;
    this.setState({ loading: true })
    console.log('id of case receive', _caseId)
    res = this.state.contract.methods
      .getCaseDocs(_caseId)
      .send({ from: this.state.accounts[0] })
      .once('case Link given', receipt => {
        this.setState({ loading: false })
      })
    return res
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        {/*Nav bar will display on all pages, thus outside the router tags */}
        <NavBar
          location={this.props.location}
          account={this.state.accounts[0]}
        />

        <Router>
          <Switch>
            <React.Fragment>
              {/** Switch allows only one component to render */}
              <div className="App">
                <Route
                  exact
                  path="/"
                  render={() => <Welcome loading={this.loading} />}
                />
                <Route
                  path="/mart"
                  render={props => (
                    <Mart

                      caseCount={this.state.caseCount}
                      cases={this.state.cases}
                      account={this.state.accounts[0]}
                      purchaseCase={this.purchaseCase}
                      getCaseDocs={this.getCaseDocs}
                      loading={this.state.loading}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/newcase"
                  render={props => (
                    <NewCase

                      caseCount={this.state.caseCount}
                      createCase={this.createCase}
                      loading={this.state.loading}
                      {...props}
                    />
                  )}
                />

                <Route
                  path="/chat/:id"
                  render={props => (
                    <ChatRoom
                      chatContract={this.state.chatContract}
                      currentBlockNum={this.state.currentBlockNum}
                      userStartBlock={this.state.userStartBlock}
                      account={this.state.accounts[0]}
                      selKase={this.state.cases[parseInt(props.match.params.id) - 1]}
                      {...props} //this was painful to find
                    />
                  )}
                />

                <Route
                exact
                path="/myCases"
                render={props=>(
                  <MainGrid cases={this.state.userCases}
                  caseCount={this.state.caseCount}
                  account={this.state.accounts[0]}
                  purchaseCase={this.purchaseCase}
                  getCaseDocs={this.getCaseDocs}
                  loading={this.state.loading}
                  {...props}
                  />
                )}
                
                
                />

         
              </div>
            </React.Fragment>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default withRouter(App)
