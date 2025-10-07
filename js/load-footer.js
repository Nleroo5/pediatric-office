/**
 * Footer Component Loader
 * Loads shared footer HTML into all pages
 * Usage: Add <div id="footer-placeholder"></div> and <script src="js/load-footer.js"></script>
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }

    function loadFooter() {
        const placeholder = document.getElementById('footer-placeholder');

        if (!placeholder) {
            console.warn('Footer placeholder not found. Add <div id="footer-placeholder"></div> to your page.');
            return;
        }

        // Fetch the footer component
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;

                // Dispatch custom event for any scripts that need to know footer is loaded
                const event = new CustomEvent('footerLoaded');
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error('Error loading footer:', error);

                // Fallback: show basic footer
                placeholder.innerHTML = `
                    <footer class="bg-gray-900 text-white py-8 text-center">
                        <p>&copy; 2025 Village Pediatrics. All rights reserved.</p>
                        <p class="mt-2"><a href="tel:9049401577" class="hover:underline">(904) 940-1577</a></p>
                    </footer>
                `;
            });
    }
})();
