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