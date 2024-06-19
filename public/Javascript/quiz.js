document.addEventListener("DOMContentLoaded", function () {
    const resultsDiv = document.querySelector('.results');
    const resultsHeader = document.getElementById('results-header');
    const quizForm = document.getElementById('quiz-form');

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

            // Deselect previously selected button in the same question group
            document.querySelectorAll(`button[data-question="${question}"]`).forEach(btn => {
                if (btn !== this) {
                    btn.classList.remove('selected');
                }
            });

            // Toggle selected class and update selections
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

        // Ensure all questions are answered
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

        // Calculate result
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

        // Prepare answers object
        const answers = Object.values(questionSelections);

        // Send the result and answers to the backend
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
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('An error occurred while submitting the quiz.');
        }
    });
});
