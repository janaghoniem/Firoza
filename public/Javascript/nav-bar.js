document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-button');
    const searchButton2 = document.getElementById('search-button2');
    const middleDiv = document.getElementById('top-move-on-scroll');
    const middleDivanchors = middleDiv.querySelectorAll('a');
    const headerMiddle = document.getElementById('header-middle');

    window.addEventListener('resize', () => {
        if(window.innerWidth < 1100)
        {
            searchButton.style.display = 'none';
            searchButton2.style.marginLeft = '50px';
            middleDiv.style.display = 'flex';
            middleDivanchors.forEach(anchor => {
                anchor.style.display = 'none';
            });
            headerMiddle.style.justifyContent = 'center';
        } 
        else {
            searchButton.style.display = 'flex'; 
            middleDiv.style.display = 'none';
            middleDivanchors.forEach(anchor => {
                anchor.style.display = 'inline';
            });
            closeNav();
        }
    });

    //nav bar scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const headerTop = document.getElementById('header-top');
        const sideicon = document.getElementById('side-icon');
        const headerBottom = document.getElementById('header-bottom');
        const logo = document.getElementById('logo');
        
    
        if (window.scrollY > 0) {
            header.classList.remove('header-unscrolled');
            header.classList.add('header-scrolled');

            searchButton.style.display = 'none';

            searchButton2.classList.remove('search-button-unscrolled');
            searchButton2.classList.add('search-button-scrolled');

            sideicon.style.color = 'black';
    
            middleDiv.style.display = 'flex';
    
            headerTop.style.display = 'none';
    
            middleDiv.classList.remove('header-top-unscrolled');
            middleDiv.classList.add('header-top-scrolled');
    
            headerMiddle.style.justifyContent = 'space-between';
    
            logo.classList.remove('logo-unscrolled');
            logo.classList.add('logo-scrolled');
    
            headerBottom.classList.remove('header-bottom-unscrolled');
            headerBottom.classList.add('header-bottom-scrolled');
        } else {
            header.classList.remove('header-scrolled');
            header.classList.add('header-unscrolled');
    
            if(window.innerWidth > 1100)
            {
                searchButton.style.display = 'flex';
                middleDiv.style.display = 'none';
            } else {
                middleDivanchors.forEach(anchor => {
                    anchor.style.display = 'none';
                });
                headerMiddle.style.justifyContent = 'center';
            }
            
            searchButton2.classList.remove('search-button-scrolled');
            searchButton2.classList.add('search-button-unscrolled');

            sideicon.style.color = 'white';

            headerTop.style.display = 'flex';

            middleDiv.classList.remove('header-top-unscrolled');
            middleDiv.classList.remove('header-top-scrolled');

    
            headerMiddle.style.justifyContent = 'center';
    
            logo.classList.remove('logo-scrolled');
            logo.classList.add('logo-unscrolled');
        
            headerBottom.classList.add('header-bottom-unscrolled');
            headerBottom.classList.remove('header-bottom-scrolled');
        }
    });

    //responsive header
    const closebtn = document.getElementById('closebtn');
    const openIcon = document.getElementById('ham-whatever');
      
    function closeNav() {
        document.getElementById("mySidepanel").style.width = "0";
    }
      
    openIcon.addEventListener('click', () => {
        // console.log('clicked');
        // var nav= document.querySelector('.navigation');
        // nav.style.display=nav.style.display==='block'? 'none' :'block';
        console.log('clicked');
        document.getElementById("mySidepanel").style.display = 'block';
        document.getElementById("mySidepanel").style.width = "250px";
    });
    closebtn.addEventListener('click', () => {
        document.getElementById("mySidepanel").style.width = "0";
    });

    //nav bar extension on hover
    const navigationLinks = document.querySelectorAll('#header-bottom .navigation .extension');
    const headerExtension = document.getElementById('header-bottom-anchor-extension');
    const exitButton = document.getElementById('exit-extension-button');
    let mouseOverLink = false; //in case el user alternated between el links besor3a msh 3aizeen flickering

    if(exitButton){
        exitButton.addEventListener('click', () => {
            mouseOverLink = false;
            console.log('exit button clicked');
            headerExtension.style.display = 'none';
        });
    }

    navigationLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            mouseOverLink = true;
            headerExtension.style.display = 'block';
        });

        link.addEventListener('mouseleave', () => {
            mouseOverLink = false;
            setTimeout(() => {
                if (!mouseOverLink) {
                    headerExtension.style.display = 'none';
                }
            }, 500); 
        });
    });

    headerExtension.addEventListener('mouseenter', () => {
        mouseOverLink = true;
    });

    headerExtension.addEventListener('mouseleave', () => {
        mouseOverLink = false;
        setTimeout(() => {
            if (!mouseOverLink) {
                headerExtension.style.display = 'none';
            }
        }, 30); 
    });

    //login - sign-up pop up
    const loginIconTrigger = document.getElementById('login-button');
    const loginIconTrigger2 = document.getElementById('login-button2');
    const loginIconTrigger3 = document.getElementById('login-button3');
    const popupContainer = document.getElementById('popup-container');
    const loginButton = document.getElementById('login-nav');
    const loginform = document.getElementById('login-form');
    const createAccountButton = document.getElementById('Create-an-account-nav');
    const createAccountForm = document.getElementById('create-account-form');
    const loginMessage = document.getElementById('login-message-popup');

    loginIconTrigger.addEventListener('click', () => {
        event.preventDefault();
        popupContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    loginIconTrigger2.addEventListener('click', () => {
        event.preventDefault();
        popupContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    loginIconTrigger3.addEventListener('click', () => {
        event.preventDefault();
        popupContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    loginButton.addEventListener('click', () => {
        createAccountButton.classList.remove('active');
        createAccountForm.style.display = 'none';

        loginButton.classList.add('active');
        loginform.style.display = 'block';
    });

    createAccountButton.addEventListener('click', () => {
        loginButton.classList.remove('active');
        loginform.style.display = 'none';

        createAccountButton.classList.add('active');
        createAccountForm.style.display = 'block';
    });

    //LOGIN HANDLING

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function isValidPassword(password) {
        return (password.length >= 8);
    }

    function noErrorStyling(field) {
        field.style.borderColor = 'silver';
        field.style.backgroundColor = 'transparent';
    }

    //exiting el popup login
    const exitPopupButton = document.getElementById('exit-popup-button');

    exitPopupButton.addEventListener('click', () => {
        popupContainer.style.display = 'none';
        document.body.style.overflow = 'scroll';
    });
    
        
    //validate login
    const loginSubmitButton = document.getElementById('login-form-button');
    const loginFormEmailField = document.getElementById('login-form-email-field');
    const loginFormEmailError = document.getElementById('login-form-email-error');
    const loginFormPasswordField = document.getElementById('login-form-password-field');
    const loginFormPasswordError = document.getElementById('login-form-password-error');

    let requiredFieldError = "Required Field.";
    let invalidEmailError = "Invalid E-mail Address";
    let invalidPasswordError = "Use 8 or more characters";

    let userData;

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 8; // Simple validation
    }

    function noErrorStyling(element) {
        element.style.borderColor = '';
        element.style.backgroundColor = '';
    }

    async function loginUser(email, password) {
        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
    
            if (!response.ok) {
                // Handle server errors or incorrect login credentials
                const errorData = await response.json();
                if (errorData.error.includes('email')) {
                    loginFormEmailField.style.borderColor = 'red';
                    loginFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
                    loginFormEmailError.textContent = errorData.error;
                } else if (errorData.error.includes('password')) {
                    loginFormPasswordField.style.borderColor = 'red';
                    loginFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
                    loginFormPasswordError.textContent = errorData.error;
                }
                return false;
            }
    
            userData = await response.json();
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
    
    loginSubmitButton.addEventListener('click', async (event) => {
        event.preventDefault();
    
        // Reset error messages and styling
        loginFormEmailError.textContent = '';
        loginFormPasswordError.textContent = '';
        noErrorStyling(loginFormEmailField);
        noErrorStyling(loginFormPasswordField);
    
        const email = loginFormEmailField.value.trim();
        const password = loginFormPasswordField.value.trim();
    
        let valid = true;
    
        // Client-side validation
        if (email === '') {
            loginFormEmailField.style.borderColor = 'red';
            loginFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            loginFormEmailError.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidEmail(email)) {
            loginFormEmailError.textContent = invalidEmailError;
            loginFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            valid = false;
        }
    
        if (password === '') {
            loginFormPasswordField.style.borderColor = 'red';
            loginFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            loginFormPasswordError.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidPassword(password)) {
            loginFormPasswordError.textContent = invalidPasswordError;
            loginFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            valid = false;
        }
    
        if (valid) {
            if (await loginUser(email, password)) {
                exitPopupButton.click();
                showPopup('Login Successful');
                if (userData.isAdmin) {
                    window.location.href = '/admin'; // Redirect to admin page
                }
            }
        }
    });
    
    //Validate sign-up
    const createAccountSubmitButton = document.getElementById('create-account-button');
    const signUpFormFirstNameField = document.getElementById('sign-up-first-name-field');
    const signUpFormFirstNameError= document.getElementById('sign-up-first-name-error');
    const signUpFormLastNameField = document.getElementById('sign-up-last-name-field');
    const signUpFormLastNameError= document.getElementById('sign-up-last-name-error');
    const signUpFormEmailField = document.getElementById('sign-up-email-field');
    const signUpFormEmailError = document.getElementById('sign-up-email-error');
    const signUpFormConfirmEmailField = document.getElementById('sign-up-confirm-email-field');
    const signUpFormConfirmEmailError = document.getElementById('sign-up-confirm-email-error');
    const signUpFormPasswordField = document.getElementById('sign-up-password-field');
    const signUpFormPasswordError = document.getElementById('sign-up-password-error');
    const signUpFormConfirmPasswordField = document.getElementById('sign-up-confirm-password-field');
    const signUpFormConfirmPasswordError = document.getElementById('sign-up-confirm-password-error');

    let emailConfirmationError = "The E-mail confirmation does not match your E-mail address.";
    let passwordConfirmationError = "The password confirmation does not match your entered password."

    function validateSignUp() {
        let valid = true;
        signUpFormFirstNameError.textContent = '';
        signUpFormLastNameError.textContent = '';
        signUpFormEmailError.textContent = '';
        signUpFormPasswordError.textContent = '';
        signUpFormConfirmEmailError.textContent = '';
        signUpFormConfirmPasswordError.textContent = '';

        noErrorStyling(signUpFormFirstNameField);
        noErrorStyling(signUpFormLastNameField);
        noErrorStyling(signUpFormEmailField);
        noErrorStyling(signUpFormPasswordField);
        noErrorStyling(signUpFormConfirmEmailField);
        noErrorStyling(signUpFormConfirmPasswordField);

        if(signUpFormFirstNameField.value === ""){
            signUpFormFirstNameField.style.borderColor = 'red';
            signUpFormFirstNameField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormFirstNameError.textContent = requiredFieldError;
            valid = false;
        }
        if(signUpFormLastNameField.value === ""){
            signUpFormLastNameField.style.borderColor = 'red';
            signUpFormLastNameField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormLastNameError.textContent = requiredFieldError;
            valid = false;
        }
        return valid;
    }

    // Function to check if email is already taken (asynchronously)
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
            alert('Error checking email availability:' + error);
            return false; // Default to false in case of errors
        }
    }

    signUpFormEmailField.addEventListener('input', async () => {
        const email = signUpFormEmailField.value.trim();
        if (email === '') {
            noErrorStyling(signUpFormEmailField);
            signUpFormEmailError.textContent = '';
            return;
        }
        if (!isValidEmail(email)) {
            signUpFormEmailField.style.borderColor = 'red';
            signUpFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormEmailError.textContent = invalidEmailError;
            return;
        }
        const available = await checkEmailAvailability(email);
        if (!available) {
            signUpFormEmailField.style.borderColor = 'red';
            signUpFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormEmailError.textContent = 'Email already in use';
        } else {
            noErrorStyling(signUpFormEmailField);
            signUpFormEmailError.textContent = '';
        }
    });
    

    signUpFormConfirmEmailField.addEventListener('input', async () => {
        const email = signUpFormConfirmEmailField.value.trim();
        if (email === '') {
            noErrorStyling(signUpFormConfirmEmailField);
            signUpFormConfirmEmailError.textContent = '';
            return;
        }
        else if (signUpFormEmailField.value.trim() !== email){
            signUpFormConfirmEmailField.style.borderColor = 'red';
            signUpFormConfirmEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmEmailError.textContent = emailConfirmationError;
            valid = false;
        }
        else {
            noErrorStyling(signUpFormConfirmEmailField);
            signUpFormConfirmEmailError.textContent = '';
        }
    });

    signUpFormPasswordField.addEventListener('input', async () => {
        const password = signUpFormPasswordField.value.trim();
        if (password === '') {
            noErrorStyling(signUpFormPasswordField);
            signUpFormPasswordError.textContent = '';
            return;
        }
        else if (!isValidPassword(signUpFormPasswordField.value.trim())){
            signUpFormPasswordField.style.borderColor = 'red';
            signUpFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormPasswordError.textContent = invalidPasswordError;
            valid = false;
        }
        else {
            noErrorStyling(signUpFormPasswordField);
            signUpFormPasswordError.textContent = '';
        }
    });

    signUpFormConfirmPasswordField.addEventListener('input', async () => {
        const password = signUpFormConfirmPasswordField.value.trim();
        if (password === '') {
            noErrorStyling(signUpFormConfirmPasswordField);
            signUpFormConfirmPasswordError.textContent = '';
            return;
        }
        else if (password !== signUpFormPasswordField.value.trim()){
            signUpFormConfirmPasswordField.style.borderColor = 'red';
            signUpFormConfirmPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmPasswordError.textContent = passwordConfirmationError;
            valid = false;
        }
        else {
            noErrorStyling(signUpFormConfirmPasswordField);
            signUpFormConfirmPasswordError.textContent = '';
        }
    });

    createAccountSubmitButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the default form submission
    
        if (validateSignUp()) {
            const email = signUpFormEmailField.value.trim();
            const password = signUpFormPasswordField.value.trim();
    
            // Assuming validation is successful, proceed with form submission
            const formData = {
                firstname: signUpFormFirstNameField.value.trim(),
                lastname: signUpFormLastNameField.value.trim(),
                email: email,
                password: password
            };
    
            try {
                const response = await fetch('/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                const data = await response.json();
                if (response.ok) {
                    showPopup("Account created successfully!");
                    exitPopupButton.click();
                } else {
                    alert(data.error); // Display error message
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
    
    
    function showPopup(message) {
        const popup = document.querySelector('.login-message-popup');
        const popupMessage = popup.querySelector('h2');
        popupMessage.textContent = message;
        
        // Show the popup
        popup.classList.add('show');
        
        // Automatically hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000); // Adjust timing as needed
    }

    // 7agat el search
    const searchButtonclick = document.getElementById('search');
    const searchField = document.getElementById('searchField');
    const searchDiv = document.getElementById('search-button');
    let buttonCount = 0;
    // search functionality
    if (searchButtonclick && searchField) { 
        searchButtonclick.addEventListener('click', expandSearch);
    }

    function expandSearch() {
        if (buttonCount === 0) {
            if(window.innerWidth > 210)
            {
                searchDiv.style.width = '200px';
                searchField.style.width = '200px';
            } else {
                searchDiv.style.width = '40px';
                searchField.style.width = '40px';
            }
            searchDiv.style.border = '1px solid black';
            buttonCount++;
        } else if (buttonCount === 1 && searchField.value == "") {
            searchDiv.style.border = 'none';
            searchField.style.width = '0px';
            searchDiv.style.width = '40px';
            buttonCount--;
        }
        else {
            alert("Hena its supposed to search");
        }
    }

    //second search
    const searchButtonclick2 = document.getElementById('search2');
    const searchField2 = document.getElementById('searchField2');
    const searchDiv2 = document.getElementById('search-button2');
    let buttonCount2 = 0;

    if(searchButtonclick2){
        searchButtonclick2.addEventListener('click', expandSearch2);
    }

    function expandSearch2() {
        if (buttonCount2 === 0) {
            if(window.innerWidth > 400)
            {
                console.log('da5al hena2');
                searchDiv2.style.width = '200px';
                searchField2.style.width = '200px';
            } else {
                console.log('da5al hena');
                searchDiv2.style.width = '100px';
                searchField2.style.width = '100px';
            }
            searchDiv2.style.border = '1px solid black';
            buttonCount2++;
        } else if (buttonCount2 === 1 && searchField2.value == "") {
            searchDiv2.style.border = 'none';
            searchField2.style.width = '0px';
            searchDiv2.style.width = '40px';
            buttonCount2--;
        }
        else {
            alert("Hena its supposed to search");
        }
    }
});