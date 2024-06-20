//description dropdown

document.addEventListener("DOMContentLoaded",function(){
    var headers= document.querySelectorAll('.description-part');
    headers.forEach(function(header){

        header.addEventListener('click', function(){
            var content = this.nextElementSibling;
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';

            var icon = this.querySelector('i');
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
        });
    });
});

//added to cart popup
function addToCart(){
    var popup = document.createElement("div");
    popup.classList.add("popupMessage");
    popup.textContent= "Added to cart";
    document.body.appendChild(popup);

   

    setTimeout(function(){
        popup.style.display="block";
    },100);

    setTimeout(function(){
        popup.style.display="none";
        popup.parentNode.removeChild(popup);
    },2000);

   
}

function addToWishlist(){
    var popup = document.createElement("div");
    popup.classList.add("popupMessage");
    popup.textContent= "Added to wishlist";
    document.body.appendChild(popup);

   
    setTimeout(function(){
        popup.style.display="block";
    },100);

    setTimeout(function(){
        popup.style.display="none";
        popup.parentNode.removeChild(popup);
    },2000);

   
}
