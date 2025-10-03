/**
 * Monkey Animation Controller for New Patientspage
 * Handles page load and scroll-based animations
 */

class MonkeyAnimations {
    constructor() {
        this.monkey = null;
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
        if (this.isInitialized) return; // Prevent double initialization
        this.calculateHeroThreshold();
        this.createMonkeyElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.isInitialized = true;
    }

    createMonkeyElement() {
        // Remove any existing monkey elements first
        const existing = document.querySelectorAll('.monkey-animation');
        existing.forEach(el => el.remove());

        // Create monkey container
        this.monkey = document.createElement('div');
        this.monkey.className = 'monkey-animation';
        this.monkey.innerHTML = `
            <img src="images/animals/monkey.png" alt="Monkey" class="monkey-image">
            <div class="monkey-spotlight"></div>
            <div class="text-bubble">
                <div class="bubble-content">Schedule your visit today!</div>
                <div class="bubble-tail"></div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .monkey-animation {
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

            .monkey-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .monkey-spotlight {
                position: absolute;
                inset: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                filter: blur(4px);
                z-index: -1;
            }

            @keyframes gentleFloat {
                0%, 100% {
                    transform: translateY(-50%) translateY(0px);
                }
                50% {
                    transform: translateY(-50%) translateY(-10px);
                }
            }

            .monkey-visible {
                right: 20px;
                animation: gentleFloat 3.5s ease-in-out infinite;
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
                font-family: 'Inter', sans-serif;
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

            .monkey-animation:hover .text-bubble {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

            /* Mobile Styles */
            @media (max-width: 768px) {
                .monkey-animation {
                    width: 36px;
                    height: 36px;
                    bottom: 16px;
                    right: -200px;
                    top: auto;
                    transform: none;
                }

                .monkey-visible {
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
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.monkey);
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
        }, 500);
    }

    showAnimal() {
        this.monkey.style.opacity = '1';
        this.monkey.style.right = '20px';
        this.monkey.classList.add('monkey-visible');
    }

    hideAnimal() {
        this.monkey.style.opacity = '0';
        this.monkey.style.right = '-250px';
        this.monkey.classList.remove('monkey-visible');
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
    }

    destroy() {
        if (this.monkey) {
            this.monkey.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize monkey animations when script loads
// Only initialize monkey animations on new patients page
if (window.location.pathname.includes('new-patients.html') || document.title.includes('New Patients')) {
    new MonkeyAnimations();
}