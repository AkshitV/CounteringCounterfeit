pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players; //address of people entered the contest.
    
    function Lottery() public{
        //constructor.
        //msg is a global variable
        manager = msg.sender; 
        //store the address of the person who created the contract.
        
    }
    
    function enter() public payable {
        require(msg.value> .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() public view returns (uint){
        //view since we are not modifying and private...
        return uint(keccak256(block.difficulty, now, players));
        //(SHA 256)above returns a hash, converted to integer. 
    }
    
    function pickWinner() public restricted{//restricted for modifier
        
        //require(msg.sender==manager); removed for modifier
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        //transferring the contract balance via reference variable
        players = new address[](0);
        
        //empty out the array and get ready for next round
    }
//    function returnEntries(){
        //require (msg.sender == manager);
//    }
    modifier restricted(){ // used for reducing the code
        require(msg.sender == manager);
        _;//look for restricted and add the above line in that function as in our case pickWinner
        
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}    