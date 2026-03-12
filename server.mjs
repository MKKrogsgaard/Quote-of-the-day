//Imports
import express from 'express';
import path from 'path';
import fs from 'fs';
import schedule from 'node-schedule';

const app = express();

debug_quote = {
    'quote': 'This is a debug quote. It is really long, which helps me see if the formatting is working correctly. If you can see this, something has probably gone wrong ¯\_(ツ)_/ Here, have some lorem ipsum as a consolation prize: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    'author': '- Author Name Here'
}

// Set a quote upon server startup
let current_quote = '';
refreshQuote();
console.log(`Server starting. Setting current quote:`);
console.log(current_quote);

function formatTime(number) {
    /* Adds a leading zero to a number if the number is less than 10 */
    return number < 10 ? '0' + number : number;
}
async function refreshQuote() {
    let now = new Date();
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let seconds = formatTime(now.getSeconds());

    console.log(`[DEBUG]: Refreshing quote. Current time: ${hours}:${minutes}:${seconds}`);
    console.log(current_quote);

    // Fetch parsed quotes from the server
    // Retrieve and send JSON data from quotes.json
    let data = fs.readFileSync('public/quotes_folder/quotes.json', 'utf8');
    let quotes_array = JSON.parse(data);

    // Select and display a random quote
    let random_index = Math.floor(Math.random() * quotes_array.length);
    current_quote = quotes_array[random_index];
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

// Current quote GET request
app.get('/public/quotes_folder/current_quote', async (request, response) => {
    try {
        // Send the current quote
        response.json(current_quote);
    } catch (err) {
        response.status(500).json({error: err.message});
    }
});

// Debug quote refresh
app.get('/public/quotes_folder/quote', async (request, response) => {
    try {
        // Retrieve and send JSON data from quotes.json
        let data = fs.readFileSync('public/quotes_folder/quotes.json', 'utf8');
        let json_contents = JSON.parse(data);
        response.json(json_contents);
    } catch (err) {
        response.status(500).json({error: err.message});
    }
});

/*
GET Requests stop
*/

// Bind to environment port for web hosting
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, '0.0.0.0', () => {
//     console.log(`The server is running on port ${PORT}`);
// });
const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});


const quote_scheduling_rule = new schedule.RecurrenceRule();
quote_scheduling_rule.hour = 0;
quote_scheduling_rule.minute = 0;
quote_scheduling_rule.tz = 'Europe/Berlin'

const quote_job = schedule.scheduleJob(quote_scheduling_rule, function(){
  refreshQuote();
});