document.addEventListener('DOMContentLoaded', function() {
    const removeButtons = document.querySelectorAll('.remove-item');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const itemsCountElement = document.querySelector('.items-count');
 
    // Attach click event listeners to each remove button
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.item-row').dataset.item;
            removeFromWishlist(itemId);
        });
    });

    async function removeFromWishlist(productId) {
        try {
            const response = await fetch(`/user/wishlist/remove/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                document.querySelector(`[data-item="${productId}"]`).remove();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
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




