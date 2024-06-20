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
    }

    // Validate last name
    if (lastName === "") {
        isValid = false;
        alert("Last Name is zeft required.");
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
