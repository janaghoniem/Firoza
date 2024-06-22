function openPopup(popupId, dataId) {
    const popup = document.getElementById(popupId);
    popup.style.display = "block";
    if (dataId) {
        popup.dataset.id = dataId;
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = "none";
    if (popup.dataset.id) {
        popup.dataset.id = "";
    }
}

async function confirmCancel() {
    const popup = document.getElementById('cancel-order-popup');
    const orderId = popup.dataset.id;
    if (orderId) {
        try {
            const response = await fetch(`/user/cancelOrder/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (data.success) {
                // alert("Order cancelled successfully");
                window.location.reload();
            } else {
                alert("Failed to cancel order: " + data.message);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("An error occurred while cancelling the order");
        }
    }
    closePopup('cancel-order-popup');
}

async function submitReview() {
    const popup = document.getElementById("review-popup");
    const prodId = popup.dataset.id;
    const rating = popup.dataset.rating;
    const comment = document.getElementById("review-comment").value;

    if (prodId && rating && comment) {
        try {
            const response = await fetch(`/user/orders/${prodId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prod: prodId, rating: rating, comment: comment })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                closePopup('review-popup');
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

async function deactivate() {
    try {
        const response = await fetch('/user/deactivate', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            showPopup('Account deactivated successfully.');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            showErrorPopup('Failed to deactivate account. Please try again later.');
        }
    } catch (error) {
        console.error('Error during deactivation:', error);
        showErrorPopup('An error occurred while deactivating the account. Please try again later.');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.review-rating .fa-star');

    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                s.classList.toggle('fa-solid', sRating <= rating);
                s.classList.toggle('fa-regular', sRating > rating);
            });
        });

        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                s.classList.toggle('checked', sRating <= rating);
            });
        });

        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                if (!s.classList.contains('checked')) {
                    s.classList.add('fa-regular');
                    s.classList.remove('fa-solid');
                }
            });
            const checkedStars = document.querySelectorAll('.review-rating .checked');
            checkedStars.forEach(checkedStar => {
                checkedStar.classList.add('fa-solid');
            });
        });
    });

    // Update email validation and check availability
    async function checkEmailAvailability(email) {
        const response = await fetch('/user/check-email-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailValue: email })
        });
        return response.ok ? await response.json() : { available: false };
    }

    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const displayElements = document.querySelectorAll('.user-info-display');
    const editElements = document.querySelectorAll('.user-info-edit');
    const emailInput = document.getElementById('email-input');
    const emailStatus = document.getElementById('email-status');
    const deleteAccountButton = document.getElementById('deactivate-button');

    deleteAccountButton.addEventListener('click', () => {
        const popup = document.getElementById("deactivate-popup");
        openPopup('deactivate-popup');
    });

    editButton.addEventListener('click', () => {
        displayElements.forEach(element => element.style.display = 'none');
        editElements.forEach(element => element.style.display = 'inline');
        editButton.style.display = 'none';
        saveButton.style.display = 'inline';
        cancelButton.style.display = 'inline';
    });

    cancelButton.addEventListener('click', () => {
        displayElements.forEach(element => element.style.display = 'inline');
        editElements.forEach(element => element.style.display = 'none');
        editButton.style.display = 'inline';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    });

    emailInput.addEventListener('input', async function() {
        const email = this.value.trim();
        if (isValidEmail(email)) {
            const data = await checkEmailAvailability(email);
            emailStatus.textContent = data.available ? 'Email is available.' : 'Email is already taken.';
            emailStatus.style.color = data.available ? 'green' : 'red';
            emailInput.style.borderColor = data.available ? 'green' : 'red';
        } else {
            emailStatus.textContent = 'Invalid Email Address.';
            emailStatus.style.color = 'red';
            emailInput.style.borderColor = 'red';
        }
    });

    saveButton.addEventListener('click', async () => {
        const firstname = document.querySelector('input[name="firstname"]').value;
        const lastname = document.querySelector('input[name="lastname"]').value;
        const email = emailInput.value;

        if (isValidEmail(email)) {
            const data = await checkEmailAvailability(email);
            if (data.available) {
                const updatedInfo = { firstname, lastname, email };
                const response = await fetch('/user/myAccount/Edit-Personal-information', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedInfo)
                });

                if (response.ok) {
                    showPopup('User information updated successfully');
                    setTimeout(() => location.reload(), 2000);
                } else {
                    showErrorPopup('Error updating user information');
                }
            } else {
                emailStatus.textContent = 'Email is already taken.';
                emailStatus.style.color = 'red';
                emailInput.style.borderColor = 'red';
            }
        } else {
            emailStatus.textContent = 'Invalid Email Address.';
            emailStatus.style.color = 'red';
            emailInput.style.borderColor = 'red';
        }
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
    const emailStatus = document.getElementById('email-status');

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
        const email = this.value;

        if(isValidEmail(email.trim())){

            const response = await fetch('/user/check-email-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emailValue: email })
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
        else {
            emailStatus.textContent = 'Invalid Email Address.';
            emailStatus.style.color = 'red';
            emailInput.style.borderColor = 'red';
        }
    });

    // Event listener for save button
    saveButton.addEventListener('click', async () => {
        const firstname = document.querySelector('input[name="firstname"]').value;
        const lastname = document.querySelector('input[name="lastname"]').value;
        const email = emailInput.value;

        // Final validation before sending the update request
        const response = await fetch('/user/check-email-update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailValue: email })
        });

        
        const data = await response.json();

        if (data.available) {
            const updatedInfo = { firstname, lastname, email };
            
            // Send the updated data to the server
            const response = await fetch('/user/myAccount/Edit-Personal-information', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedInfo)
            })
            
            if (!response.ok) {
                showErrorPopup('Error updating user information');
                return;
            } 
            
            location.reload(); 
            showPopup('User information updated successfully');
        } else {
            alert('Not available')
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



