 function toggleDropdown(event, dropdownId) {
    var dropdown = document.getElementById(dropdownId);
    var arrow = dropdown.querySelector('.arrow');

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = "none";
        }
        dropdown.style.display = "block";

        var filterButton = event.currentTarget;
        var buttonRect = filterButton.getBoundingClientRect();
        var dropdownRect = dropdown.getBoundingClientRect();
        
        arrow.style.left = (buttonRect.left + (buttonRect.width / 2) - dropdownRect.left - 5) + 'px';
    }
}

window.onclick = function(event) {
    var clickedElement = event.target;
    var dropdowns = document.getElementsByClassName("dropdown-content");

    var isInsideDropdown = false;

    for (var i = 0; i < dropdowns.length; i++) {
        if (clickedElement == dropdowns[i] || dropdowns[i].contains(clickedElement)) {
            isInsideDropdown = true;
            break;
        }
    }

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

    document.querySelectorAll('#category-dropdown input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            filters.categories.push(cb.parentElement.textContent.trim());
        }
    });

    document.querySelectorAll('#color-dropdown input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            filters.colors.push(cb.parentElement.textContent.trim());
        }
    });

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

function applyCategoryFilter(category) {
    const checkboxes = document.querySelectorAll('#category-dropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
    checkboxes.forEach(checkbox => {
        if (checkbox.labels[0].innerText.trim().toLowerCase() === category.toLowerCase()) {
            checkbox.checked = true;
        }
    });
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.headyy a').forEach(link => {
link.addEventListener('click', (event) => {
    event.preventDefault();
    const category = event.target.getAttribute('data-category');
    applyCategoryFilter(category);
    
    // Apply CSS classes to hide relevant elements
    document.querySelector('.headyy').classList.add('category-selected');
    document.querySelector('.haya').classList.add('filter-selected');
    
});
});

document.getElementById('sort').addEventListener('change', applyFilters);
document.getElementById('toggle').addEventListener('change', applyFilters);
fetchDefaultProducts();
});
