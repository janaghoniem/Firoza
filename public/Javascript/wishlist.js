document.addEventListener('DOMContentLoaded', function() {
    // Select all increment and decrement buttons
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    const removeButtons = document.querySelectorAll('.remove-item');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const itemsCountElement = document.querySelector('.items-count');
 
    // Attach click event listeners to each increment button
    incrementButtons.forEach(button => {
       button.addEventListener('click', function() {
          const item = this.dataset.item;
          const quantityInput = document.getElementById(`quantity-${item}`);
          let currentQuantity = parseInt(quantityInput.value);
          currentQuantity++;
          quantityInput.value = currentQuantity;
 
          updateTotalPrice();
       });
    });
 
    // Attach click event listeners to each decrement button
    decrementButtons.forEach(button => {
       button.addEventListener('click', function() {
          const item = this.dataset.item;
          const quantityInput = document.getElementById(`quantity-${item}`);
          let currentQuantity = parseInt(quantityInput.value);
          if (currentQuantity > 1) {
             currentQuantity--;
             quantityInput.value = currentQuantity;
          }
 
          updateTotalPrice();
       });
    });
 
    // Attach click event listeners to each remove button
    removeButtons.forEach(button => {
       button.addEventListener('click', function() {
          const itemRow = this.closest('.item-row');
          itemRow.remove();
          updateTotalPrice();
       });
    });
 
    // Function to update total price
    function updateTotalPrice() {
       let totalPrice = 0;
       let itemsCount = 0;
       const itemPrices = document.querySelectorAll('.item-price');
       const quantityInputs = document.querySelectorAll('.quantity-input');
 
       itemPrices.forEach((price, index) => {
          const priceText = price.textContent.trim().replace('EGP', '').trim();
          const quantity = parseInt(quantityInputs[index].value);
          totalPrice += parseInt(priceText) * quantity;
          itemsCount += quantity;
       });
 
       // Update the total price and items count in the summary section
       totalPriceElements.forEach(element => {
          element.textContent = `EGP ${totalPrice}`;
       });
       itemsCountElement.textContent = `ITEMS ${itemsCount}`;
    }
 });
 





 document.addEventListener('DOMContentLoaded', function() {
    // Select all increment and decrement buttons
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    const removeButtons = document.querySelectorAll('.remove-item');
    const totalPriceElements = document.querySelectorAll('.total-price');
    const itemsCountElement = document.querySelector('.items-count');
 
    // Attach click event listeners to each increment button
    incrementButtons.forEach(button => {
       button.addEventListener('click', function() {
          const item = this.dataset.item;
          const quantityInput = document.getElementById(`quantity-${item}`);
          let currentQuantity = parseInt(quantityInput.value);
          currentQuantity++;
          quantityInput.value = currentQuantity;
 
          updateTotalPrice();
       });
    });
 
    // Attach click event listeners to each decrement button
    decrementButtons.forEach(button => {
       button.addEventListener('click', function() {
          const item = this.dataset.item;
          const quantityInput = document.getElementById(`quantity-${item}`);
          let currentQuantity = parseInt(quantityInput.value);
          if (currentQuantity > 1) {
             currentQuantity--;
             quantityInput.value = currentQuantity;
          }
 
          updateTotalPrice();
       });
    });
 
    // Attach click event listeners to each remove button
    removeButtons.forEach(button => {
       button.addEventListener('click', function() {
          const itemRow = this.closest('.item-row');
          itemRow.remove();
          updateTotalPrice();
       });
    });
 
    // Function to update total price
    function updateTotalPrice() {
       let totalPrice = 0;
       let itemsCount = 0;
       const itemPrices = document.querySelectorAll('.item-price');
       const quantityInputs = document.querySelectorAll('.quantity-input');
 
       itemPrices.forEach((price, index) => {
          const priceText = price.textContent.trim().replace('EGP', '').trim();
          const quantity = parseInt(quantityInputs[index].value);
          totalPrice += parseInt(priceText) * quantity;
          itemsCount += quantity;
       });
 
       // Update the total price and items count in the summary section
       totalPriceElements.forEach(element => {
          element.textContent = `EGP ${totalPrice}`;
       });
       itemsCountElement.textContent = `ITEMS ${itemsCount}`;
    }
 });
 

//  -----------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('search-button');
    const searchButton2 = document.getElementById('search-button2');
    const middleDiv = document.getElementById('top-move-on-scroll');
    const middleDivanchors = document.querySelectorAll('middleDiv a');
    const headerMiddle = document.getElementById('header-middle');

    if(window.innerWidth < 1100)
    {
        searchButton.style.display = 'none';
        searchButton2.style.marginLeft = '70px';
        middleDiv.style.display = 'flex';
        middleDivanchors.display = 'none';
        headerMiddle.style.justifyContent = 'center';
    } 

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
                middleDivanchors.display = 'none';
                searchButton2.classList.remove('search-button-scrolled');
                searchButton2.classList.add('search-button-unscrolled');
            }

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

    //responiveness
    // function toggleMenu(){
    //     var nav= document.querySelector('.navigation');
    //     nav.style.display=nav.style.display==='block'? 'none' :'block';
    // }

    //login - sign-up pop up
    const loginIconTrigger = document.getElementById('login-button');
    const loginIconTrigger2 = document.getElementById('login-button2');
    const popupContainer = document.getElementById('popup-container');
    const loginButton = document.getElementById('login-nav');
    const loginform = document.getElementById('login-form');
    const createAccountButton = document.getElementById('Create-an-account-nav');
    const createAccountForm = document.getElementById('create-account-form');

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
    const currentUsers = [{"Email": "admin@mail.com", "Password":"123admin"}];

    function userExists(email) {
        return currentUsers.some(user => user.Email === email);
    }
    
    function addUser(email, password) {
        currentUsers.push({ "Email": email, "Password": password });
    }

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

    //validate login
    const loginSubmitButton = document.getElementById('login-form-button');
    const loginFormEmailField = document.getElementById('login-form-email-field');
    const loginFormEmailError = document.getElementById('login-form-email-error');
    const loginFormPasswordField = document.getElementById('login-form-password-field');
    const loginFormPasswordError = document.getElementById('login-form-password-error');

    let requiredFieldError = "Required Field.";
    let invalidEmailError = "Invalid E-mail Address";
    let invalidPasswordError = "Use 8 or more characters";

    function validateLogin() {
        let valid = true;
        loginFormEmailError.textContent = '';
        loginFormPasswordError.textContent = '';
        
        noErrorStyling(loginFormEmailField);
        noErrorStyling(loginFormPasswordField);

        if(loginFormEmailField.value === ""){
            loginFormEmailField.style.borderColor = 'red';
            loginFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            loginFormEmailError.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidEmail(loginFormEmailField.value.trim())){
            loginFormEmailError.textContent = invalidEmailError;
            loginFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            valid = false;
        } 

        if (loginFormPasswordField.value === "") {
            loginFormPasswordField.style.borderColor = 'red';
            loginFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            loginFormPasswordError.textContent = requiredFieldError;
            valid = false;
        }else if (!isValidPassword(loginFormPasswordField.value.trim())){
            loginFormPasswordError.textContent = invalidPasswordError;
            loginFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            valid = false;
        }

        return valid;
    }

    loginSubmitButton.addEventListener('click', () => {
        if(validateLogin()) {
            if(userExists(loginFormEmailField.value)) {
                //el mafrood hena ye3mel login baa
                if(loginFormEmailField.value === "admin@mail.com" && loginFormPasswordField.value === "123admin") {
                    //neroo7 le page shahd
                    // console.log('admin logged in');
                    // window.location.href("..//HTML/main.html");
                } else {
                    //user 3ady
                }
            } else {
                //replace dy b fading pop up
                alert("User does not exist. Please sign up.");
            }
        } else {
            event.preventDefault();
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

        if(signUpFormEmailField.value === ""){
            signUpFormEmailField.style.borderColor = 'red';
            signUpFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormEmailError.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidEmail(signUpFormEmailField.value.trim())){
            signUpFormEmailField.style.borderColor = 'red';
            signUpFormEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormEmailError.textContent = invalidEmailError;
            valid = false;
        }
        if(signUpFormConfirmEmailField.value === ""){
            signUpFormConfirmEmailField.style.borderColor = 'red';
            signUpFormConfirmEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmEmailError.textContent = requiredFieldError;
            valid = false;
        } else if (signUpFormEmailField.value !== signUpFormConfirmEmailField){
            signUpFormConfirmEmailField.style.borderColor = 'red';
            signUpFormConfirmEmailField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmEmailError.textContent = emailConfirmationError;
            valid = false;
        }
        if(signUpFormPasswordField.value === ""){
            signUpFormPasswordField.style.borderColor = 'red';
            signUpFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormPasswordError.textContent = requiredFieldError;
            valid = false;
        } else if (!isValidPassword(signUpFormPasswordField.value.trim())){
            signUpFormPasswordField.style.borderColor = 'red';
            signUpFormPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormPasswordError.textContent = invalidPasswordError;
            valid = false;
        }
        if(signUpFormConfirmPasswordField.value === ""){
            signUpFormConfirmPasswordField.style.borderColor = 'red';
            signUpFormConfirmPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmPasswordError.textContent = requiredFieldError;
            valid = false;
        } else if (signUpFormConfirmPasswordField.value !== signUpFormPasswordField){
            signUpFormConfirmPasswordField.style.borderColor = 'red';
            signUpFormConfirmPasswordField.style.backgroundColor = 'rgb(255, 242, 242)';
            signUpFormConfirmPasswordError.textContent = passwordConfirmationError;
            valid = false;
        }

        return valid;
    }

    createAccountSubmitButton.addEventListener('click', () => {
        if(validateSignUp()) {
            //add el user lel dictionary beta3ty
            addUser(signUpFormEmailField.value, signUpFormPasswordField.value);
            //replace with cute fading popup
            alert("Account created successfully!");
        } else {
            event.preventDefault();
        }
    });

    //exiting el popup login
    const exitPopupButton = document.getElementById('exit-popup-button');

    exitPopupButton.addEventListener('click', () => {
        popupContainer.style.display = 'none';
        document.body.style.overflow = 'scroll';
    });

    
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
            if(window.innerWidth > 440)
            {
                searchDiv2.style.width = '200px';
                searchField2.style.width = '200px';
            } else {
                console.log('da5al hena');
                searchDiv2.style.width = '120px';
                searchField2.style.width = '120px';
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

    // 7agat el carousel
    const track = document.getElementById("carousel__track");
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('carousel__button--right');
    const prevButton = document.getElementById('carousel__button--left');
    
    //da in case el user 8ayar el size of the window
    const slideSize = slides[0].getBoundingClientRect();
    const slideWidth = 275;


    // arrange the slides next to each other
    // set el slide position for each slide in my carousel
    slides.forEach((slide, index) =>
    {
        slide.style.left = slideWidth * index + 'px';
        // if(index)
        // console.log("slide" + index + " width: " + slide.style.left)
    });

    //functions

    function moveToSlide(track, currentSlide, targetSlide) {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    }

    function hideShowArrows (slides, prevButton, nextButton, targetIndex) {
        if(targetIndex === 0)
        {
            prevButton.classList.add('is-hidden');
            nextButton.classList.remove('is-hidden');
        } else if (targetIndex === slides.length - 5) {
            nextButton.classList.add('is-hidden');
            prevButton.classList.remove('is-hidden');
        } else {
            nextButton.classList.remove('is-hidden');
            prevButton.classList.remove('is-hidden');
        }
    }

    //move left, slide to the left
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling;
        const prevIndex = slides.findIndex(slide => slide === prevSlide);

        moveToSlide(track, currentSlide, prevSlide);
        hideShowArrows(slides, prevButton, nextButton, prevIndex);
    });

    //move right, slide to the right
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling;
        const nextIndex = slides.findIndex(slide => slide === nextSlide);

        moveToSlide(track, currentSlide, nextSlide);
        hideShowArrows(slides, prevButton, nextButton, nextIndex);
    });

    
    //categories hovering
    document.querySelectorAll('.item').forEach(item => {
        const primaryimg = item.querySelector('.primary-img');
        const secondaryimg = item.querySelector('.secondary-img');
        const anchor = item.querySelector('a');
    
        //hover lel entire div
        if(primaryimg && secondaryimg)
        {
            anchor.addEventListener('mouseenter', function() {
                // img.src = `../images/Landing/exp/${category}2.jpg`;
                primaryimg.style.opacity = '0';
                secondaryimg.style.opacity = '1';
            });
    
            anchor.addEventListener('mouseout', function() {
                primaryimg.style.opacity = '1';
                secondaryimg.style.opacity = '0';
            });
        }
    });

});
function upadateCaseNumber(product, price, isIncreasing) {
    const caseInput = document.getElementById(product + '-number');
    let caseNumber = caseInput.value;
    if (isIncreasing) {
        caseNumber = parseInt(caseNumber) + 1;
    }

    else if (caseNumber > 0) {
        caseNumber = parseInt(caseNumber) - 1;
    }

    caseInput.value = caseNumber;

    const caseTotal = document.getElementById(product + '-total');
    caseTotal.innerText = caseNumber * price;
    calculateTotal();
}


function getInputvalue(product) {
    const productInput = document.getElementById(product + '-number');
    const productNumber = parseInt(productInput.value);
    return productNumber;
}
function calculateTotal() {
    const jewelryTotal = getInputvalue('jewelry') * 1219;
    const caseTotal = getInputvalue('case') * 59;
    const subTotal = jewelryTotal + caseTotal;
    const tax = subTotal / 10;
    const totalPrice = subTotal + tax;

    // update on the html 
    document.getElementById('sub-total').innerText = subTotal;
    document.getElementById('tax-amount').innerText = tax;
    document.getElementById('total-price').innerText = totalPrice;

}
document.getElementById('case-plus').addEventListener('click', function () {
    upadateCaseNumber('case', 59, true);
});

document.getElementById('case-minus').addEventListener('click', function () {
    upadateCaseNumber('case', 59, false);
});

// jewelry prcie update using add event linstner 
document.getElementById('jewelry-plus').addEventListener('click', function () {
    upadateCaseNumber('jewelry', 1219, true);
});


document.getElementById('jewelry-minus').addEventListener('click', function () {
    upadateCaseNumber('jewelry', 1219, false);
});

// ----------------------------------------------header----------------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {

    //nav bar scroll
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        const headerTop = document.getElementById('header-top');

        const headerMiddle = document.getElementById('header-middle');
        const sideicon = document.getElementById('side-icon');
        const middleDiv = document.getElementById('top-move-on-scroll');
        const headerBottom = document.getElementById('header-bottom');
        const logo = document.getElementById('logo');
        const searchButton = document.getElementById('search-button');
        const searchbutton2 = document.getElementById('search-button2');

        if (window.scrollY > 0) {
            header.classList.remove('header-unscrolled');
            header.classList.add('header-scrolled');

            searchButton.style.display = 'none';
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

            if (!this.window.width < 1090) {
                searchButton.style.display = 'flex';
                middleDiv.style.display = 'none';
            }


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

    //nav bar extension on hover
    const navigationLinks = document.querySelectorAll('#header-bottom .navigation .extension');
    const headerExtension = document.getElementById('header-bottom-anchor-extension');
    const exitButton = document.getElementById('exit-extension-button');
    let mouseOverLink = false; //in case el user alternated between el links besor3a msh 3aizeen flickering

    if (exitButton) {
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

    //responiveness
    function toggleMenu() {
        var nav = document.querySelector('.navigation');
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    }
});
function addToCart(button) {
    // Get the parent div of the button
    var parentDiv = button.parentNode.parentNode;
    
    // Hide the parent div
    parentDiv.style.display = 'none';
}




