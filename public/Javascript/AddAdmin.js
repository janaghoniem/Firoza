document.getElementById('addAdminForm').addEventListener('submit', async function(event) {
    let isValid = true;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (firstName === "") {
        isValid = false;
        alert("First Name is required.");
    }

    if (lastName === "") {
        isValid = false;
        alert("Last Name is required.");
    }

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
        } else {
            emailError.style.display = 'none';
        }
    }

    if (password === "") {
        isValid = false;
        alert("Password is required.");
    }

    if (!isValid) {
        event.preventDefault();
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.available;
    } catch (error) {
        alert('Error checking email availability: ' + error);
        return false; // Default to false in case of errors
    }
}


