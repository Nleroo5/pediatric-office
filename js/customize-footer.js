/**
 * Footer Customization Script
 * Customizes footer display for all pages to match homepage design
 */

function customizeFooter() {
    console.log('Customizing footer...');

    // Find the Privia partnership section in the footer
    const priviaSection = document.querySelector('.footer-privia-section');
    console.log('Found Privia section:', priviaSection);

    if (priviaSection) {
        // Check if already customized (prevent duplicate additions)
        if (priviaSection.querySelector('.homepage-mobile-grid')) {
            console.log('Already customized, skipping...');
            return;
        }

        // Keep Privia section visible on all screen sizes
        priviaSection.style.display = 'block';
        console.log('Footer Privia section is visible');

        // MOBILE: Hide the default Privia image and text, add custom grid
        if (window.innerWidth < 1024) {
            const priviaContent = priviaSection.querySelector('.flex.flex-col');
            if (priviaContent) {
                priviaContent.style.display = 'none';
                console.log('Mobile: hiding default Privia content (image and text)');
            }

            // MOBILE: Add 2x2 grid (badges + portal buttons) to Privia section
            const mobileGrid = document.createElement('div');
            mobileGrid.className = 'homepage-mobile-grid lg:hidden';
            mobileGrid.innerHTML = `
                <h4 class="text-center text-white font-semibold text-base mb-4">myPrivia Portal & App</h4>

                <!-- 2x2 Grid Layout -->
                <div class="space-y-3">
                    <!-- Row 1: App Badges -->
                    <div class="grid grid-cols-2 gap-3">
                        <div class="flex justify-center items-center">
                            <a href="https://apps.apple.com/us/app/myprivia/id1364708257" target="_blank" rel="noopener noreferrer" class="transition-transform duration-300 active:scale-95">
                                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1594857600" alt="Download on the App Store" style="width: 120px; height: auto;">
                            </a>
                        </div>
                        <div class="flex justify-center items-center">
                            <a href="https://play.google.com/store/apps/details?id=com.priviamedicalgroup.priviaapp&hl=en_US" target="_blank" rel="noopener noreferrer" class="transition-transform duration-300 active:scale-95">
                                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" style="width: 135px; height: auto;">
                            </a>
                        </div>
                    </div>

                    <!-- Row 2: Portal Buttons -->
                    <div class="grid grid-cols-2 gap-3">
                        <a href="https://www.myprivia.com/account-access" target="_blank" rel="noopener noreferrer" class="bg-orange text-white font-semibold text-sm px-4 py-3 rounded-lg shadow-lg text-center transition-transform duration-300 active:scale-95">
                            Login to Portal
                        </a>
                        <a href="https://www.myprivia.com/account-access" target="_blank" rel="noopener noreferrer" class="bg-orange text-white font-semibold text-sm px-4 py-3 rounded-lg shadow-lg text-center transition-transform duration-300 active:scale-95">
                            Register for Portal
                        </a>
                    </div>
                </div>
            `;

            // Append to the Privia section
            priviaSection.appendChild(mobileGrid);
            console.log('Mobile: Added 2x2 grid to footer');
        }
    } else {
        console.warn('Privia section not found in footer');
    }
}

// Listen for footerLoaded event
document.addEventListener('footerLoaded', customizeFooter);

// Fallback: try multiple times with increasing delays to ensure footer is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(customizeFooter, 200);
        setTimeout(customizeFooter, 500);
    });
} else {
    setTimeout(customizeFooter, 200);
    setTimeout(customizeFooter, 500);
}
