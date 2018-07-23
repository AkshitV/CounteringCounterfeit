import Web3 from 'web3';
const web3 = new Web3(window.web3.currentProvider); //metamask also provides web3 and provider, but to overpower that we are using our version of web3.//or we are using the provider given by metamask
export default web3;
