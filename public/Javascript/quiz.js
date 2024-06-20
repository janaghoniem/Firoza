document.addEventListener("DOMContentLoaded", function () {
    const resultsDiv = document.querySelector('.results');
    const resultsHeader = document.getElementById('results-header');
    const quizForm = document.getElementById('quiz-form');
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
                questionSelections[question] = { question, category };
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
        
        const productsRow = document.createElement('div');
        productsRow.className = 'row';
        
        products.forEach(product => {
            const productCol = document.createElement('div');
            productCol.className = 'col';

            productCol.innerHTML = `
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
            
            productsRow.appendChild(productCol);
        });
        
        suggestedProductsDiv.appendChild(productsRow);
        resultsDiv.appendChild(suggestedProductsDiv);
    }
});
