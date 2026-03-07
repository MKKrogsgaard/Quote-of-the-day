//Imports
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

function parseQuoteJSON() {
    let data = fs.readFileSync('public/quotes_folder/quotes.json', 'utf8');
    let json_contents = JSON.parse(data)
    return json_contents
}


// Tell express which static files to serve
app.use(express.static('public'));

/*
GET Requests start
*/

app.get('/', (request, response) => {
    console.log(__dirname);
    const main_page_path = path.join(__dirname, './public/index.html');
    response.sendFile(main_page_path); // Sends main page if the root file is requested
});


app.get('/public/quotes_folder/quote', async (request, response) => {
    try {
        let json_data = parseQuoteJSON();
        response.json(json_data);
    } catch (err) {
        response.status(500).json({error: err.message});
    }
});

/*
GET Requests stop
*/


// Required by Heroku for hosting
let port = process.env.PORT;
if (port == null || port == '') {
    port = 5000; // If running on local machine
}

const server = app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});