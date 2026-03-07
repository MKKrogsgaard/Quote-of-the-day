// Only run this when the page has finished loading
$(document).ready(function(){
    showTimeUntillMidnight();
    displayCurrentQuote();

    // Event listener for random quote debug button
    $('#random-quote-button').on('click', async function () {
        debugRefreshQuote();
    });

    // Event listener for current quote debug button
    $('#current-quote-button').on('click', async function () {
        displayCurrentQuote();
    });


}); 