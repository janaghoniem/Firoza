function openPopup(orderId) {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "block";
    popup.dataset.orderId = orderId;
}

function closePopup() {
    const popup = document.getElementById("custom-popup");
    popup.style.display = "none";
    popup.dataset.orderId = "";
}

function confirmCancel() {
    const popup = document.getElementById("custom-popup");
    const orderId = popup.dataset.orderId;
    if (orderId) {
        fetch(`/user/cancelOrder/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Order cancelled successfully");
                window.location.reload();
            } else {
                alert("Failed to cancel order: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error cancelling order:", error);
            alert("An error occurred while cancelling the order");
        });
    }
    closePopup();
}
function openReviewPopup(orderId) {
    const popup = document.getElementById("review-popup");
    popup.style.display = "block";
    popup.dataset.orderId = orderId;

    const stars = popup.querySelectorAll('.review-rating .fa-star');
    stars.forEach(star => {
        star.classList.remove('checked');
    });
}

function closeReviewPopup() {
    const popup = document.getElementById("review-popup");
    popup.style.display = "none";
    popup.dataset.orderId = "";

    const comment = document.getElementById("review-comment");
    comment.value = "";
}

document.addEventListener('DOMContentLoaded', (event) => {
    const stars = document.querySelectorAll('.review-rating .fa-star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            setRating(rating);
        });
    });
});

function setRating(rating) {
    const popup = document.getElementById("review-popup");
    const stars = popup.querySelectorAll('.review-rating .fa-star');
    stars.forEach(star => {
        const starRating = star.getAttribute('data-rating');
        if (starRating <= rating) {
            star.classList.add('checked');
        } else {
            star.classList.remove('checked');
        }
    });
    popup.dataset.rating = rating;
}

async function submitReview() {
    const popup = document.getElementById("review-popup");
    const orderId = popup.dataset.orderId;
    const rating = popup.dataset.rating;
    const comment = document.getElementById("review-comment").value;

    
    if (orderId && rating && comment) {
        try {
            const response = await fetch(`/user/orders/${orderId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    rating: rating,
                    comment: comment
                })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                closeReviewPopup();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review');
        }
    } else {
        alert('Please provide a rating and a comment');
    }
}

async function logout() {
    try {
        const response = await fetch('/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Logged out successfully');
            window.location.href = '/'; // Redirect to the login page or home page
        } else {
            alert('Failed to log out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Error during logout');
    }
}