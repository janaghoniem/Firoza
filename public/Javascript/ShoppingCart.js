document.addEventListener('DOMContentLoaded', function() {
   // Select all increment and decrement buttons
   const incrementButtons = document.querySelectorAll('.increment');
   const decrementButtons = document.querySelectorAll('.decrement');
   const removeButtons = document.querySelectorAll('.remove-item');
   const totalPriceElements = document.querySelectorAll('.total-price');
   const itemsCountElement = document.querySelector('.items-count');
   const shippingSelect = document.getElementById('shipping');

   // Attach click event listeners to each increment button
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

   // Attach click event listeners to each decrement button
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

   // Attach click event listeners to each remove button
   removeButtons.forEach(button => {
       button.addEventListener('click', function() {
           const itemRow = this.closest('.item-row');
           itemRow.remove();
           updateTotalPrice();
       });
   });

   // Attach change event listener to the shipping select
   shippingSelect.addEventListener('change', updateTotalPrice);

   // Function to update total price
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

       // Update the total price and items count in the summary section
       totalPriceElements.forEach(element => {
           element.textContent = `EGP ${totalPrice + shippingCost}`;
       });
       itemsCountElement.textContent = `${itemsCount} ITEMS`;
   }
});
