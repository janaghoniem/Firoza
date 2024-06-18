function openPopup(orderId) {
    // Pass orderId to a hidden field or variable to use it in the confirmCancel function
    document.getElementById('custom-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('custom-popup').style.display = 'none';
}

function confirmCancel() {
    // Perform cancel order action here
    console.log('Order cancelled.');
    closePopup();
}