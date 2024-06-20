document.getElementById('addAdminForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    let isValid = true;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailError = document.getElementById('emailError');

    // Validate first name
    if (firstName === "") {
        isValid = false;
        alert("First Name is required.");
    } else if (!isValidName(firstName)) {
        isValid = false;
        alert("First Name should contain only letters.");
    }

    // Validate last name
    if (lastName === "") {
        isValid = false;
        alert("Last Name is required.");
    } else if (!isValidName(lastName)) {
        isValid = false;
        alert("Last Name should contain only letters.");
    }

    // Validate email
    if (email === "") {
        isValid = false;
        alert("Email is required.");
    } else if (!validateEmail(email)) {
        isValid = false;
        alert("Invalid Email Address.");
    } else {
        const available = await checkEmailAvailability(email);
        if (!available) {
            isValid = false;
            emailError.textContent = "Email already in use.";
            emailError.style.display = 'block';
            document.getElementById('email').style.borderColor = 'red';
            alert("Email already taken");
        }
    }

    // Validate password
    if (password === "") {
        isValid = false;
        alert("Password is required.");
    }

    // If all validations pass, submit the form via fetch
    if (isValid) {
        try {
            const response = await fetch('/admin/saveaddAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            });
            console.log("al adminnn al naaahhhhssssss");
            if (response.ok) {
                console.log("added admin tmam");
                alert('Admin added successfully');
                window.location.href = '/admin/addAdmin'; // Redirect to the add admin page or another appropriate page
            } else {
                alert('Failed to add admin the mail is already taken ');
                console.log("msh bey add al admin");
            }
        } catch (error) {
            alert('Error adding admin: ' + error);
        }
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function isValidName(name) {
    // Regular expression to match only letters (a-z, A-Z)
    const re = /^[a-zA-Z]+$/;
    return re.test(name);
}
async function checkEmailAvailability(email) {
    try {
        const response = await fetch('/admin/checkAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: email })
        });

        if (response.ok) {
            console.log("Email is available");
            return true;
        } else {
            alert("email is not available");
            console.log("Email is not available");
            return false;
        }
    } catch (error) {
        console.log("Error checking email availability: ", error);
        alert('Error checking email availability: ' + error);
        return false;
    }
}


// // Add event listeners for input fields to check email availability and validate on change
// document.getElementById('firstName').addEventListener('input', validateFirstName);
// document.getElementById('lastName').addEventListener('input', validateLastName);
// document.getElementById('email').addEventListener('input', validateEmailInput);
// document.getElementById('password').addEventListener('input', validatePassword);

// // Function to validate First Name
// function validateFirstName() {
//     const firstName = document.getElementById('firstName').value.trim();
//     const nameError = document.getElementById('firstNameError');

//     if (firstName === "") {
//         nameError.textContent = "First Name is required.";
//         document.getElementById('firstName').style.borderColor = 'red';
//         return false;
//     } else if (!isValidName(firstName)) {
//         nameError.textContent = "First Name should contain only letters.";
//         document.getElementById('firstName').style.borderColor = 'red';
//         return false;
//     } else {
//         nameError.textContent = "";
//         document.getElementById('firstName').style.borderColor = '';
//         return true;
//     }
// }

// // Function to validate Last Name
// function validateLastName() {
//     const lastName = document.getElementById('lastName').value.trim();
//     const nameError = document.getElementById('lastNameError');

//     if (lastName === "") {
//         nameError.textContent = "Last Name is required.";
//         document.getElementById('lastName').style.borderColor = 'red';
//         return false;
//     } else if (!isValidName(lastName)) {
//         nameError.textContent = "Last Name should contain only letters.";
//         document.getElementById('lastName').style.borderColor = 'red';
//         return false;
//     } else {
//         nameError.textContent = "";
//         document.getElementById('lastName').style.borderColor = '';
//         return true;
//     }
// }

// // Function to validate Email and check availability
// async function validateEmailInput() {
//     const email = document.getElementById('email').value.trim();
//     const emailError = document.getElementById('emailError');
//     const isValidEmail = validateEmail(email);

//     if (email === "") {
//         emailError.textContent = "Email is required.";
//         document.getElementById('email').style.borderColor = 'red';
//         return false;
//     } else if (!isValidEmail) {
//         emailError.textContent = "Invalid Email Address.";
//         document.getElementById('email').style.borderColor = 'red';
//         return false;
//     } else {
//         const available = await checkEmailAvailability(email);
//         if (!available) {
//             emailError.textContent = "Email already in use.";
//             document.getElementById('email').style.borderColor = 'red';
//             return false;
//         } else {
//             emailError.textContent = "";
//             document.getElementById('email').style.borderColor = '';
//             return true;
//         }
//     }
// }

// // Function to validate Password
// function validatePassword() {
//     const password = document.getElementById('password').value.trim();

//     if (password === "") {
//         alert("Password is required.");
//         return false;
//     } else {
//         return true;
//     }
// }

// // Add submit event listener to the form
// document.getElementById('addAdminForm').addEventListener('submit', async function(event) {
//     event.preventDefault(); // Prevent the default form submission

//     // Validate all fields before submitting
//     const isFirstNameValid = validateFirstName();
//     const isLastNameValid = validateLastName();
//     const isEmailValid = await validateEmailInput();
//     const isPasswordValid = validatePassword();

//     if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid) {
//         const firstName = document.getElementById('firstName').value.trim();
//         const lastName = document.getElementById('lastName').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const password = document.getElementById('password').value.trim();

//         try {
//             const response = await fetch('/admin/saveaddAdmin', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ firstName, lastName, email, password })
//             });

//             if (response.ok) {
//                 alert('Admin added successfully');
//                 window.location.href = '/admin/addAdmin'; // Redirect to the add admin page or another appropriate page
//             } else {
//                 alert('Failed to add admin. The email is already taken.');
//             }
//         } catch (error) {
//             alert('Error adding admin: ' + error);
//         }
//     }
// });

// // Regular expression to validate email format
// function validateEmail(email) {
//     const re = /\S+@\S+\.\S+/;
//     return re.test(email);
// }

// // Function to check email availability
// async function checkEmailAvailability(email) {
//     try {
//         const response = await fetch('/admin/checkAddress', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ address: email })
//         });

//         if (response.ok) {
//             return true; // Email is available
//         } else {
//             return false; // Email is not available
//         }
//     } catch (error) {
//         console.log("Error checking email availability: ", error);
//         return false;
//     }
// }

// // Function to validate name format (only letters)
// function isValidName(name) {
//     const re = /^[a-zA-Z]+$/;
//     return re.test(name);
// }
