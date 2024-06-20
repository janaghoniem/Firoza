function showPopup(message) {
        const popup = document.getElementById('login-message-popup');
        const popupMessage = popup.querySelector('h2');
        popupMessage.textContent = message;
        
        // Show the popup
        popup.classList.add('show');
        
        // Automatically hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000); // Adjust timing as needed
        }

        function showErrorPopup(message) {
            const popup = document.getElementById('login-message-error-popup');
            const popupMessage = popup.querySelector('h2');
            popupMessage.textContent = message;
            
            // Show the popup
            popup.classList.add('show');
            
            // Automatically hide popup after 3 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000); // Adjust timing as needed
        }
    
        async function addToCart(productId, price) {
            try {
                const response = await fetch('/user/add-to-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, price })
                });

                if (response.ok) {
                    const result = await response.json();
                    showPopup('Product added to cart successfully!');
                } else {
                    showErrorPopup('Failed to add product to cart. Please try again later.');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorPopup('Failed to add product to cart. Please try again later.');
            }
        }

        async function addToWishlist(productId) {
            try {
                const response = await fetch('/user/wishlist/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });
                const data = await response.json();
                if (response.ok) {
                    showPopup('Product added to wishlist successfully!');
                } else {
                    showErrorPopup('Failed to add product to wishlist. Please try again later.');
                }
            } catch (error) {
                console.error('Error adding to wishlist:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            const quizForm = document.getElementById('quiz-form');
            const resultsDiv = document.querySelector('.results');
            const resultsHeader = document.getElementById('results-header');
            const retakeQuizButton = document.getElementById('retake-quiz');
            let selections = {
                egypt: 0,
                india: 0,
                minimalist: 0
            };
        
            const questionSelections = {};
        
            document.querySelectorAll('button.image.main').forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    const category = this.dataset.category;
                    const question = this.dataset.question;
                    const value = this.dataset.value; // Assuming data-value attribute is added to buttons
        
                    document.querySelectorAll(`button[data-question="${question}"]`).forEach(btn => {
                        if (btn !== this) {
                            btn.classList.remove('selected');
                        }
                    });
        
                    if (this.classList.contains('selected')) {
                        this.classList.remove('selected');
                        if (selections[category] !== undefined) {
                            selections[category]--;
                        }
                        delete questionSelections[question];
                    } else {
                        this.classList.add('selected');
                        if (selections[category] !== undefined) {
                            selections[category]++;
                        }
                        questionSelections[question] = { question, category, value }; // Include value in the selection
                    }
                });
            });
        
            quizForm.addEventListener('submit', async (event) => {
                event.preventDefault();
        
                const totalQuestions = 6;
                let allAnswered = true;
                for (let i = 1; i <= totalQuestions; i++) {
                    if (!questionSelections[i]) {
                        allAnswered = false;
                        break;
                    }
                }
        
                if (!allAnswered) {
                    alert("Please answer all questions.");
                    return;
                }
        
                const maxSelection = Math.max(selections.egypt, selections.india, selections.minimalist);
                let resultText = "";
                let resultCategory = "";
        
                if (maxSelection === selections.egypt) {
                    resultText = "You belong to the Egyptian collection!";
                    resultCategory = "egypt";
                } else if (maxSelection === selections.india) {
                    resultText = "You belong to the Indian collection!";
                    resultCategory = "india";
                } else if (maxSelection === selections.minimalist) {
                    resultText = "You belong to the Minimalist collection!";
                    resultCategory = "minimalist";
                } else {
                    resultText = "Please make some selections.";
                }
        
                resultsDiv.innerHTML = `<h3>${resultText}</h3>`;
                resultsHeader.style.display = 'block';
        
                const answers = Object.values(questionSelections);
        
                try {
                    const response = await fetch('/user/submit-quiz', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ answers, result: resultCategory }),
                    });
        
                    const data = await response.json();
                    console.log('Response from server:', data);
        
                    if (response.ok) {
                        alert(data.message);
                        quizForm.style.display = 'none';
                        retakeQuizButton.style.display = 'block';
                        displaySuggestedProducts(data.products);
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error submitting quiz:', error);
                    alert('An error occurred while submitting the quiz.');
                }
            });
        
            retakeQuizButton.addEventListener('click', () => {
                selections = { egypt: 0, india: 0, minimalist: 0 };
                for (const key in questionSelections) {
                    if (questionSelections.hasOwnProperty(key)) {
                        delete questionSelections[key];
                    }
                }
                document.querySelectorAll('button.image.main').forEach(btn => {
                    btn.classList.remove('selected');
                });
                resultsHeader.style.display = 'none';
                quizForm.style.display = 'block';
                retakeQuizButton.style.display = 'none';
            });
        
            function displaySuggestedProducts(products) {
                const suggestedProductsDiv = document.createElement('div');
                suggestedProductsDiv.className = 'suggested-products';
                suggestedProductsDiv.innerHTML = '<h3>Products Suggested for You</h3>';
                
                const carouselDiv = document.createElement('div');
                carouselDiv.className = 'owl-carousel owl-theme';
        
                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'item';
        
                    productItem.innerHTML = `
                        <div class="product-grid">
                            <div class="product-image">
                                <a href="/user/product/${product._id}" class="image" onclick="fetchProductDetails('${product._id}')">
                                    <img class="img-1" src="/images/Indian/Newfolder/${product.img}">
                                </a>
                                <ul class="product-links">
                                    <li><a onclick="addToWishlist('${product._id}')"><i class="fa fa-heart"></i></a></li>
                                    <li><a onclick="addToCart('${product._id}', '${product.price}')"><i class="fa fa-shopping-cart"></i></a></li>
                                </ul>
                            </div>
                            <div class="product-content">
                                <h3 class="title"><a href="#">${product.name}</a></h3>
                                <div class="price">${product.price}</div>
                            </div>
                        </div>
                    `;
                    
                    carouselDiv.appendChild(productItem);
                });
        
                suggestedProductsDiv.appendChild(carouselDiv);
                resultsDiv.appendChild(suggestedProductsDiv);
        
                // Initialize Owl Carousel
                $(carouselDiv).owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 5
                        }
                    }
                });
            }
        });
        