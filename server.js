//Imports
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Tell express which static files to serve
app.use(express.static('public'));

/*
GET Requests here
*/
app.get('/', (request, response) => {
    console.log(__dirname);
    const main_page_path = path.join(__dirname, './public/index.html');
    response.sendFile(main_page_path); // Sends main page if the root file is requested
});
/*
End GET Requests
*/


// Required by Heroku for hosting
let port = process.env.PORT;
if (port == null || port == '') {
    port = 5000; // If running on local machine
}

const server = app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});