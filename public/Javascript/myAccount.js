
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
function showPopup(message) {
    const popup = document.querySelector('.login-message-popup');
    const popupMessage = popup.querySelector('h2');
    popupMessage.textContent = message;
    
    // Show the popup
    popup.classList.add('show');
    
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 5000); // Adjust timing as needed
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
           
            // alert('Logged out successfully');
            showPopup('Logged out successfully.');
            setTimeout(() => {
                window.location.href = '/'; 
            }, 2000);
          
        
        } else {
            showErrorPopup('Failed to log out. Please try again later.');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        showErrorPopup('An error occurred while logging out. Please try again later.');
    }
}


//ADDED BY JANA FOR STYLISTIC PURPOSES
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const displayElements = document.querySelectorAll('.user-info-display');
    const editElements = document.querySelectorAll('.user-info-edit');

    editButton.addEventListener('click', () => {
        displayElements.forEach(element => {
            element.style.display = 'none';
        });
        editElements.forEach(element => {
            element.style.display = 'inline';
        });
        editButton.style.display = 'none';
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
    });

    cancelButton.addEventListener('click', () => {
        displayElements.forEach(element => {
            element.style.display = 'inline';
        });
        editElements.forEach(element => {
            element.style.display = 'none';
        });
        editButton.style.display = 'inline';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    });

    // saveButton.addEventListener('click', () => {
    //     // Here, you would send the updated information to the server via an AJAX request.
    //     // For simplicity, this example just toggles the view back to display mode.

    //     displayElements.forEach((element, index) => {
    //         const inputElement = editElements[index];
    //         element.textContent = inputElement.value;
    //         element.style.display = 'inline';
    //         inputElement.style.display = 'none';
    //     });

    //     editButton.style.display = 'inline';
    //     saveButton.style.display = 'none';
    //     cancelButton.style.display = 'none';

    //     // Send the updated data to the server
    //     const updatedInfo = {
    //         firstname: document.querySelector('input[name="firstname"]').value,
    //         lastname: document.querySelector('input[name="lastname"]').value,
    //         email: document.querySelector('input[name="email"]').value,
    //     };

    //     fetch('/update-user-info', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(updatedInfo)
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.success) {
    //             // Optionally show a success message or handle success
    //             console.log('User information updated successfully');
    //         } else {
    //             // Optionally show an error message or handle error
    //             console.error('Error updating user information');
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // });
});

function toggleOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    const showMoreButton = document.getElementById('show-more-button');

    if (ordersContainer.classList.contains('expanded')) {
        ordersContainer.classList.remove('expanded');
        ordersContainer.classList.add('unexpanded');
        showMoreButton.textContent = 'Show More';
    } else {
        ordersContainer.classList.remove('unexpanded');
        ordersContainer.classList.add('expanded');
        showMoreButton.textContent = 'Show Less';
    }
}

const regularIcons = document.querySelectorAll('.review-rating .fa-regular');

regularIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.classList.remove('fa-regular'); // Remove regular class
        this.classList.add('fa-solid'); // Add solid class
    });

    icon.addEventListener('mouseleave', function() {
        this.classList.remove('fa-solid'); // Remove solid class
        this.classList.add('fa-regular'); // Add regular class back
    });
});


