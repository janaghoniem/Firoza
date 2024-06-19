function openPopup(orderId) {
    document.getElementById('custom-popup').style.display = 'block';
    document.getElementById('order-id').value = orderId;
}

function closePopup() {
    document.getElementById('custom-popup').style.display = 'none';
}

async function confirmCancel() {
    var orderId = document.getElementById('order-id').value;

    try {
        const response = await fetch(`/cancel-order/${orderId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        console.log(data); // Log the response from the server
        location.reload(); // Reload the page after deleting the order
    } catch (error) {
        console.error('Error cancelling order:', error);
    }

    closePopup();
}