const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require ('./compile');

const provider = new HDWalletProvider(
	'pelican guard book woman denial axis people track pride swift gentle atom',
	'https://rinkeby.infura.io/6tyZSrcywaJSoeSlchNs'
);
const web3 = new Web3(provider);
//use async,await syntax multiple times

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('attempting to deploy', accounts[0]);
	
	const result = await new web3.eth.Contract(JSON.parse(interface))//abi
		.deploy({data: bytecode})
		.send({gas: '1000000', from: accounts[0]});
	// to record where our contract got deployed?
	console.log(interface);
	console.log('contract deployed to - ',result.options.address);
};

deploy();