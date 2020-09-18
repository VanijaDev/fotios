let Web3 = require('web3');
const rpcURL = 'HTTP://127.0.0.1:8545';
const web3 = new Web3(rpcURL);

const EthereumTx = require('ethereumjs-tx').Transaction;

const abi = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"kill","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
const bytecode = '608060405260006100176001600160e01b0361006616565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35061006a565b3390565b610412806100796000396000f3fe60806040526004361061004a5760003560e01c80633ccfd60b1461004c57806341c0e1b514610061578063715018a6146100765780638da5cb5b1461008b578063f2fde38b146100bc575b005b34801561005857600080fd5b5061004a6100ef565b34801561006d57600080fd5b5061004a61018d565b34801561008257600080fd5b5061004a6101e9565b34801561009757600080fd5b506100a061028b565b604080516001600160a01b039092168252519081900360200190f35b3480156100c857600080fd5b5061004a600480360360208110156100df57600080fd5b50356001600160a01b031661029a565b6100f7610392565b6000546001600160a01b03908116911614610147576040805162461bcd60e51b815260206004820181905260248201526000805160206103bd833981519152604482015290519081900360640190fd5b600061015161028b565b6040519091506001600160a01b038216904780156108fc02916000818181858888f19350505050158015610189573d6000803e3d6000fd5b5050565b610195610392565b6000546001600160a01b039081169116146101e5576040805162461bcd60e51b815260206004820181905260248201526000805160206103bd833981519152604482015290519081900360640190fd5b3380ff5b6101f1610392565b6000546001600160a01b03908116911614610241576040805162461bcd60e51b815260206004820181905260248201526000805160206103bd833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b6000546001600160a01b031690565b6102a2610392565b6000546001600160a01b039081169116146102f2576040805162461bcd60e51b815260206004820181905260248201526000805160206103bd833981519152604482015290519081900360640190fd5b6001600160a01b0381166103375760405162461bcd60e51b81526004018080602001828103825260268152602001806103976026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b339056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572a264697066735822122006a1a185976b2e3e70e35167b6042bee7c00e3d19c36773af9cce74348ef9ba264736f6c63430006000033';
const OWNER = '0x72fda39fb71624b4111b1e36652Bf293a318782A';

const Index = {
  scAddress: "",
  scInstance: null,

  deploy: function() {
    // 1
    let deploy_contract = new web3.eth.Contract(JSON.parse(abi));
    console.log("deploy_contract: ", deploy_contract);

    // 2
    let payload = {
      data: bytecode
    };
    console.log("payload: ", payload);

    // 3
    let parameter = {
      from: OWNER,
      gas: web3.utils.toHex(800000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
    };
    console.log("parameter: ", parameter);

    // 4
    deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
      console.log('Transaction Hash :', transactionHash);
      console.log('Transaction is being mining...');
    }).on('confirmation', () => {}).then((newContractInstance) => {
      Index.scAddress = newContractInstance.options.address;
      console.log('Index.scAddress : ', Index.scAddress);

      Index.scInstance = new web3.eth.Contract(JSON.parse(abi), Index.scAddress);
      console.log("scInstance: ", Index.scInstance);
    });
  },

  checkBalance: async function() {
    console.log("balance: ", await web3.eth.getBalance(Index.scAddress));
  },

  withdraw: async function() {
    console.log("withdraw");

    Index.scInstance.methods.withdraw().send({from: OWNER})
    .on('transactionHash', function(transactionHash){
      console.log('Transaction Hash :', transactionHash);
      console.log('Transaction is being mining...');
    })
    .on('confirmation', function(confirmationNumber, receipt){
      console.log("withdraw done");
    })
  },

  kill: async function() {
    console.log("kill");
    console.log(abi);
    console.log(Index.scAddress);

    Index.scInstance.methods.kill().send({from: OWNER})
    .on('transactionHash', function(transactionHash){
      console.log('Transaction Hash :', transactionHash);
      console.log('Transaction is being mining...');
    })
    .on('confirmation', function(confirmationNumber, receipt){
      Index.scInstance = new web3.eth.Contract(JSON.parse(abi), Index.scAddress);
      console.log("scInstance: ", Index.scInstance);
    })
  }
};

window.Index = Index;