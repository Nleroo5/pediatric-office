/**
 * Elephant Animation Controller for Homepage
 * Handles page load and scroll-based animations
 */

class ElephantAnimations {
    constructor() {
        this.elephant = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
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
        this.isInitialized = true;
    }

    createElephantElement() {
        // Create elephant container
        this.elephant = document.createElement('div');
        this.elephant.className = 'elephant-animation';
        this.elephant.innerHTML = `
            <img src="images/animals/elephant.png" alt="Elephant" class="elephant-image">
            <div class="text-bubble">
                <div class="bubble-content">Schedule your visit today!</div>
                <div class="bubble-tail"></div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .elephant-animation {
                position: fixed;
                top: 70vh;
                right: -250px;
                width: 220px;
                height: 220px;
                z-index: 100;
                pointer-events: auto;
                transform: translateY(-50%);
                opacity: 0;
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .elephant-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            @keyframes elephantWalk {
                0%, 100% { transform: translateY(0) rotateZ(0deg); }
                25% { transform: translateY(-5px) rotateZ(1deg); }
                75% { transform: translateY(-3px) rotateZ(-1deg); }
            }

            @keyframes elephantTrumpet {
                0%, 100% { transform: scale(1) rotateZ(0deg); }
                50% { transform: scale(1.05) rotateZ(3deg); }
            }

            .elephant-walking {
                animation: elephantWalk 3s ease-in-out infinite;
            }

            .elephant-trumpeting {
                animation: elephantTrumpet 1.5s ease-in-out;
            }

            .elephant-visible {
                right: 20px;
            }

            @media (max-width: 768px) {
                .elephant-animation {
                    width: 36px;
                    height: 36px;
                    bottom: 16px;
                    right: -200px;
                    top: auto;
                    transform: none;
                }
                .elephant-visible {
                    right: 16px;
                }
                .text-bubble {
                    top: -50px;
                    left: -80px;
                    min-width: 120px;
                }
                .bubble-content {
                    font-size: 11px;
                }
            }

            /* Text Bubble Styles */
            .text-bubble {
                position: absolute;
                top: -80px;
                left: -120px;
                background: #ffffff;
                border: 3px solid #F2B138;
                border-radius: 20px;
                padding: 12px 16px;
                opacity: 0;
                transform: scale(0.5) translateY(20px);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                min-width: 180px;
            }

            .bubble-content {
                font-family: 'Fredoka', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #0D2673;
                text-align: center;
                line-height: 1.3;
                white-space: nowrap;
            }

            .bubble-tail {
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 15px solid transparent;
                border-right: 15px solid transparent;
                border-top: 15px solid #F2B138;
            }

            .bubble-tail::after {
                content: '';
                position: absolute;
                top: -18px;
                left: -12px;
                width: 0;
                height: 0;
                border-left: 12px solid transparent;
                border-right: 12px solid transparent;
                border-top: 12px solid #ffffff;
            }

            .elephant-animation:hover .text-bubble {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.elephant);
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

        // Simple entrance - just appear
        setTimeout(() => {
            this.showAnimal();

            // Show trumpet animation after entrance
            setTimeout(() => {
                this.showTrumpet();
            }, 2000);
        }, 500);
    }

    showAnimal() {
        this.elephant.style.opacity = '1';
        this.elephant.style.right = '20px';
        this.elephant.classList.add('elephant-visible');
        this.elephant.classList.add('elephant-walking');
    }

    hideAnimal() {
        this.elephant.style.opacity = '0';
        this.elephant.style.right = '-250px';
        this.elephant.classList.remove('elephant-visible', 'elephant-walking', 'elephant-trumpeting');
    }

    showTrumpet() {
        this.elephant.classList.remove('elephant-walking');
        this.elephant.classList.add('elephant-trumpeting');

        setTimeout(() => {
            this.elephant.classList.remove('elephant-trumpeting');
            this.elephant.classList.add('elephant-walking');
        }, 2000);
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

        // Homepage content hover interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.hero-content, .main-content, [class*="home"]')) {
                this.reactToContentHover();
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

        // Keep elephant in position, just change animations based on scroll
        if (scrollPercent >= 0.9) {
            this.elephant.classList.remove('elephant-walking');
            this.showTrumpet();
        } else {
            this.elephant.classList.add('elephant-walking');
        }
    }

    reactToContentHover() {
        if (!this.elephant.classList.contains('elephant-trumpeting')) {
            this.elephant.classList.remove('elephant-walking');
            this.elephant.classList.add('elephant-trumpeting');

            setTimeout(() => {
                this.elephant.classList.remove('elephant-trumpeting');
                this.elephant.classList.add('elephant-walking');
            }, 1500);
        }
    }

    destroy() {
        if (this.elephant) {
            this.elephant.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize elephant animations when script loads
// Only initialize elephant animations on homepage
if (window.location.pathname.includes('index.html') || document.title.includes('Home') || window.location.pathname === '/') {
    new ElephantAnimations();
}