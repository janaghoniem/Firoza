document.addEventListener('DOMContentLoaded', function() {
    const removeButtons = document.querySelectorAll('.remove-item');
 
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


async function addToCart(productId, price) {
    try {
        const response = await fetch('/user/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, price })
        });

        if (response.ok) {
            removeFromWishlist(productId);
            showPopup('Product added to cart successfully!');
        } else {
            alert('Failed to add product to cart');
        }

    } catch (error) {
        return;
    }
}

function showPopup(message) {
    const popup = document.querySelector('.login-message-popup');
    const popupMessage = popup.querySelector('h2');
    popupMessage.textContent = message;
    
    // Show the popup
    popup.classList.add('show');
    
    // Automatically hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Adjust timing as needed
}




