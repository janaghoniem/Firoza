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
            quantityInput.value = currentQuantity;

            updateTotalPrice();
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.dataset.item;
            const quantityInput = document.getElementById(`quantity-${item}`);
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                currentQuantity--;
                quantityInput.value = currentQuantity;
            }

            updateTotalPrice();
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
                window.location.href = '/user/Checkout';
            } else {
                popupContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle the error
        }
    });

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
                alert('Failed to remove item from cart' + response.statusText);
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }

    shippingSelect.addEventListener('change', updateTotalPrice);

    function updateTotalPrice() {
        let totalPrice = 0;
        let itemsCount = 0;
        const itemPrices = document.querySelectorAll('.item-price');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        const shippingCost = parseInt(shippingSelect.options[shippingSelect.selectedIndex].text.match(/\d+/)[0]);

        itemPrices.forEach((price, index) => {
            const priceText = price.textContent.trim().replace('EGP', '').trim();
            const quantity = parseInt(quantityInputs[index].value);
            totalPrice += parseInt(priceText) * quantity;
            itemsCount += quantity;
        });

        totalPriceElements.forEach(totalPriceElement => {
            totalPriceElement.textContent = `EGP ${totalPrice}`;
        });
        itemsCountElements.forEach(itemsCountElement => {
            itemsCountElement.textContent = `${itemsCount} items`;
        });
        
        totalPriceElements[1].textContent = `EGP ${totalPrice + shippingCost}`;

        // Disable the checkout button if cart is empty
        checkoutButton.disabled = itemsCount === 0;
    }

    // Initial check to disable checkout button if cart is empty
    updateTotalPrice();
});
