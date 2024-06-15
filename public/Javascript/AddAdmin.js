
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
});

   