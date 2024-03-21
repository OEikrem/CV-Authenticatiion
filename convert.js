const fs = require('fs');

// Function to read a text file and convert its content to JSON
function txtFileToJson(txtFilePath) {
    try {
        // Read the text file synchronously
        const data = fs.readFileSync(txtFilePath, 'utf-8');
        
        // Split the text file content by lines
        const lines = data.split('\n');
        
        // Create an object to hold the JSON data
        const jsonData = {};

        // Populate the JSON object
        lines.forEach((line, index) => {
            // Check if the line is not empty
            if (line.trim() !== '') {
                // Split the line into key and value
                const [key, ...valueParts] = line.split(':');
                // Rejoin the value parts in case there are multiple ':' in the value
                const value = valueParts.join(':').trim();
                // Assign key-value pair to JSON object
                jsonData[key.trim()] = value;
            }
        });

        return jsonData;
    } catch (error) {
        console.error('Error reading or converting text file to JSON:', error);
        throw error;
    }
}

// Function to save JSON data to a JSON file
function saveJsonToFile(jsonData, jsonFilePath) {
    try {
        // Convert JSON object to string
        const jsonString = JSON.stringify(jsonData, null, 2); // Add indentation for readability
        
        // Write JSON string to a file
        fs.writeFileSync(jsonFilePath, jsonString, 'utf-8');
        
        console.log('JSON data saved to', jsonFilePath);
    } catch (error) {
        console.error('Error saving JSON data to file:', error);
        throw error;
    }
}

// Example usage:
const txtFilePath = 'C:/Users/eikre/OneDrive/Documents/Studier/bachelor2022/IBE500/capstone/CV_Kalle.txt'; // Replace with the correct path to your text file
const jsonFilePath = 'C:/Users/eikre/OneDrive/Documents/Studier/bachelor2022/IBE500/capstone/CV_Kalle.json'; // Specify the path where you want to save the JSON file

// Convert text file to JSON
const jsonData = txtFileToJson(txtFilePath);

// Save JSON data to file
saveJsonToFile(jsonData, jsonFilePath);