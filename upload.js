const fs = require('fs');

process.env.NETWORK = 'testnet';
const woc = require('whatsonchain');
const whatsonchain = new woc('test');
const {
    Address,
    TxBuilder,
    TxOut,
    KeyPair,
    Bn,
    PrivKey,
    Script
} = require('bsv2');

/**
 * Retrieves an ordered list of unspent transaction outputs (UTXOs) for a given BSV <network> address.
 * Calls https://api.whatsonchain.com/v1/bsv/<network>/address/${address}/unspent
 * Parameters needed for TxBuilder to fill the spending output/UTXO values from previous transaction.
 * This endpoint retrieves ordered list of UTXOs (unspent transactions: "height", "tx_pos", "tx_hash", "value")
 * @param {string} address
 * @return {Promise<object>}
 */
const get_utxos = async function (address) {
    try {
        return whatsonchain.utxos(address);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Builds and broadcasts a transaction
 * Returns transaction hash if success
 * @param {object} utxos
 * @param {string} address
 * @param {string} change
 * @param {object} msgJSON
 * @param {string} PrivKeyWif
 * @return {Promise<string>}
 */
function write_message(utxos, address, change, msgJSON, PrivKeyWif) {
    let txidToBuff;
    let utxoFund;
    // Building the transaction
    const builder = new TxBuilder();
    // Input section
    let fLen = utxos.length;
    for (let i = 0; i < fLen; i++) {
        utxoFund = TxOut.fromProperties(
            Bn().fromNumber(utxos[i].value),
            Address.Testnet.fromString(address).toTxOutScript()
        );
        txidToBuff = Buffer.from(utxos[i].tx_hash, 'hex').reverse();
        builder.inputFromPubKeyHash(txidToBuff, utxos[i].tx_pos, utxoFund); // tx.id, utxo.n, utxo.value, utxo.address
    }
    /* Computing intermediate results */
    const data = Buffer.from(JSON.stringify(msgJSON)); // Stringify JSON and convert to buffer
    builder.outputToScript(Bn().fromNumber(0), Script.fromSafeData(data));
    builder.setChangeAddress(Address.Testnet.fromString(change)); // Set change address
    builder.build(); // This saves the tx inside the "tx" attribute. Build tx
    // Signing the transaction
    const keyPairs = [KeyPair.Testnet.fromPrivKey(PrivKey.fromWif(PrivKeyWif))];
    builder.signWithKeyPairs(keyPairs); // signed. Now is locked
    return whatsonchain.broadcast(builder.tx.toHex());
}

const addr = "mjyMfUEzYc49bApj6GvpBajrnCw6KsrNtY";
const change = "mi6Xmu6xUvWwLp68MpTTh8nt75eUCygEMC";
const PrivKeyWif = "cVxh7zByhptmAcL195i8Udx5qEZ8fw33A7YKu1hT4VZcrAK1XvhU";

// Read JSON file
fs.readFile("C:/Users/eikre/OneDrive/Documents/STUDIER/Bachelor2022/IBE500/capstone/CV_Kalle.json", 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }
    try {
        const msgJSON = JSON.parse(data);
        get_utxos(addr)
            .then(utxos => write_message(utxos, addr, change, msgJSON, PrivKeyWif))
            .then(result => console.log(result))
            .catch(error => console.log("Something wrong happened", error));
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
    }
});
