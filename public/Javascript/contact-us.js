document.addEventListener('DOMContentLoaded', function() {
    //CONTACT US
    const emailUs = document.getElementById('Email-us');
    const arrowDown = document.getElementById('arrow-down');
    const arrowUp = document.getElementById('arrow-up');
    const email = document.getElementById('email');
    // const cs = document.getElementById('CSAI');
    // const cspopup = document.getElementById('cs-popup');

    if(arrowUp && arrowDown){
        arrowDown.addEventListener('click', () => {
            arrowDown.style.display = 'none';
            arrowUp.style.display = 'block';
    
            emailUs.style.height = '165px'
            email.style.display = 'block';
        });
    
        arrowUp.addEventListener('click', () => {
            arrowUp.style.display = 'none';
            arrowDown.style.display = 'block';
    
            email.style.display = 'none';
            emailUs.style.height = '129px'
        });
    }

    // cs.addEventListener('click', () => {
    //     event.preventDefault();
    //     // cspopup.style.display = 'flex';
    // })

    //CUSTOMER SUPPORT FORM
    const fn = document.getElementById('first-name-form-field');
    const fnerror = document.getElementById('first-name-form-field-error');
    const ln = document.getElementById('last-name-form-field');
    const lnerror = document.getElementById('last-name-form-field-error');
    const pn = document.getElementById('phone-number-form-field');
    const pnerror = document.getElementById('phone-number-form-field-error');
    const em = document.getElementById('email-address-form-field');
    const emerror = document.getElementById('email-address-form-field-error');
    const ta = document.getElementById('message-form-field');
    const taerror = document.getElementById('message-form-field-error');

    const submitbutton = document.getElementById('submit-button');

    function isValidPhoneNumber(number) {
        const phoneNumberPattern = /^(?:(?:\+|00)([1-9]\d{0,2}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;
        return phoneNumberPattern.test(number);
    }

    function validateFormSubmission() {

        let valid = true;
        fnerror.textContent = '';
        lnerror.textContent = '';
        pnerror.textContent = '';
        emerror.textContent = '';
        taerror.textContent = '';

        noErrorStyling(fn);
        noErrorStyling(ln);
        noErrorStyling(pn);
        noErrorStyling(em);
        noErrorStyling(ta);

        if(fn.value === ""){
            fn.style.borderColor = 'red';
            fn.style.backgroundColor = 'rgb(255, 242, 242)';
            fnerror.textContent = requiredFieldError;
            valid = false;
        }
        if(ln.value === ""){
            ln.style.borderColor = 'red';
            ln.style.backgroundColor = 'rgb(255, 242, 242)';
            lnerror.textContent = requiredFieldError;
            valid = false;
        }

        if(em.value === ""){
            em.style.borderColor = 'red';
            em.style.backgroundColor = 'rgb(255, 242, 242)';
            emerror.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidEmail(em.value.trim())){
            em.style.borderColor = 'red';
            em.style.backgroundColor = 'rgb(255, 242, 242)';
            emerror.textContent = invalidEmailError;
            valid = false;
        }
        if(pn.value === ""){
            noErrorStyling(pn);
            pnerror.textContent = '';
        } else if (!isValidPhoneNumber(pn.value.trim())){
            pn.style.borderColor = 'red';
            pn.style.backgroundColor = 'rgb(255, 242, 242)';
            pnerror.textContent = "Invalid Phone Number";
            valid = false;
        }
        if(ta.value === ""){
            ta.style.borderColor = 'red';
            ta.style.backgroundColor = 'rgb(255, 242, 242)';
            taerror.textContent = requiredFieldError;
            valid = false;
        }

        return valid;
    }

    if(submitbutton){
        submitbutton.addEventListener('click', () => {
            if(!validateFormSubmission())
                e.preventDefault();
            //popup message sent
    
            //clear fields
            fn.textContent = '';
            ln.textContent = '';
            em.textContent = '';
            pn.textContent = '';
            ta.textContent = '';
        })
    }
    
});


///--------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('contactUsForm').addEventListener('submit', function(event) {
    let isValid = true;

    const firstName = document.getElementById('first-name-form-field').value.trim();
    const lastName = document.getElementById('last-name-form-field').value.trim();
    const email = document.getElementById('email-address-form-field').value.trim();
    const subject = document.getElementById('subject-select-field').value.trim();
    const reason = document.getElementById('reason-form-field').value.trim();

    if (firstName === "") {
        isValid = false;
        document.getElementById('first-name-form-field-error').textContent = "First Name is required.";
    } else {
        document.getElementById('first-name-form-field-error').textContent = "";
    }

    if (lastName === "") {
        isValid = false;
        document.getElementById('last-name-form-field-error').textContent = "Last Name is required.";
    } else {
        document.getElementById('last-name-form-field-error').textContent = "";
    }

    if (email === "") {
        isValid = false;
        document.getElementById('email-address-form-field-error').textContent = "Email is required.";
    } else if (!validateEmail(email)) {
        isValid = false;
        document.getElementById('email-address-form-field-error').textContent = "Invalid Email Address.";
    } else {
        document.getElementById('email-address-form-field-error').textContent = "";
    }

    if (reason === "") {
        isValid = false;
        document.getElementById('reason-form-field-error').textContent = "Reason is required.";
    } else {
        document.getElementById('reason-form-field-error').textContent = "";
    }

    if (!isValid) {
        event.preventDefault();
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
//-----------------------------------------------------------------------------
const form = document.getElementById('contactUsForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const firstName = document.getElementById('first-name-form-field').value;
    const lastName = document.getElementById('last-name-form-field').value;
    const email = document.getElementById('email-address-form-field').value;
    const subject = document.getElementById('subject-select-field').value;
    const reason = document.getElementById('reason-form-field').value;

    try {
        const response = await fetch('/user/submitRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                subject,
                reason
            })
        });

        console.log('Response:', response); // Debug statement to log response object
        
        if (!response.ok) {
            throw new Error('Failed to submit request');
        }
        
        const data = await response.json();
        console.log('Response Data:', data); // Debug statement to log response data
        alert('Request submitted successfully!'); 
        // Handle success response
        console.log('Request submitted successfully:', data.message);
        alert();
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('Failed to submit request. Please try again.'); // Debug statement to log error
        // Handle error
    }
});
