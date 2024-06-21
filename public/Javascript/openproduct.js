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
        fetch(`/user/product/${productId}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector('.prod-pic img').src = `/images/Indian/Newfolder/${data.product.img}`;
                document.querySelector('.price-rating h2').innerText = data.product.name;
                document.querySelector('.price-rating p').innerText = `EGP ${data.product.price}`;
                document.querySelector('#product-description').innerText = data.product.description;

                // After fetching product details, also fetch reviews and update stats
                fetchAndDisplayReviews(productId);
            })
            .catch(error => console.error('Error fetching product details:', error));
    }

    async function fetchAndDisplayReviews(productId) {
        try {
            const response = await fetch(`/user/products/${productId}/reviews`);
            const result = await response.json();

            if (result.success) {
                const reviewsContainer = document.getElementById('reviews');
                const reviews = result.reviews;

                reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('review-box');

                    reviewElement.innerHTML = `
                        <div class="review-left">
                            <div class="review-header">
                                <div class="review-avatar">
                                    <i class="fa-regular fa-circle-user"></i>
                                </div>
                                <div class="review-info">
                                    <p class="reviewer-name">${review.user.firstname} ${review.user.lastname}</p>
                                    <p class="review-date">${new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="review-content">
                                <div class="review-rating">
                                    ${'&#9733;'.repeat(review.rating)}
                                    ${'&#9734;'.repeat(5 - review.rating)}
                                </div>
                                <p class="review-text">${review.comment}</p>
                            </div>
                        </div>
                    `;

                    reviewsContainer.appendChild(reviewElement);
                });

               // Calculate and update average rating and review count
                const averageRating = calculateAverageRating(reviews);
                const totalReviews = reviews.length;

                updateAverageRating(averageRating);
                updateReviewCount(totalReviews);
                updateStarRatings(averageRating); 

            } else {
                console.error('Error fetching reviews:', result.message);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    // function calculateAverageRating(reviews) {
    //     if (reviews.length === 0) return 0;

    //     const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    //     return totalRating / reviews.length;
    // }

    // function updateAverageRating(averageRating) {
    //     console.log('Updating average rating:', averageRating); // Log averageRating
    //     const averageRatingElement = document.getElementById('average-rating');
    //     if (averageRatingElement) {
    //         averageRatingElement.textContent = `(Average Rating: ${averageRating.toFixed(1)})`;
    //     } else {
    //         console.error('Average rating element not found');
    //     }
    // }

    // function updateReviewCount(totalReviews) {
    //     console.log('Updating review count:', totalReviews); // Log totalReviews
    //     const reviewCountElement = document.getElementById('review-count');
    //     if (reviewCountElement) {
    //         reviewCountElement.textContent = `(${totalReviews} review${totalReviews !== 1 ? 's' : ''})`;
    //     } else {
    //         console.error('Review count element not found');
    //     }
    // }

    // function updateStarRatings(averageRating) {
    //     console.log('Updating star ratings with average rating:', averageRating); // Log averageRating
    //     const fullStars = Math.floor(averageRating);
    //     const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
    //     const emptyStars = 5 - fullStars - halfStar;

    //     const starsContainer = document.getElementById('rate-stat');
    //     if (starsContainer) {
    //         // Clear existing stars
    //         starsContainer.innerHTML = '';

    //         // Append full stars
    //         for (let i = 0; i < fullStars; i++) {
    //             const star = document.createElement('span');
    //             star.classList.add('star');
    //             star.innerHTML = '&#9733;';
    //             starsContainer.appendChild(star);
    //         }

    //         // Append half star if necessary
    //         if (halfStar === 1) {
    //             const halfStarElement = document.createElement('span');
    //             halfStarElement.classList.add('star');
    //             halfStarElement.innerHTML = '&#9733;';
    //             halfStarElement.style = 'color: black;'; // Make the half star black
    //             starsContainer.appendChild(halfStarElement);
    //         }

    //         // Append empty stars
    //         for (let i = 0; i < emptyStars; i++) {
    //             const emptyStar = document.createElement('span');
    //             emptyStar.classList.add('star');
    //             emptyStar.innerHTML = '&#9734;';
    //             starsContainer.appendChild(emptyStar);
    //         }
    //     } else {
    //         console.error('Stars container element not found');
    //     }
    // }
});

