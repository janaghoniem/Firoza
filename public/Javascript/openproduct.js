// function viewProduct(productId) {
//     window.location.href = '/product-details.html?id=' + productId;
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const productId = urlParams.get('id');

//     if (productId) {
//         fetchProductDetails(productId);
//     }

//     function fetchProductDetails(productId) {
//         fetch(`/api/products/${productId}`)
//             .then(response => response.json())
//             .then(data => {
//                 document.querySelector('.prod-pic img').src = `/images/Indian/Newfolder/${data.img}`;
//                 document.querySelector('.price-rating h2').innerText = data.name;
//                 document.querySelector('.price-rating p').innerText = `EGP ${data.price}`;
//                 document.querySelector('.details-content p').innerText = data.description;
//             })
//             .catch(error => console.error('Error fetching product details:', error));
//     }
// });


document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    }

    function fetchProductDetails(productId) {
        fetch(`/user/product/${productId}`) // Ensure this matches your route
            .then(response => response.json())
            .then(data => {
                document.querySelector('.prod-pic img').src = `/images/Indian/Newfolder/${data.img}`;
                document.querySelector('#product-name').innerText = data.name;
                document.querySelector('#product-price').innerText = data.price;
                document.querySelector('#product-description').innerText = data.description;
            })
            .catch(error => console.error('Error fetching product details:', error));
    }
});