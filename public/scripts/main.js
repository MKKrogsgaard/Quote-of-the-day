
QUOTES_JSON_PATH = 'public/quotes_folder/quotes.json'

function formatTime(number) {
    /* Adds a leading zero to a number if the number is less than 10 */
    return number < 10 ? '0' + number : number;
}

async function refreshQuote() {
    let now = new Date();
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let seconds = formatTime(now.getSeconds());

    console.log(`Refreshing quote. Current time: ${hours}:${minutes}:${seconds}`);

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