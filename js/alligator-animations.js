/**
 * Alligator Animation Controller for New Patients Page
 * Handles page load and scroll-based animations
 */

class AlligatorAnimations {
    constructor() {
        this.alligator = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
        this.tailWagInterval = null;
        this.hasPassedHero = false;
        this.heroScrollThreshold = 0;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.calculateHeroThreshold();
        this.createAlligatorElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.startTailWagging();
        this.isInitialized = true;
    }

    createAlligatorElement() {
        // Create alligator container
        this.alligator = document.createElement('div');
        this.alligator.className = 'alligator-animation';
        this.alligator.innerHTML = `
            <img src="images/animals/alligator.png" alt="Alligator" class="alligator-image">
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .alligator-animation {
                position: fixed;
                top: 70vh;
                right: -250px;
                width: 240px;
                height: 240px;
                z-index: 100;
                pointer-events: none;
                transform: translateY(-50%);
                opacity: 0;
                transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .alligator-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }







            @keyframes alligatorSwim {
                0%, 100% { transform: translateX(0) rotateZ(0deg); }
                50% { transform: translateX(10px) rotateZ(1deg); }
            }

            @keyframes alligatorSnap {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.9); }
            }

            @keyframes alligatorWelcome {
                0%, 100% { transform: scale(1) rotateZ(0deg); }
                25% { transform: scale(1.05) rotateZ(-2deg); }
                75% { transform: scale(1.05) rotateZ(2deg); }
            }

            .alligator-swimming {
                animation: alligatorSwim 4s ease-in-out infinite;
            }

            .alligator-snapping {
                animation: alligatorSnap 0.8s ease-in-out;
            }

            .alligator-welcoming {
                animation: alligatorWelcome 2s ease-in-out;
            }

            .alligator-visible {
                right: 20px;
            }

            .alligator-center {
                left: 50%;
                transform: translateX(-50%);
            }

            @media (max-width: 768px) {
                .alligator-animation {
                    width: 120px;
                    height: 120px;
                    top: 70vh;
                }
                .alligator-visible {
                    right: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.alligator);
    }

    calculateHeroThreshold() {
        // Calculate when hero section ends
        const heroElement = document.querySelector('section[class*="hero"]');
        if (heroElement) {
            this.heroScrollThreshold = heroElement.offsetHeight * 0.8;
        } else {
            this.heroScrollThreshold = window.innerHeight * 0.8;
        }
    }

    checkInitialScroll() {
        // Check if user has already scrolled past hero on page load
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > this.heroScrollThreshold) {
            this.hasPassedHero = true;
            this.startPageLoadAnimation();
        }
    }

    startPageLoadAnimation() {
        // Only start animation if we've passed the hero section
        if (!this.hasPassedHero) return;

        // Swim up from bottom animation
        setTimeout(() => {
            this.showAnimal();

            // Welcome gesture after surfacing
            setTimeout(() => {
                this.welcomeNewPatients();
            }, 2000);
        }, 600);
    }

    showAnimal() {
        this.alligator.style.opacity = '1';
        this.alligator.style.right = '20px';
        this.alligator.classList.add('alligator-visible');
        this.alligator.classList.add('alligator-swimming');
    }

    hideAnimal() {
        this.alligator.style.opacity = '0';
        this.alligator.style.right = '-250px';
        this.alligator.classList.remove('alligator-visible', 'alligator-swimming', 'alligator-welcoming', 'alligator-snapping');
    }

    startTailWagging() {
        // Tail wagging is handled by CSS animation
        // This method can be extended for more complex tail animations
    }

    welcomeNewPatients() {
        this.alligator.classList.remove('alligator-swimming');
        this.alligator.classList.add('alligator-welcoming');

        setTimeout(() => {
            this.alligator.classList.remove('alligator-welcoming');
            this.alligator.classList.add('alligator-swimming');
        }, 2500);
    }

    bindEvents() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Form interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('form, .form-group, input, select, textarea')) {
                this.reactToFormInteraction();
            }
        });

        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .btn, [type="submit"]')) {
                this.reactToButtonClick();
            }
        });

        // New patient info hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.new-patient, [class*="patient"], .welcome')) {
                this.welcomeNewPatients();
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Check if we're back in hero section and hide animal
        if (scrollTop <= this.heroScrollThreshold) {
            if (this.hasPassedHero) {
                this.hideAnimal();
            }
            return;
        }

        // Check if we've passed the hero section (first time or returning)
        if (scrollTop > this.heroScrollThreshold) {
            if (!this.hasPassedHero) {
                this.hasPassedHero = true;
                this.startPageLoadAnimation();
                return;
            } else {
                // Already been past hero, just show the animal again
                this.showAnimal();
            }
        }

        const scrollPercent = scrollTop / (document.documentElement.scrollHeight - window.innerHeight);

        // Move alligator based on scroll (similar to zebra behavior)
        if (scrollPercent > 0.2 && scrollPercent < 0.8) {
            this.alligator.style.right = `${20 + (scrollPercent * 30)}px`;
            this.alligator.classList.add('alligator-swimming');
        } else if (scrollPercent >= 0.8) {
            this.alligator.classList.remove('alligator-swimming');
            this.alligator.classList.add('alligator-welcoming');
        } else {
            this.alligator.style.right = '20px';
            this.alligator.classList.add('alligator-swimming');
            this.alligator.classList.remove('alligator-welcoming');
        }
    }

    reactToFormInteraction() {
        if (!this.alligator.classList.contains('alligator-snapping')) {
            this.alligator.classList.remove('alligator-swimming', 'alligator-welcoming');
            this.alligator.classList.add('alligator-snapping');


            setTimeout(() => {
                this.alligator.classList.remove('alligator-snapping');
                this.alligator.classList.add('alligator-swimming');
            }, 1000);
        }
    }

    reactToButtonClick() {
        // Excited tail wagging for button clicks
        this.alligator.style.animation = 'alligatorWelcome 1s ease-in-out';

        setTimeout(() => {
            this.alligator.style.animation = '';
            this.alligator.classList.add('alligator-swimming');
        }, 1000);
    }


    destroy() {
        if (this.alligator) {
            this.alligator.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.tailWagInterval) {
            clearInterval(this.tailWagInterval);
        }
    }
}

// Initialize alligator animations when script loads
// Only initialize alligator animations on team page
if (window.location.pathname.includes('team.html') || document.title.includes('Team')) {
    new AlligatorAnimations();
}