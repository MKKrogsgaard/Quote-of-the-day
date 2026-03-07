// Only run this when the page has finished loading
$(document).ready(function(){
    // Event listener for quote change debug button
    $('#refresh-quote-button').on('click', async function () {
        refreshQuote();
    });
}); 