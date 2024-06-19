function openPopup(orderId) {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "block";
    // Store the orderId in the popup for later use
    popup.dataset.orderId = orderId;
}

function closePopup() {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "none";
    // Clear the stored orderId
    popup.dataset.orderId = "";
}

function confirmCancel() {
    const popup = document.getElementById("custom-popup");
    const orderId = popup.dataset.orderId;
    if (orderId) {
        // Make an API call to cancel the order
        fetch(`/cancelOrder/${orderId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle successful cancellation
                alert("Order cancelled successfully");
                window.location.reload(); // Reload the page to update the order status
            } else {
                // Handle error
                alert("Failed to cancel order");
            }
        })
        .catch(error => {
            console.error("Error cancelling order:", error);
            alert("An error occurred while cancelling the order");
        });
    }
    closePopup();
}
