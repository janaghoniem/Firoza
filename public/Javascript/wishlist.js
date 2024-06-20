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


async function addToCart(productId, price) {
    alert(productId);
    try {
        const response = await fetch('/user/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, price })
        });

        if (response.ok) {
            alert('Product added to cart successfully!');
        } else {
            alert('Failed to add product to cart');
        }

    } catch (error) {
        alert('Error:', error);
        alert('Failed to add product to cart');
    }
}




