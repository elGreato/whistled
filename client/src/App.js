import React, { Component } from "react";
import MarketplaceContract from "./abis/Marketplace.json";
import getWeb3 from "./utils/getWeb3";
import NavBar from "./components/NavBar";
import "./App.css";

import Welcome from "./components/Welcome";
import Mart from "./components/Mart";
import NewCase from "./components/NewCase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

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

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <NavBar account={this.state.accounts[0]} />

        <Router>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/mart" component={Mart} />
            <Route path="/newcase" component={NewCase} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
