document.addEventListener('DOMContentLoaded', function() {
    // Select all increment and decrement buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const itemsCountElement = document.querySelector('.items-count');
 
    // Attach click event listeners to each remove button
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.item-row').dataset.item;
            removeCartItem(itemId);
        });
    });

    async function removeCartItem(itemId) {
        try {
            const response = await fetch(`/user/remove-from-wishlist/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Item removed successfully from backend, now update frontend
                const itemRow = document.querySelector(`.item-row[data-item="${itemId}"]`);
                itemRow.remove();
            } else {
                alert('Failed to remove item from cart' + response.statusText);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

});
 
 

//  -----------------------------------------------------------------------------------------------------


function addToCart(button) {
    // Get the parent div of the button
    var parentDiv = button.parentNode.parentNode;
    
    // Hide the parent div
    parentDiv.style.display = 'none';
}




