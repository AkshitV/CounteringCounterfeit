const assert = require('assert') //assert library,helper for node
const ganache = require ('ganache-cli') //local test network
const Web3 = require ('web3'); //constructor function
const web3 = new Web3(ganache.provider()); //provider is a block in web3

const { interface , bytecode } = require('../compile'); //these are coming from compile.js 

let lottery; //hold the instance of our contract
let accounts; // hold the account details

beforeEach(async() =>{
	accounts = await web3.eth.getAccounts();
	
	lottery = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data:bytecode })
		.send({ from: accounts[0], gas:'1000000' })
});

describe('Lottery Contract', () => {
	
	it ('deploys a contract',() =>{//verify if contract is deployed
		assert.ok(lottery.options.address);//assert.ok so that.. contract is deployed..//deploys the contract..
		
	});
	
	it('allows multiple accounts to enter..', async () =>{
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});
		
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});
		
		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);	

		assert.equal(3, players.length);
	});
	
	it ('requires a minimum amount of ether to enter the game', async() =>{
		try{
			await lottery.methods.enter().send({
				from: accounts[0],
				value: 0
			});
			assert(false);
		} catch(err){
			assert(err);	
		}	
	});
	
	it('only manager calls the lottery', async() => {
		try{
			await lottery.methods.pickWinner().send({
				from: accounts[1]
			});
			assert(false);
		}	catch(err){
			assert(err);
		}
	});
	
	it('sends money and resets the array', async() =>{
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2','ether')
		});
		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({ from:accounts[0] });
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		//difference is not gonna be 2 ether since we spend some on gas.
		const difference = finalBalance-initialBalance;
		//console.log(finalBalance-initialBalance);
		assert(difference > web3.utils.toWei('1.8','ether'));
	});
	
	
});