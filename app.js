/*
EPISODE 1
https://www.youtube.com/watch?v=YDSJpIrPmgM

VIDEO SERIES

FINISH UP GETTING YOUR CODE ON WEB3JS TO BECOME A WRAPPER

*/

/*
  Custodial Contract Methods:
  contract CustodialContract {
      address client;
      bool _switch = false;

      event UpdateStatus(string _msg);
      event UserStatus(string _msg, address user, uint amount);

      constructor() public {
          client = msg.sender;
      }

      modifier ifClient(){
          if(msg.sender != client){
              revert();
          }
          _;
      }

      function depositFunds() payable public{
          emit UserStatus('User transferred some money: ', msg.sender, msg.value);
      }

      function withdrawFunds(uint amount) ifClient public{
          if(client.send(amount)){
             emit UpdateStatus('User transferred some money');
              _switch = true;
          }
          else{
              _switch= false;
          }
      }

      function getFunds() ifClient constant public returns(uint){
          return client.balance;
      }
  }
*/


const express = require('express');
const app = express();
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const cors = require('cors');

app.use(cors())

const custodialcontractContract = new web3.eth.Contract(
  [{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getFunds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"depositFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_msg","type":"string"}],"name":"UpdateStatus","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_msg","type":"string"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"UserStatus","type":"event"}],
  '0x1db48b00d587927eb854484cc9a5507e558d9f40',
  {
     from: '0xCEb357B0627C8360544698CC8814bb1BbC26A0fa',
     data: '0x608060405260008060146101000a81548160ff02191690831515021790555034801561002a57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506103878061007a6000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063155dd5ee1461005c5780634d9b373514610089578063e2c41dbc146100b4575b600080fd5b34801561006857600080fd5b50610087600480360381019080803590602001909291905050506100be565b005b34801561009557600080fd5b5061009e61021a565b6040518082815260200191505060405180910390f35b6100bc6102b5565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561011957600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050156101fc577ffbf2866ab63740741f358479d82bb93999720f54e4497f1466197a2962e8206360405180806020018281038252601b8152602001807f55736572207472616e7366657272656420736f6d65206d6f6e6579000000000081525060200191505060405180910390a16001600060146101000a81548160ff021916908315150217905550610217565b60008060146101000a81548160ff0219169083151502179055505b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561027757600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1631905090565b7ff2582ef5c505d53f90ab4e1cc9882d474eec5d2167acec2d5384b708e3f75152333460405180806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281038252601d8152602001807f55736572207472616e7366657272656420736f6d65206d6f6e65793a20000000815250602001935050505060405180910390a15600a165627a7a7230582052a0a4f66e4bbaa06bce898dafc6f86934f5b08aabe7543434b9bc88a072e7a80029',
     gas: '4700000'
 })

app.get('/deposit-funds', (req, res, next) =>{
  console.log('Deposit Funds');
  custodialcontractContract.methods.depositFunds().send({from: '0xCEb357B0627C8360544698CC8814bb1BbC26A0fa'}).then(e => res.send('Funds Deposited'));
})

app.get('/withdraw-funds', (req, res, next) =>{
  console.log('Withdraw Funds');
  custodialcontractContract.methods.withdrawFunds(1000).send({from: '0xCEb357B0627C8360544698CC8814bb1BbC26A0fa'}).then(e => res.send('Funds Withdrawn'));
})

app.get('/get-funds', (req, res, next) =>{
  console.log('Get Funds');
  custodialcontractContract.methods.getFunds().call().then(e => res.send(e));
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

app.listen(3000);
