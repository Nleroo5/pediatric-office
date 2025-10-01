/**
 * Elephant Animation Controller for Contact Page
 * Handles page load and scroll-based animations
 */

class ElephantAnimations {
    constructor() {
        this.elephant = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
        this.trunkWaveInterval = null;
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
        this.createElephantElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.startTrunkWaving();
        this.isInitialized = true;
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

    createElephantElement() {
        // Create elephant container
        this.elephant = document.createElement('div');
        this.elephant.className = 'elephant-animation';
        this.elephant.innerHTML = `
            <img src="images/animals/elephant.png" alt="Elephant" class="elephant-image">
            <div class="elephant-trunk"></div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .elephant-animation {
                position: fixed;
                top: 70vh;
                right: -280px;
                width: 280px;
                height: 280px;
                z-index: 100;
                pointer-events: none;
                transform: translateY(-50%);
                opacity: 0;
                transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .elephant-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .elephant-trunk {
                position: absolute;
                top: 40%;
                left: 10%;
                width: 30px;
                height: 60px;
                background: linear-gradient(180deg, #8B4513, #A0522D);
                border-radius: 15px 15px 8px 8px;
                z-index: 3;
                transform-origin: top center;
                animation: trunkWave 4s ease-in-out infinite;
            }

            @keyframes trunkWave {
                0%, 100% { transform: rotateZ(0deg) rotateX(0deg); }
                25% { transform: rotateZ(-10deg) rotateX(5deg); }
                75% { transform: rotateZ(10deg) rotateX(-5deg); }
            }

            @keyframes elephantWalk {
                0%, 100% { transform: translateX(0) rotateZ(0deg); }
                50% { transform: translateX(8px) rotateZ(1deg); }
            }

            @keyframes elephantTrumpet {
                0%, 100% { transform: scale(1) rotateZ(0deg); }
                25% { transform: scale(1.05) rotateZ(-2deg); }
                75% { transform: scale(1.05) rotateZ(2deg); }
            }

            @keyframes elephantBow {
                0%, 100% { transform: rotateX(0deg) scale(1); }
                50% { transform: rotateX(10deg) scale(0.95); }
            }

            .elephant-walking {
                animation: elephantWalk 3s ease-in-out infinite;
            }

            .elephant-trumpeting {
                animation: elephantTrumpet 2s ease-in-out;
            }

            .elephant-bowing {
                animation: elephantBow 1.8s ease-in-out;
            }

            .elephant-visible {
                right: 20px;
                opacity: 1;
            }

            @media (max-width: 768px) {
                .elephant-animation {
                    width: 140px;
                    height: 140px;
                    top: 70vh;
                }
                .elephant-visible {
                    right: 10px;
                }
                .elephant-trunk {
                    width: 15px;
                    height: 30px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.elephant);
    }

    startPageLoadAnimation() {
        // Only start animation if we've passed the hero section
        if (!this.hasPassedHero) return;

        // Stomp into view animation
        setTimeout(() => {
            this.showAnimal();

            // Trumpet greeting after entrance
            setTimeout(() => {
                this.trumpetGreeting();
            }, 2500);
        }, 700);
    }

    showAnimal() {
        this.elephant.style.opacity = '1';
        this.elephant.style.right = '20px';
        this.elephant.classList.add('elephant-visible');
        this.elephant.classList.add('elephant-walking');
    }

    hideAnimal() {
        this.elephant.style.opacity = '0';
        this.elephant.style.right = '-280px';
        this.elephant.classList.remove('elephant-visible', 'elephant-walking', 'elephant-trumpeting', 'elephant-bowing');
    }

    startTrunkWaving() {
        // Trunk waving is handled by CSS animation
        // This method can be extended for more complex trunk animations
    }

    trumpetGreeting() {
        this.elephant.classList.remove('elephant-walking');
        this.elephant.classList.add('elephant-trumpeting');

        setTimeout(() => {
            this.elephant.classList.remove('elephant-trumpeting');
            this.elephant.classList.add('elephant-walking');
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

        // Contact form interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('form, .form-group, input, select, textarea')) {
                this.reactToFormInteraction();
            }
        });

        // Contact info hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.contact-info, [class*="contact"], .location, .phone')) {
                this.trumpetGreeting();
            }
        });

        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('button, .btn, [type="submit"]')) {
                this.reactToButtonClick();
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

        // Keep elephant in bottom right, just change animations based on scroll
        if (scrollPercent >= 0.9) {
            this.elephant.classList.remove('elephant-walking');
            this.elephant.classList.add('elephant-bowing');
        } else {
            this.elephant.classList.remove('elephant-bowing');
            this.elephant.classList.add('elephant-walking');
        }
    }

    reactToFormInteraction() {
        if (!this.elephant.classList.contains('elephant-trumpeting')) {
            this.elephant.classList.remove('elephant-walking', 'elephant-bowing');
            this.elephant.classList.add('elephant-trumpeting');

            setTimeout(() => {
                this.elephant.classList.remove('elephant-trumpeting');
                this.elephant.classList.add('elephant-walking');
            }, 2000);
        }
    }

    reactToButtonClick() {
        // Excited trumpeting for button clicks
        this.elephant.classList.remove('elephant-walking', 'elephant-bowing');
        this.elephant.classList.add('elephant-trumpeting');

        setTimeout(() => {
            this.elephant.classList.remove('elephant-trumpeting');
            this.elephant.classList.add('elephant-walking');
        }, 2500);
    }

    destroy() {
        if (this.elephant) {
            this.elephant.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.trunkWaveInterval) {
            clearInterval(this.trunkWaveInterval);
        }
    }
}

// Initialize elephant animations when script loads
// Only initialize elephant animations on contact page
if (window.location.pathname.includes('contact.html') || document.title.includes('Contact')) {
    new ElephantAnimations();
}