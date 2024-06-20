function openItem(productId) {
    fetch(`/user/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Construct the product details HTML dynamically
            const productDetailsHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="/CSS/nav-bar-white.css">
                    <link rel="stylesheet" href="/CSS/Footer.css">
                    <link rel="stylesheet" href="/CSS/navBar.css">
                    <link rel="stylesheet" href="/CSS/productCardDetails.css">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
                    
                    <title>${product.name}</title>
                </head>
                <body>
                    <%- include('./partials/Nav-Bar.ejs') %>
                    <div class="whole-prod-page">
                        <!-- Populate the product details dynamically using JavaScript -->
                        <div class="upper-half-prod">
                            <div class="prod-pic">
                                <img src="../images/middleEastimages/${product.img}" alt="Product Image">
                            </div>
                            <div class="price-rating">
                                <h2>${product.name}</h2>
                                <br>
                                <p>${product.price}</p>
                                <br><br>
                                <!-- Other product details -->
                            </div>
                            <!-- More product details -->
                        </div>
                        <!-- Reviews section and other content -->
                    </div>
                    <script src="../Javascript/productCardDetails.js"></script>
                    <script src="../Javascript/landing-script.js"></script>
                    <%- include('./partials/footer.ejs') %>
                </body>
                </html>
            `;

            // Create a Blob object with the HTML content
            const blob = new Blob([productDetailsHTML], { type: 'text/html' });
            // Create a URL for the Blob object
            const url = URL.createObjectURL(blob);
            // Redirect to the dynamically generated product details page
            window.location.href = url;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}