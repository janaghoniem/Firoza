function toggleDropdown(event, dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    var arrow = dropdown.querySelector('.arrow');

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        // Close all dropdowns before opening the current one
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none";
        }
        dropdown.style.display = "block";

        // Position the arrow
        var filterButton = event.currentTarget;
        var buttonRect = filterButton.getBoundingClientRect();
        var dropdownRect = dropdown.getBoundingClientRect();
        
        arrow.style.left = (buttonRect.left + (buttonRect.width / 2) - dropdownRect.left - 5) + 'px'; // Adjust the -10 for arrow width
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    var clickedElement = event.target;
    var dropdowns = document.getElementsByClassName("dropdown-content");

    var isInsideDropdown = false;

    // Check if clicked element is inside any dropdown-content
    for (var i = 0; i < dropdowns.length; i++) {
        if (clickedElement == dropdowns[i] || dropdowns[i].contains(clickedElement)) {
            isInsideDropdown = true;
            break;
        }
    }

    // Close dropdowns if clicked outside and not inside any dropdown
    if (!clickedElement.closest('.filter-buttons') && !isInsideDropdown) {
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none";
        }
    }
}
// function toggleDropdown() {
//     const dropdown = document.getElementById('price-dropdown');
//     dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
// }

// function updatePrice(value) {
//     document.getElementById('priceValue').innerText = `$0 - $${value}`;
// }
