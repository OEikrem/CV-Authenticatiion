const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt user for input
function promptInput(promptText) {
  return new Promise((resolve, reject) => {
    rl.question(promptText, (input) => {
      resolve(input);
    });
  });
}

async function write_message(address, change, msg, PrivKeyWif) {
  try {
    const woc = require('whatsonchain');
    const whatsonchain = new woc('test');

    // Retrieve UTXOs for the address
    const utxos = await whatsonchain.utxos(address);

    // Building the transaction
    const {
      Address,
      TxBuilder,
      TxOut,
      KeyPair,
      Bn,
      PrivKey,
      Script
    } = require('bsv2');

    const builder = new TxBuilder();

    // Input section
    for (const utxo of utxos) {
      const utxoFund = TxOut.fromProperties(
        Bn().fromNumber(utxo.value),
        Address.Testnet.fromString(address).toTxOutScript()
      );
      const txidToBuff = Buffer.from(utxo.tx_hash, 'hex').reverse();
      builder.inputFromPubKeyHash(txidToBuff, utxo.tx_pos, utxoFund);
    }

    // Computing intermediate results
    const data = msg.map((str) => Buffer.from(str));
    builder.outputToScript(Bn().fromNumber(0), Script.fromSafeDataArray(data));
    builder.setChangeAddress(Address.Testnet.fromString(change)); // Set change address
    builder.build(); // This saves the tx inside the "tx" attribute. Build tx

    // Signing the transaction
    const keyPairs = [KeyPair.Testnet.fromPrivKey(PrivKey.fromWif(PrivKeyWif))];
    builder.signWithKeyPairs(keyPairs); // signed. Now is locked

    // Broadcast transaction
    const txHex = builder.tx.toHex();
    return whatsonchain.broadcast(txHex);
  } catch (error) {
    throw error;
  }
}

async function main() {
  process.env.NETWORK = 'testnet';

  try {
    const addr = await promptInput("Adress: ");
    const change = await promptInput("ChangeAdress: ");
    const PrivKeyWif = await promptInput("Your PrivateKey: ");
    
    const text = await promptInput("Are the work history approved (Answer in full sentence): ");
    const txidReference = await promptInput("Enter the reference to specific txid: ");
    const msg = [text, `Reference to  txid: ${txidReference}`];

    const result = await write_message(addr, change, msg, PrivKeyWif);
    console.log(result);
  } catch (error) {
    console.log("Something wrong happened", error);
  } finally {
    rl.close();
  }
}

main();
