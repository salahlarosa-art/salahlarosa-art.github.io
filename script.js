// Wait for the entire webpage to load before running the script
document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Grab all the HTML elements we need ---
    const serviceNameInput = document.getElementById("service-name");
    const serviceCostInput = document.getElementById("service-cost");
    const addBtn = document.getElementById("add-btn");
    const serviceList = document.getElementById("service-list");
    const monthlyTotalEl = document.getElementById("monthly-total");
    const annualTotalEl = document.getElementById("annual-total");
    const fiveYearTotalEl = document.getElementById("five-year-total");
    const resetBtn = document.getElementById("reset-btn");

    // --- 2. Initialize our main variable ---
    // We will store all subscriptions in an array
    let subscriptions = [];
    
    // --- 3. Define our functions (what the app can do) ---

    // Function to calculate and display the totals
    function updateTotals() {
        // Calculate the monthly total by adding up the cost of all items in our array
        const monthlyTotal = subscriptions.reduce((total, sub) => total + sub.cost, 0);
        
        // Calculate the other totals
        const annualTotal = monthlyTotal * 12;
        const fiveYearTotal = monthlyTotal * 60; // 12 months * 5 years
        
        // Display the totals on the page, formatted as currency
        monthlyTotalEl.textContent = `$${monthlyTotal.toFixed(2)}`;
        annualTotalEl.textContent = `$${annualTotal.toFixed(2)}`;
        fiveYearTotalEl.textContent = `$${fiveYearTotal.toFixed(2)}`;
    }

    // Function to display the list of subscriptions
    function renderList() {
        // Clear the current list in the HTML
        serviceList.innerHTML = "";
        
        // Loop through each subscription in our array
        subscriptions.forEach((sub, index) => {
            // Create a new list item element
            const li = document.createElement("li");
            li.className = "service-item"; // Add the CSS class for styling
            
            // Set the content of the list item
            li.innerHTML = `
                <span>${sub.name} - $${sub.cost.toFixed(2)}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            
            // Add the new list item to the page
            serviceList.appendChild(li);
        });
    }

    // Function to add a new subscription
    function addSubscription() {
        // Get the values from the input boxes
        const name = serviceNameInput.value.trim(); // .trim() removes any extra spaces
        const cost = parseFloat(serviceCostInput.value); // Convert the text cost to a number
        
        // --- Input Validation ---
        // Check if the name is empty or the cost is not a valid number (or 0)
        if (name === "" || isNaN(cost) || cost <= 0) {
            alert("Please enter a valid service name and a monthly cost greater than $0.");
            return; // Stop the function here
        }
        
        // Create a new subscription object
        const newSub = {
            name: name,
            cost: cost
        };
        
        // Add the new subscription to our array
        subscriptions.push(newSub);
        
        // Clear the input boxes
        serviceNameInput.value = "";
        serviceCostInput.value = "";
        
        // Update the list and the totals
        renderList();
        updateTotals();
    }

    // Function to delete a subscription
    function deleteSubscription(event) {
        // Check if the clicked element was a delete button
        if (event.target.classList.contains("delete-btn")) {
            // Get the 'data-index' (which we set in renderList) to know which item to remove
            const indexToDelete = parseInt(event.target.getAttribute("data-index"));
            
            // Remove that one item from our subscriptions array
            subscriptions.splice(indexToDelete, 1);
            
            // Update the list and the totals
            renderList();
            updateTotals();
        }
    }

    // Function to reset everything
    function resetAll() {
        subscriptions = []; // Empty the array
        renderList();       // Update the empty list
        updateTotals();     // Update the totals (will go to $0.00)
    }

    // --- 4. Connect our functions to the buttons (Event Listeners) ---
    
    // Run addSubscription when the "Add" button is clicked
    addBtn.addEventListener("click", addSubscription);
    
    // Also allow pressing "Enter" in the cost box to add
    serviceCostInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addSubscription();
        }
    });

    // Listen for clicks on the *entire list* (for deleting items)
    serviceList.addEventListener("click", deleteSubscription);
    
    // Listen for clicks on the "Reset" button
    resetBtn.addEventListener("click", resetAll);
});
