document.querySelector('.card-number-input').oninput = () => {
    document.querySelector('.card-number-box').innerText = document.querySelector('.card-number-input').value;
}

document.querySelector('.card-holder-input').oninput = () => {
    document.querySelector('.card-holder-name').innerText = document.querySelector('.card-holder-input').value;
}

document.querySelector('.month-input').oninput = () => {
    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
}

document.querySelector('.year-input').oninput = () => {
    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
}

document.querySelector('.cvv-input').onmouseenter = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
}

document.querySelector('.cvv-input').onmouseleave = () => {
    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
}

document.querySelector('.cvv-input').oninput = () => {
    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv-input').value;
}

// -------------------------------------------------------------------------------------------------

// Get the elements
// const formContainer = document.querySelector('.form-container');
// const containerDiv = document.querySelector('.container');
// const completePurchaseBtn = document.querySelector('input[value="Complete purchase"]');

// // Function to hide form-container and show container
// function hideFormContainerOnClick() {
//     formContainer.classList.add('hidden');
//     containerDiv.classList.remove('hidden');
// }

// // Event listener for the button click
// completePurchaseBtn.addEventListener('click', hideFormContainerOnClick);

// ------------------- Billing form validation-----------------------------

function validateForm() {
    let isValid = true;


    const inputs = document.querySelectorAll('.checkout-form input[type="text"]');


    inputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
            input.classList.add('invalid');
            const errorMessage = input.parentNode.querySelector('.error-message');
            if (!errorMessage) {
                const errorMessage = document.createElement('span');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'This field is required';
                input.parentNode.appendChild(errorMessage);
            }
        } else {
            input.classList.remove('invalid');
            const errorMessage = input.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            // Additional check for email format validation
            if (input.getAttribute('type') === 'text' && input.getAttribute('id') === 'Email') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    input.classList.add('invalid');
                    const errorMessage = input.parentNode.querySelector('.error-message');
                    if (!errorMessage) {
                        const errorMessage = document.createElement('span');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'Please enter a valid email address';
                        input.parentNode.appendChild(errorMessage);
                    }
                }
            }
        }
    });

    return isValid;
}

function handleFormSubmission(event) {
    event.preventDefault();

    const isValid = validateForm(); // Assuming you have a validateForm() function
    if (isValid) {
        console.log('Form is valid. Proceeding to the next step...');

        // Gather form data
        const formData = {
            shipping_address: {
                address: document.getElementById('Address').value,
                city: document.getElementById('City').value,
                state: document.getElementById('State').value,
                postal_code: document.getElementById('Zipcode').value
            }
        };

        // Send form data to backend
        fetch('/user/Billing-Information', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Billing information saved successfully');
                alert('Billing information saved successfully');
                formContainer.classList.add('hidden');
                containerDiv.classList.remove('hidden');
            } else {
                console.error('Failed to save billing information');
                alert('Failed to save billing information');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save billing information due to network issue. Please try again later.');
        });
    } else {
        console.log('Form is invalid');
        // Handle invalid form submission (if necessary)
    }
}


const form = document.querySelector('.checkout-form');


form.addEventListener('submit', handleFormSubmission);



// -------------------------------------------------------------Payment Form Validation-----------------------------------------------
function validateForms() {
    let isFormValid = true;

    // Select all input elements in the forms
    const forms = document.querySelectorAll('.payment-form');

    // Loop through each form
    forms.forEach(form => {
        // Select all input elements in the form
        const inputs = form.querySelectorAll('input, select');

        // Loop through each input element
        inputs.forEach(input => {
            // Check if the input value is empty
            if (!input.value.trim()) {
                isFormValid = false;
                // Add red border to the input field
                input.classList.add('invalid');
                // Check if an error message already exists
                const errorMessage = input.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    // Create and append a span element to show error message
                    const errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.appendChild(errorMessage);
                }
            } else {
                // Remove red border and error message if input is not empty
                input.classList.remove('invalid');
                const errorMessage = input.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
            if (input.classList.contains('card-number-input')) {
                const cardNumber = input.value.trim();
                if (!isValidCardNumber(cardNumber)) {
                    isFormValid = false;
                    input.classList.add('invalid');
                    const errorMessage = input.parentNode.querySelector('.error-message');
                    if (!errorMessage) {
                        const errorMessage = document.createElement('span');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'Invalid card number';
                        input.parentNode.appendChild(errorMessage);
                    }
                }
            }
        });
    });

    // Return true if all forms are valid, otherwise false
    return isFormValid;
}

// Function to handle form submission
function handleFormSubmissions(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Validate all forms
    const areFormsValid = validateForms();

    // If all forms are valid, proceed with submission
    if (areFormsValid) {
        // Add your logic here to proceed with form submission
        console.log('All forms are valid. Proceeding with submission...');
        //Display success message
        alert('Paid successfully!');

        // Redirect to the specified page
        window.location.href = 'ShoppAll.html';

    }
}

// function payAndRedirect() {
//     // Display success message
//     alert('Paid successfully!');

//     // Redirect to the specified page
//     window.location.href = 'ShoppAll.html';
// }


// ---------------------------------------------------------------
// function validateForms() {
//     let isFormValid = true;

//     // Select all input elements in the forms
//     const forms = document.querySelectorAll('.payment-form');

//     // Loop through each form
//     forms.forEach(form => {
//         // Select all input elements in the form
//         const inputs = form.querySelectorAll('input, select');

//         // Loop through each input element
//         inputs.forEach(input => {
//             // Check if the input value is empty
//             if (!input.value.trim()) {
//                 isFormValid = false;
//                 // Add red border to the input field
//                 input.classList.add('invalid');
//                 // Check if an error message already exists
//                 const errorMessage = input.parentNode.querySelector('.error-message');
//                 if (!errorMessage) {
//                     // Create and append a span element to show error message
//                     const errorMessage = document.createElement('span');
//                     errorMessage.classList.add('error-message');
//                     errorMessage.textContent = 'This field is required';
//                     input.parentNode.appendChild(errorMessage);
//                 }
//             } else {
//                 // Remove red border and error message if input is not empty
//                 input.classList.remove('invalid');
//                 const errorMessage = input.parentNode.querySelector('.error-message');
//                 if (errorMessage) {
//                     errorMessage.remove();
//                 }
//             }

//             // Specific validation for card number field
//             if (input.classList.contains('card-number-input')) {
//                 const cardNumber = input.value.trim();
//                 if (!isValidCardNumber(cardNumber)) {
//                     isFormValid = false;
//                     input.classList.add('invalid');
//                     const errorMessage = input.parentNode.querySelector('.error-message');
//                     if (!errorMessage) {
//                         const errorMessage = document.createElement('span');
//                         errorMessage.classList.add('error-message');
//                         errorMessage.textContent = 'Invalid card number';
//                         input.parentNode.appendChild(errorMessage);
//                     }
//                 }
//             }
//         });
//     });

//     // Return true if all forms are valid, otherwise false
//     return isFormValid;
// }

// Function to check if a card number is valid (e.g., 16 digits for most credit cards)
function isValidCardNumber(cardNumber) {
    // Implement your validation logic here, e.g., check if cardNumber has 16 digits
    return /^\d{16}$/.test(cardNumber);
}
