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
