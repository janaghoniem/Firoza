function toggleMenu(){
    var nav= document.querySelector('.navigation');
    nav.style.display=nav.style.display==='block'? 'none' :'block';
}
window.addEventListener('resize', function() {
    var nav = document.querySelector('.navigation');
    if (window.innerWidth > 900) {
        nav.style.display = 'block'; // Ensure the nav is displayed when the screen size is above 900px
    } else {
        nav.style.display = 'none'; // Hide the nav when the screen size is below 900px
    }
});