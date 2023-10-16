import React, { Component } from 'react';
import Loading from './Loading';
import Navbar from './Navbar';
import Main from './Main';
import Web3 from 'web3';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      amount: null,
      balance: null,
      contract: null,
      event: null,
      loading: false,
      network: null,
      maxBet: 0,
      minBet: 0,
      web3: null,
      wrongNetwork: false,
      contractAddress: null,
    };

    this.makeBet = this.makeBet.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setState = this.setState.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
  }

  async loadWeb3() {
    if (typeof window.ethereum !== 'undefined' && !this.state.wrongNetwork) {
      let accounts, network, balance, web3, maxBet, minBet, contract, contract_abi, contract_address;

      // Don't refresh DApp when the user changes the network
      window.ethereum.autoRefreshOnNetworkChange = false;

      web3 = new Web3(window.ethereum);
      this.setState({ web3: web3 });

      contract_abi = [
        // Contract ABI here
      ];
      contract_address = '0x2FeF79F6b8777D4C13E2D7be422628A5B458b7ad'; // Rinkeby
      contract = new web3.eth.Contract(contract_abi, contract_address);
      accounts = await web3.eth.getAccounts();

      // Update the data when the user initially connects
      if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
        balance = await web3.eth.getBalance(accounts[0]);
        maxBet = await web3.eth.getBalance(contract_address);
        minBet = await contract.methods.weiInUsd().call();
        this.setState({ account: accounts[0], balance: balance, minBet: minBet, maxBet: maxBet });
      }

      this.setState({
        contract: contract,
        contractAddress: contract_address,
      });

      // Update account & balance when the user changes the account
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
          balance = await web3.eth.getBalance(accounts[0]);
          maxBet = await web3.eth.getBalance(contract_address);
          minBet = await contract.methods.weiInUsd().call();

          this.setState({ account: accounts[0], balance: balance, minBet: minBet, maxBet: maxBet });
        } else {
          this.setState({ account: null, balance: 0 });
        }
      });

      // Update data when the user switches the network
      window.ethereum.on('chainChanged', async (chainId) => {
        network = parseInt(chainId, 16);
        if (network !== 4) {
          this.setState({ wrongNetwork: true });
        } else {
          if (this.state.account) {
            balance = await this.state.web3.eth.getBalance(this.state.account);
            maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress);
            minBet = await this.state.contract.methods.weiInUsd().call();

            this.setState({ balance: balance, maxBet: maxBet, minBet: minBet });
          }
          this.setState({ network: network, loading: false, onlyNetwork: false, wrongNetwork: false });
        }
      });
    }
  }

  async makeBet(bet, amount) {
    const networkId = await this.state.web3.eth.net.getId();
    if (networkId !== 4) {
      this.setState({ wrongNetwork: true });
    } else if (typeof this.state.account !== 'undefined' && this.state.account !== null) {
      var randomSeed = Math.floor(Math.random() * Math.floor(1e9));

      // Send bet to the contract and wait for the verdict
      this.state.contract.methods.game(bet, randomSeed).send({ from: this.state.account, value: amount }).on('transactionHash', (hash) => {
        this.setState({ loading: true });
        this.state.contract.events.Result({}, async (error, event) => {
          const verdict = event.returnValues.winAmount;
          if (verdict === '0') {
            window.alert('lose :(');
          } else {
            window.alert('WIN!');
          }

          // Prevent error when the user logs out while waiting for the verdict
          if (this.state.account !== null && typeof this.state.account !== 'undefined') {
            const balance = await this.state.web3.eth.getBalance(this.state.account);
            const maxBet = await this.state.web3.eth.getBalance(this.state.contractAddress);
            this.setState({ balance: balance, maxBet: maxBet });
          }
          this.setState({ loading: false });
        });
      }).on('error', (error) => {
        window.alert('Error');
      });
    } else {
      window.alert('Problem with the account or network');
    }
  }

  onChange(value) {
    this.setState({ amount: value });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />&nbsp;
        {this.state.wrongNetwork ? (
          <div className="container-fluid mt-5 text-monospace text-center mr-auto ml-auto">
            <div className="content mr-auto ml-auto">
              <h1>Please Enter Rinkeby Network</h1>
            </div>
          </div>
        ) : this.state.loading ? (
          <Loading
            balance={this.state.balance}
            maxBet={this.state.maxBet}
            minBet={this.state.minBet}
            web3={this.state.web3}
          />
        ) : (
          <Main
            amount={this.state.amount}
            balance={this.state.balance}
            makeBet={this.makeBet}
            onChange={this.onChange}
            maxBet={this.state.maxBet}
            minBet={this.state.minBet}
            loading={this.state.loading}
            web3={this.state.web3}
          />
        )}
      </div>
    );
  }
}

export default App;
