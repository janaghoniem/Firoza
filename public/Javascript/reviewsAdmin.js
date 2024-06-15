function incrementHelpful() {
    const countElement = document.getElementById('helpful-count');
    let count = parseInt(countElement.innerText, 10);
    count += 1;
    countElement.innerText = count;
}
