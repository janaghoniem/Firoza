document.addEventListener('DOMContentLoaded', function() {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    const removeButtons = document.querySelectorAll('.remove-item');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const itemsCountElements = document.querySelectorAll('.items-count');
    const shippingSelect = document.getElementById('shipping');
    const checkoutButton = document.getElementById('checkout');

    const popupContainer = document.getElementById('popup-container');

    incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.dataset.item;
            const quantityInput = document.getElementById(`quantity-${item}`);
            let currentQuantity = parseInt(quantityInput.value);
            currentQuantity++;
            updateCart(item, currentQuantity, quantityInput);
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.dataset.item;
            const quantityInput = document.getElementById(`quantity-${item}`);
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                currentQuantity--;
                updateCart(item, currentQuantity, quantityInput);
            }
        }); 
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.item-row').dataset.item;
            removeCartItem(itemId);
        });
    });

    checkoutButton.addEventListener('click', async function(e) {
        e.preventDefault(); // Prevent the default action

        try {
            const response = await fetch('/user/checkLoggedIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.loggedIn) {
                const currentTotalPrice = parseFloat(totalPriceElements[1].textContent.replace('EGP ', ''));
                
                const updateResponse = await fetch('/user/updateCartPrice', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ totalPrice: currentTotalPrice })
                });

                if (updateResponse.ok) {
                    window.location.href = '/user/checkout'; // Proceed to checkout page
                } else {
                    // const errorData = await updateResponse.json();
                    showErrorPopup('An error has occurred. Please try again later.');
                }
            } else {
                showErrorPopup('Please sign in to checkout.')
                popupContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.log('Error:', error);
        }
    });

    async function updateCart(productId, quantity, quantityInput) {
        try {
            alert(quantity);
            const response = await fetch('/user/updateCart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity })
            });

            if (response.ok) {
                const data = await response.json();
                quantityInput.value = quantity;

                // Update total price display based on updated totalprice from backend
                updateTotalPrice(data.totalprice); // Make sure this function updates the UI
            } else {
                const errorData = await response.json();
                showErrorPopup(errorData.error);
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }


    async function removeCartItem(itemId) {
        try {
            const response = await fetch(`/user/remove-from-cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Item removed successfully from backend, now update frontend
                const itemRow = document.querySelector(`.item-row[data-item="${itemId}"]`);
                itemRow.remove();
                updateTotalPrice();
            } else {
                showErrorPopup('Failed to remove item from cart. Please try again later.');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    shippingSelect.addEventListener('change', updateTotalPrice);

    function updateTotalPrice(newTotalPrice) {
        let totalPrice = 0;
        let itemsCount = 0;
        const itemPrices = document.querySelectorAll('.item-price');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const shippingCost = parseInt(shippingSelect.options[shippingSelect.selectedIndex].text.match(/\d+/)[0]);
    
        itemPrices.forEach((price, index) => {
            const quantity = parseInt(quantityInputs[index].value);
            itemsCount += quantity;
            totalPrice += parseFloat(price.textContent.replace('EGP ', '')) * quantity; // Update totalPrice based on item prices
        });
    
        // If newTotalPrice is provided, use it
        if (typeof newTotalPrice === 'number' && !isNaN(newTotalPrice)) {
            totalPrice = newTotalPrice;
        }
    
        totalPriceElements[0].textContent = `EGP ${totalPrice}`;
        totalPriceElements[1].textContent = `EGP ${totalPrice + shippingCost}`;
    
        itemsCountElements.forEach(itemsCountElement => {
            itemsCountElement.textContent = `${itemsCount} items`;
        });
    
        // Disable the checkout button if cart is empty
        checkoutButton.disabled = itemsCount === 0;
    }
    

    // Initial check to disable checkout button if cart is empty
    updateTotalPrice();

    function showErrorPopup(message) {
        const popup = document.getElementById('login-message-error-popup');
        const popupMessage = popup.querySelector('h2');
        popupMessage.textContent = message;
        
        // Show the popup
        popup.classList.add('show');
        
        // Automatically hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000); // Adjust timing as needed
    }
});
