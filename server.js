//Imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const app = express();

debug_quote = {
    'quote': 'This is a debug quote. It is really long, which helps me see if the formatting is working correctly. If you can see this, something has probably gone wrong ¯\_(ツ)_/ Here, have some lorem ipsum as a consolation prize: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    'author': '- Author Name Here'
}

// Set a quote upon server startup
let current_quote = '';
let seed = 0;
refreshQuote();
console.log(`Server starting. Seed: ${seed} Current quote:`);
console.log(current_quote);

function formatTime(number) {
    /* Adds a leading zero to a number if the number is less than 10 */
    return number < 10 ? '0' + number : number;
}

function jsf32(a, b, c, d) {
    /* Implementation of the Jenkins' Small Fast seeded random number generator */
    return function() {
    a |= 0; b |= 0; c |= 0; d |= 0;
    let t = a - (b << 27 | b >>> 5) | 0;
    a = b ^ (c << 17 | c >>> 15);
    b = c + d | 0;
    c = d + t | 0;
    d = a + t | 0;
    return (d >>> 0) / 4294967296;
  }
}

function getRandomIndex(seed, array_length) {
    /* Returns a random index for an array of a given length, using a seed for reproducibility */
    let rand = jsf32(seed, seed, seed, seed);
    return Math.floor(rand() * array_length);
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

    // Use current data as random seed to ensure that the quote changes every day
    let seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    let random_index = getRandomIndex(seed, quotes_array.length);
    current_quote = quotes_array[random_index];

    // // Select and display a random quote
    // let random_index = Math.floor(Math.random() * quotes_array.length);
    // current_quote = quotes_array[random_index];
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
const PORT = process.env.PORT || 5000;
// For local hosting (debugging)
// const PORT = 5000;


const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`The server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => console.error('unhandledRejection', err));
process.on('uncaughtException', (err) => console.error('uncaughtException', err));

const quote_scheduling_rule = new schedule.RecurrenceRule();
quote_scheduling_rule.hour = 0;
quote_scheduling_rule.minute = 0;
quote_scheduling_rule.tz = 'Europe/Berlin'

const quote_job = schedule.scheduleJob(quote_scheduling_rule, async function(){ 
    await refreshQuote();
});