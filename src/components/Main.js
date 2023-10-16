import React, { Component } from 'react';
import diceLogo from '../logos/dice.webp';
import ethLogo from '../logos/eth.png';
import './App.css';

class Main extends Component {
  handleLowButtonClick = () => {
    if (!this.validateInput()) return;
    this.props.makeBet(0, this.props.web3.utils.toWei(this.props.amount.toString()));
  };

  handleHighButtonClick = () => {
    if (!this.validateInput()) return;
    const minBet = Number(this.props.web3.utils.fromWei(this.props.minBet.toString()));
    if (this.props.amount < minBet) {
      window.alert('Please make sure that:\n* You typed a positive integer or float number\n* Typed value is >= than MinBet (not all ETH decimals visible)\n* You are using the Rinkeby network');
      return;
    }
    this.props.makeBet(1, this.props.web3.utils.toWei(this.props.amount.toString()));
  };

  validateInput = () => {
    const reg = /^[0-9]*.?[0-9]+$/;
    if (!reg.test(this.props.amount)) {
      window.alert('Please type positive integer or float numbers');
      return false;
    }
    return true;
  };

  render() {
    return (
      <div className="container-fluid mt-5 col-m-4" style={{ maxWidth: '550px' }}>
        <div className="col-sm">
          <main role="main" className="col-lg-12 text-monospace text-center text-white">
            <div className="content mr-auto ml-auto">
              <div id="content" className="mt-3">
                <div className="card mb-4 bg-dark border-danger">
                  <div className="card-body">
                    <div>
                      <img src={diceLogo} width="225" alt="Dice Logo" />
                    </div>
                    &nbsp;
                    <p></p>
                    <div className="input-group mb-4">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control form-control-md"
                        placeholder="Bet amount..."
                        onChange={(e) => this.props.onChange(e.target.value)}
                        required
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <img src={ethLogo} height="20" alt="ETH Logo" />&nbsp;<b>ETH</b>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-danger btn-lg"
                      onClick={this.handleLowButtonClick}
                    >
                      Low
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      onClick={this.handleHighButtonClick}
                    >
                      High
                    </button>
                  </div>
                  <div>
                    {!this.props.balance ? (
                      <div id="loader" className="spinner-border float-right" role="status"></div>
                    ) : (
                      <div className="float-right" style={{ width: '220px' }}>
                        <div className="float-left" style={{ height: '17px' }}>
                          <b>MaxBet&nbsp;</b>
                        </div>
                        <div className="float-right" style={{ height: '17px' }}>
                          {Number(this.props.web3.utils.fromWei(this.props.maxBet.toString())).toFixed(5)} <b>ETH&nbsp;</b>
                        </div>
                        <br></br>
                        <div className="float-left" style={{ height: '17px' }}>
                          <b>MinBet</b>($1)&nbsp;
                        </div>
                        <div className="float-right" style={{ height: '17px' }}>
                          {Number(this.props.web3.utils.fromWei(this.props.minBet.toString())).toFixed(5)} <b>ETH&nbsp;</b>
                        </div>
                        <br></br>
                        <div className="float-left">
                          <b>Balance&nbsp;</b>
                        </div>
                        <div className="float-right">
                          {Number(this.props.web3.utils.fromWei(this.props.balance.toString())).toFixed(5)} <b>ETH&nbsp;</b>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
