function searchTrains() {
    // Add your search logic here
    // Retrieve selected values and perform search
    let departure = document.getElementById("departure").value;
    let arrival = document.getElementById("arrival").value;
    let departureDate = document.getElementById("departureDate").value;
    let returnDate = document.getElementById("returnDate").value;

    // Display search results in the resultsBlock
    let resultsBlock = document.querySelector(".resultsBlock");
    resultsBlock.innerHTML = `<p>Search results for ${departure} to ${arrival} on ${departureDate} - ${returnDate}</p>`;
    // Add train options dynamically based on search results

    // Enable or disable "Buy" button based on selected travel class
    let buyButton = document.getElementById("buyButton");
    buyButton.disabled = true; // Disable the button initially
}
