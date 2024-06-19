function openPopup(orderId) {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "block";
    popup.dataset.orderId = orderId;
}

function closePopup() {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "none";
    popup.dataset.orderId = "";
}

function confirmCancel() {
    const popup = document.getElementById("custom-popup");
    const orderId = popup.dataset.orderId;
    if (orderId) {
        fetch(`/user/cancelOrder/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Order cancelled successfully");
                window.location.reload();
            } else {
                alert("Failed to cancel order: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error cancelling order:", error);
            alert("An error occurred while cancelling the order");
        });
    }
    closePopup();
}
