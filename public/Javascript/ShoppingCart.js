document.addEventListener('DOMContentLoaded', function() {
   const incrementButtons = document.querySelectorAll('.increment');
   const decrementButtons = document.querySelectorAll('.decrement');
   const removeButtons = document.querySelectorAll('.remove-item');
   const totalPriceElements = document.querySelectorAll('.total-price');
   const itemsCountElement = document.querySelector('.items-count');
   const shippingSelect = document.getElementById('shipping');
   const checkoutButtons = document.querySelectorAll('.checkout');

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

    checkoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.item-row').dataset.item;
            removeCartItem(itemId);
        });
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
                alert(response.body)
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

        totalPriceElements[0] = totalPriceElements[0].textContent = `EGP ${totalPrice}`;
        totalPriceElements[1] = totalPriceElements[1].textContent = `EGP ${totalPrice + shippingCost}`;
        itemsCountElement.textContent = `${itemsCount} ITEMS`;
    }
});
