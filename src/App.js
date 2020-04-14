import React, { Component } from "react";
import MarketplaceContract from "./abis/Marketplace.json";
import getWeb3 from "./utils/getWeb3";
import NavBar from "./components/NavBar";
import "./App.css";
import ChatRoom from './components/ChatRoom'
import Welcome from "./components/Welcome";
import Mart from "./components/Mart";
import NewCase from "./components/NewCase";
import history from "./components/history"
import { withRouter ,BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";


class App extends Component {
  

  constructor(props){
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      loading: false,
      cases: [],
      caseCount: 0
    };

    //bind all function here

    this.createCase = this.createCase.bind(this)
    this.purchaseCase = this.purchaseCase.bind(this)
    this.getCaseDocs = this.getCaseDocs.bind(this)

  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MarketplaceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MarketplaceContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      const count = await instance.methods.caseCount().call();
      this.setState ({caseCount: count}); 

      //Load the cases
      for(var i=1; i<=this.state.caseCount; i++){
        const kase = await instance.methods.cases(i).call();
        this.setState({
          cases: [...this.state.cases, kase]
        })
      }
     

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }

  };
  createCase(_caseType, _caseTitle,_caseDescribtion,_caseLocation,_casePrice,_caseDocs,_caseDecKey) {
    //we have to tell react everytime that we are loading to change its state
    this.setState({ loading: true });
    
    this.state.contract.methods
      .createCase(
        _caseType,
        _caseTitle,
        _caseDescribtion,
        _caseLocation,
        _casePrice,
        _caseDocs,
        _caseDecKey   
        )
      .send({ from: this.state.accounts[0] })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  };

  purchaseCase(_caseId, _casePrice){
    this.setState({ loading: true });
    console.log("id we receive", _caseId)
    this.state.contract.methods
      .purchaseCase(_caseId)
      .send({ from: this.state.accounts[0], value: _casePrice })
      .once("receipt", receipt => {
        this.setState({ loading: false });
      });
  };

  getCaseDocs(_caseId){
    let res;
    this.setState({ loading: true });
    console.log("id of case receive", _caseId)
    return  res = this.state.contract.methods
      .getCaseDocs(_caseId)
      .send({ from: this.state.accounts[0] })
      .once("case Link given", receipt => {
        this.setState({ loading: false });
      }); 

  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      
        <NavBar location={this.props.location} account={this.state.accounts[0]} />

        <Router history={history}>
          <Switch>
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
                history={history}
                  caseCount={this.state.caseCount}
                  cases={this.state.cases}
                  purchaseCase={this.purchaseCase}
                  getCaseDocs={this.getCaseDocs}
                  loading={this.state.loading}
                  {...props}
                />
              )}
            />
            <Route path="/newcase" render={props => (
              
                <NewCase
                history={history}
                  caseCount={this.state.caseCount}
                  createCase={this.createCase}
                  
                  loading={this.state.loading}
                  {...props}
                />
              )} />

              <Route path="/chat/:id" render={props => (
                
                <ChatRoom
                history={history}
                selKase ={this.state.cases[(this.props.location.pathname).substring(6)]}
                {...props} //this was painful to find
                />
              )} />
                {console.log ("hello from router")}
                {console.log ("hello from historu router", history)}
              </div>
          </Switch>
          
        </Router>
      </div>
    );
  }
}

export default withRouter(App);
