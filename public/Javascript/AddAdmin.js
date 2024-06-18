document.getElementById('addAdminForm').addEventListener('submit', function(event) {
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