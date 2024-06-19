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
            alert('Product added to cart successfully!');
        } else {
            alert('Failed to add product to cart');
        }

    } catch (error) {
        alert('Error:', error);
        alert('Failed to add product to cart');
    }
}


function gatherFilters() {
    const filters = {
        categories: [],
        colors: [],
        priceRange: document.getElementById('priceRange').value,
        materials: [],
        sortBy: document.getElementById('sort').value,
        hideSoldOut: document.getElementById('toggle').checked
    };

    // Gather category filters
    document.querySelectorAll('#category-dropdown input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            filters.categories.push(cb.parentElement.textContent.trim());
        }
    });

    // Gather color filters
    document.querySelectorAll('#color-dropdown input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            filters.colors.push(cb.parentElement.textContent.trim());
        }
    });

    // Gather material filters
    document.querySelectorAll('#material-dropdown input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            filters.materials.push(cb.parentElement.textContent.trim());
        }
    });

    return filters;
}

function checkIfFiltersApplied(filters) {
    const isApplied = filters.categories.length > 0 || filters.colors.length > 0 || filters.materials.length > 0 || filters.priceRange != document.getElementById('priceRange').max || filters.hideSoldOut;
    const clearBtn = document.getElementById('clear-filters-btn');
    clearBtn.style.display = isApplied ? 'block' : 'none';
}

async function applyFilters() {
    const filters = gatherFilters();
    checkIfFiltersApplied(filters);

    try {
        const response = await fetch('/user/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (response.ok) {
            const products = await response.json();
            updateProductList(products);
        } else {
            alert('Failed to apply filters');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error:', error);
    }
}

async function fetchDefaultProducts() {
    try {
        const filters = {
            sortBy: document.getElementById('sort').value,
            hideSoldOut: document.getElementById('toggle').checked
        };
        const response = await fetch('/user/filter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });

        if (response.ok) {
            const products = await response.json();
            updateProductList(products);
        } else {
            alert('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error:', error);
    }
}

function clearFilters() {
    document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceRange').value = document.getElementById('priceRange').max;
    updatePrice(document.getElementById('priceRange').value);
    document.getElementById('clear-filters-btn').style.display = 'none';
    document.getElementById('sort').value = '';
    document.getElementById('toggle').checked = false;
    fetchDefaultProducts();
}

function updatePrice(value) {
    document.getElementById('priceValue').textContent = `$0 - $${value}`;
}

function updateProductList(products) {
    const productContainer = document.querySelector('.row');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const soldOutLabel = product.isSoldOut ? '<span class="sold-out-label">Sold Out</span>' : '';
        const productHtml = `
            <div class="col">
                <div class="product-grid">
                    <div class="product-image">
                        <a href="#" class="image">
                            <img class="img-1" src="/images/Indian/Newfolder/${product.img}">
                            ${soldOutLabel}
                        </a>
                        <ul class="product-links">
                            <li><a href="#"><i class="fa fa-heart"></i></a></li>
                            <li><a href="#" onclick="addToCart('${product._id}', '${product.price}')" class="add-to-cart-btn"><i class="fa fa-shopping-cart"></i></a></li>
                        </ul>
                    </div>
                    <div class="product-content">
                        <h3 class="title"><a href="#">${product.name}</a></h3>
                        <div class="price">${product.price}</div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productHtml;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sort').addEventListener('change', applyFilters);
    document.getElementById('toggle').addEventListener('change', applyFilters);
    fetchDefaultProducts();
});
