//description dropdown

document.addEventListener("DOMContentLoaded",function(){
    var headers= document.querySelectorAll('.description-part');
    headers.forEach(function(header){

        header.addEventListener('click', function(){
            var content = this.nextElementSibling;
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';

            var icon = this.querySelector('i');
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
        });
    });
});

//added to cart popup
// function addToCart(){
//     var popup = document.createElement("div");
//     popup.classList.add("popupMessage");
//     popup.textContent= "Added to cart";
//     document.body.appendChild(popup);

   

//     setTimeout(function(){
//         popup.style.display="block";
//     },100);

//     setTimeout(function(){
//         popup.style.display="none";
//         popup.parentNode.removeChild(popup);
//     },2000);

   
// }

// function addToWishlist(){
//     var popup = document.createElement("div");
//     popup.classList.add("popupMessage");
//     popup.textContent= "Added to wishlist";
//     document.body.appendChild(popup);

   
//     setTimeout(function(){
//         popup.style.display="block";
//     },100);

//     setTimeout(function(){
//         popup.style.display="none";
//         popup.parentNode.removeChild(popup);
//     },2000);

   
// }
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
            const result = await response.json();

            // showPopup('Product added to cart successfully!');

            var popup = document.createElement("div");
    popup.classList.add("popupMessage");
    popup.textContent= "Added to cart";
    document.body.appendChild(popup);

   

    setTimeout(function(){
        popup.style.display="block";
    },100);

    setTimeout(function(){
        popup.style.display="none";
        popup.parentNode.removeChild(popup);
    },2000);


        } else {
            showErrorPopup('Failed to add product to cart. Please try again later.');
        }

    } catch (error) {
        showErrorPopup('Failed to add product to cart');
    }
}

async function addToWishlist(productId) {
    try {
        const response = await fetch('/user/wishlist/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (response.ok) {

            // showPopup('Product added to wishlist successfully!');
            var popup = document.createElement("div");
    popup.classList.add("popupMessage");
    popup.textContent= "Added to wishlist";
    document.body.appendChild(popup);

   
    setTimeout(function(){
        popup.style.display="block";
    },100);

    setTimeout(function(){
        popup.style.display="none";
        popup.parentNode.removeChild(popup);
    },2000);

        } else {
            showErrorPopup('Failed to add product to wishlist. Please try again later.');
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
    }
}
