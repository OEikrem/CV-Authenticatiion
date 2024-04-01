const axios = require('axios');

class YourClass {
    constructor() {
        // Initialize any class properties or configurations here
    }

    async GetOPReturnByTxHash(hash) {
        try {
            // Make GET request to Whatsonchain API
            const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/test/tx/${hash}/opreturn`);

            // Check if response status is successful
            if (response.status === 200) {
                // Extract OP_RETURN data from response
                const opReturnData = response.data;

                // Decode hexadecimal string to ASCII
                const decodedData = Buffer.from(opReturnData[0].hex, 'hex').toString('utf8');

                // Split the decoded data into an array (example: splitting by comma)
                const dataArray = decodedData.split(',');

                // Return array containing the decoded data
                return dataArray;
            } else {
                console.log('Failed to retrieve OP_RETURN data:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error retrieving OP_RETURN data:', error);
            return null;
        }
    }
}

// Transaction and data to extract:
const yourObject = new YourClass();
const transactionId = '39d837af5eb68e26e7141b77ec46a9e5a89a52d73ea1e982e6fe55f93763a44e';

yourObject.GetOPReturnByTxHash(transactionId)
    .then(dataArray => {
        if (dataArray) {
            console.log('Decoded OP_RETURN data array:', dataArray);
        } else {
            console.log('Failed to retrieve OP_RETURN data.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
