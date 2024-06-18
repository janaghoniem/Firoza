document.addEventListener("DOMContentLoaded", function () {
    var zindex = 10;
    var cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
        card.addEventListener("click", function (e) {
            e.preventDefault();
            const productId = card.getAttribute('data-id');
            if (e.target.classList.contains("btn") && e.target.textContent === "Edit") {
                window.location.href = `/admin/EditProduct/${productId}`;
                return;
            }
            if (e.target.classList.contains("btn") && e.target.textContent === "Add") {
                window.location.href = "/admin/addProduct";
                return;
            }
            var isShowing = this.classList.contains("show");

            var showingCards = document.querySelectorAll(".cards.showing .card.show");
            showingCards.forEach(function (showingCard) {
                showingCard.classList.remove("show");
            });

            if (document.querySelector(".cards").classList.contains("showing")) {
                document.querySelector(".cards").classList.remove("showing");

                if (!isShowing) {
                    this.style.zIndex = zindex;
                    this.classList.add("show");
                }
            } else {
                document.querySelector(".cards").classList.add("showing");
                this.style.zIndex = zindex;
                this.classList.add("show");
            }

            zindex++;
        });
    });
});




function toggleMenu(){
    var nav= document.querySelector('.navigation');
    nav.style.display=nav.style.display==='block'? 'none' :'block';
}