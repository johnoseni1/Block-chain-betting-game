import React, { Component } from 'react';
// import dice_logo from '../logos/dice_logo.png';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
       
        {/* <img src={dice_logo} height="32" alt="logo" /> */}
         BETTING BLOCK CHAINGAME
       
        {!this.props.account ? <div id="loader" className="spinner-border text-light" role="status"></div> :
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <a
              className="text-white"
              href={"https://rinkeby.etherscan.io/address/" + this.props.account}
              target="_blank"
              rel="noopener noreferrer"
            >
              {(this.props.account)}
            </a>&nbsp;
          </li>
        }
      </nav>
    );
  }
}

export default Navbar;