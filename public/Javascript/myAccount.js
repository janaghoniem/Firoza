
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
function openReviewPopup(prodId) {
    const popup = document.getElementById("review-popup");
    popup.style.display = "block";
    popup.dataset.prodId = prodId;

    const stars = popup.querySelectorAll('.review-rating .fa-star');
    stars.forEach(star => {
        star.classList.remove('checked');
    });
}

function closeReviewPopup() {
    const popup = document.getElementById("review-popup");
    popup.style.display = "none";
    popup.dataset.prodId = "";

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
    const prodId = popup.dataset.prodId; // Ensure this matches what is expected in your backend route
    const rating = popup.dataset.rating;
    const comment = document.getElementById("review-comment").value;

    if (prodId && rating && comment) {
        try {
            const response = await fetch(`/user/orders/${prodId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prod: prodId,
                    rating: rating,
                    comment: comment
                })
            });

            const result = await response.json();
            alert(result.message);
            
            if (result.success) {
                closeReviewPopup();
                window.location.reload(); // Reload the page after successful submission
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
    const popup = document.getElementById('login-message-popup');
    const popupMessage = popup.querySelector('h2');
    popupMessage.textContent = message;
    
    // Show the popup
    popup.classList.add('show');
    
    // Automatically hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Adjust timing as needed
}

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

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    async function checkEmailAvailability(email) {
        try {
            const response = await fetch('/user/checkAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: email })
            });
            if (!response.ok) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const displayElements = document.querySelectorAll('.user-info-display');
    const editElements = document.querySelectorAll('.user-info-edit');
    const emailInput = document.getElementById('email-input');

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

    // Event listener for email input
    emailInput.addEventListener('input', async function() {
        alert('email input')
        const emailValue = this.value;
        const userId = '<%= userInfo._id %>'; // Pass the userId from the server

        if(isValidEmail(email.Value.trim())){

            const response = await fetch('/user/check-email-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailValue, userId })
            });

            const data = await response.json();

            if (data.available) {
                emailStatus.textContent = 'Email is available.';
                emailStatus.style.color = 'green';
                emailInput.style.borderColor = 'green';
            } else {
                emailStatus.textContent = 'Email is already taken.';
                emailStatus.style.color = 'red';
                emailInput.style.borderColor = 'red';
            }
        }
    });

    // Event listener for save button
    saveButton.addEventListener('click', async () => {
        alert('save entered')
        const firstname = document.querySelector('input[name="firstname"]').value;
        const lastname = document.querySelector('input[name="lastname"]').value;
        const email = emailInput.value;

        // Final validation before sending the update request
        const response = await fetch('/user/check-email-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailValue: email, userId: '<%= userInfo._id %>' })
        });

        alert('fetch done')
        const data = await response.json();

        if (data.available) {
            const updatedInfo = { firstname, lastname, email };
            alert('data available');
            // Send the updated data to the server
            fetch('/user/myAccount/Edit-Personal-information', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedInfo)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPopup('User information updated successfully');
                    location.reload(); // Refresh the page to show updated info
                } else {
                    showErrorPopup('Error updating user information');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('not available')
            emailStatus.textContent = 'Email is already taken.';
            emailStatus.style.color = 'red';
            emailInput.style.borderColor = 'red';
        }
    });
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

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.review-rating .fa-star');

    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.remove('fa-regular'); 
                    s.classList.add('fa-solid');
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
        });

        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('checked');
                } else {
                    s.classList.remove('checked');
                }
            });
        });

        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                if (!s.classList.contains('checked')) {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
            const checkedStars = document.querySelectorAll('.review-rating .checked');
            checkedStars.forEach(checkedStar => {
                checkedStar.classList.add('fa-solid');
            });
        });
    });
});



