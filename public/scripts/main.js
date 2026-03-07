
QUOTES_JSON_PATH = 'public/quotes_folder/quotes.json'

function toggleDebugButtonsVisibility() {
  var random_quote_button = document.getElementById("random-quote-button");
  if (random_quote_button.style.display === "none") {
    random_quote_button.style.display = "block";
  } else {
    random_quote_button.style.display = "none";
  }

  var current_quote_button = document.getElementById("current-quote-button");
  if (current_quote_button.style.display === "none") {
    current_quote_button.style.display = "block";
  } else {
    current_quote_button.style.display = "none";
  }
} 

function formatTime(number) {
    /* Adds a leading zero to a number if the number is less than 10 */
    return number < 10 ? '0' + number : number;
}

async function displayCurrentQuote() {
    let now = new Date();
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let seconds = formatTime(now.getSeconds());

    // Fetch current quote from the server
    const response = await fetch('/public/quotes_folder/current_quote');
    if(!response.ok) {
        console.error('Quote fetch error: Failed to fetch quote from server');
        return;
    }
    try {
        const current_quote = await response.json();
        // Display the quote
        document.getElementById('quote-text').innerHTML = current_quote.quote;
        document.getElementById('quote-author').innerHTML = current_quote.author;   
    } catch (err) {
        console.error(err);
    }
}

async function debugRefreshQuote() {
    let now = new Date();
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let seconds = formatTime(now.getSeconds());

    console.log(`[DEBUG]: Manually refreshing quote. Current time: ${hours}:${minutes}:${seconds}`);

    // Fetch parsed quotes from the server
    const response = await fetch('/public/quotes_folder/quote');
    if(!response.ok) {
        console.error('Quote fetch error: Failed to fetch quote from server');
        return;
    }
    try {
        const quotes_array = await response.json();
        console.log('Recieved JSON data:');
        console.log(quotes_array);

        // Select and display a random quote
        let random_index = Math.floor(Math.random() * quotes_array.length);
        let random_quote = quotes_array[random_index];

        document.getElementById('quote-text').innerHTML = random_quote.quote;
        document.getElementById('quote-author').innerHTML = random_quote.author;   
    } catch (err) {
        console.error(err);
    }
}

function showTimeUntillMidnight() {
    /* Displays the time until the next quote on the webpage */
    let now = new Date();
    let midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
        );

    let time_diff_miliseconds = midnight.getTime() - now.getTime();
    
    let time_diff_hours = Math.floor(time_diff_miliseconds / (1000 * 60 * 60));
    time_diff_miliseconds -= time_diff_hours * (1000 * 60 * 60)

    let time_diff_mins = Math.floor(time_diff_miliseconds / (1000 * 60));
    time_diff_miliseconds -= time_diff_mins * (1000 * 60);

    let time_diff_seconds = Math.floor(time_diff_miliseconds / 1000);
        
    hours = formatTime(time_diff_hours);
    minutes = formatTime(time_diff_mins);
    seconds = formatTime(time_diff_seconds);

    document.getElementById('time-to-next-quote-header').innerHTML = `Next quote in: ${hours}:${minutes}:${seconds}`;
}

function intervalLoop() {
    showTimeUntillMidnight();
    displayCurrentQuote();
}

let time_till_midnight_interval = window.setInterval(intervalLoop, 500);
