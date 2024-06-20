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
        fetchAndDisplayReviews(productId);
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
    async function fetchAndDisplayReviews(productId) {
        try {
            const response = await fetch(`/user/products/${productId}/reviews`);
            const result = await response.json();

            if (result.success) {
                const reviewsContainer = document.getElementById('reviews');
                reviewsContainer.innerHTML = ''; // Clear any existing reviews

                result.reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('review-box');

                    reviewElement.innerHTML = `
                        <div class="review-left">
                            <div class="review-header">
                                <div class="review-avatar">
                                    <i class="fa-regular fa-circle-user"></i>
                                </div>
                                <div class="review-info">
                                    <p class="reviewer-name">${review.user.name}</p>
                                    <p class="review-date">${new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="review-content">
                                <div class="review-rating">
                                    ${'&#9733;'.repeat(review.rating)}
                                    ${'&#9733;'.repeat(5 - review.rating)}
                                </div>
                                <p class="review-text">${review.comment}</p>
                            </div>
                        </div>
                    `;

                    reviewsContainer.appendChild(reviewElement);
                });
            } else {
                console.error('Error fetching reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

});

