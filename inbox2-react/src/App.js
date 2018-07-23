import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


//start from render() go to thisstate, feed null value to manager, then go to componentdomount(), take the address from the contract (lottery.sol), the set state of the new address...  

class App extends Component {
  /*	
  constructor (props){
	super(props);
	
	this.state = {manager: ''};
  }*/

	state = {manager : '', players : [], balance :'', value : '',message:''};//taking place inside the constructor
  
  async componentDidMount(){
	const manager = await lottery.methods.manager().call();
	const players = await lottery.methods.getPlayers().call();
	const balance = await web3.eth.getBalance(lottery.options.address);
	
	this.setState({manager, players});
  }
  
  
  onSubmit = async (event) => {
	event.preventDefault();
	const accounts = await web3.eth.getAccounts();
	
	this.setState({message : 'waiting to update'});
	
	await lottery.methods.enter().send({
	from : accounts[0], 
	value: web3.utils.toWei(this.state.value, 'ether') 
	});
	
	this.setState({message : 'you are now a part of lottery'});
  };
  
  onClick = async () => {
	const accounts = await web3.eth.getAccounts();
	this.setState({message: 'Waiting...'});
	
	await lottery.methods.pickWinner().send({
		from:accounts[0]
	});
	
	this.setState({message : 'A winner has been picked'});
  };
  
   
  render() {
	//console.log(web3.version);
	//web3.eth.getAccounts().then(console.log);
    return (
     <div>
		<h2>Contract(Lottery)</h2>
		<p>This Contract is managed by {this.state.manager}  </p>
		<p>
		There are currently {this.state.players.length} people entered the lottery to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!!
		</p>
	 <form onSubmit = {this.onSubmit}>
	 <h5> Enter the lottery?</h5>
	 <div>
		<label> Amount you want to enter withh </label>
		<input
			value= {this.state.value}
			onChange = {event => this.setState({value : event.target.value})}
		/>
	 </div>
	 
	 <button>enter</button>
	 </form>
	
		<h4>Ready to pick winner</h4>
		<button onClick = {this.onClick}> Pick a Winner </button>
	
	 
	 <h5>{this.state.message}</h5>
	 </div>
    );
  }
}

export default App;
