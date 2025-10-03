/**
 * Lion Animation Controller for About Page
 * Handles page load and scroll-based animations
 */

class LionAnimations {
    constructor() {
        this.lion = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
        this.maneAnimationInterval = null;
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
        this.createLionElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.startManeAnimation();
        this.isInitialized = true;
    }

    createLionElement() {
        // Create lion container
        this.lion = document.createElement('div');
        this.lion.className = 'lion-animation';
        this.lion.innerHTML = `
            <img src="images/animals/lion.png" alt="Lion" class="lion-image">
            <div class="lion-spotlight"></div>
            <div class="text-bubble">
                <div class="bubble-content">Schedule your visit today!</div>
                <div class="bubble-tail"></div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .lion-animation {
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

            .lion-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .lion-spotlight {
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

            .lion-visible {
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

            .lion-animation:hover .text-bubble {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

            @media (max-width: 768px) {
                .lion-animation {
                    width: 36px;
                    height: 36px;
                    bottom: 16px;
                    right: -200px;
                    top: auto;
                    transform: none;
                }
                .lion-visible {
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
        document.body.appendChild(this.lion);
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
        this.lion.style.opacity = '1';
        this.lion.style.right = '20px';
        this.lion.classList.add('lion-visible');
    }

    hideAnimal() {
        this.lion.style.opacity = '0';
        this.lion.style.right = '-250px';
        this.lion.classList.remove('lion-visible');
    }

    startManeAnimation() {
        // No animation
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
        if (this.lion) {
            this.lion.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.maneAnimationInterval) {
            clearInterval(this.maneAnimationInterval);
        }
    }
}

// Initialize lion animations when script loads
// Only initialize lion animations on about page
if (window.location.pathname.includes('about.html') || document.title.includes('About')) {
    new LionAnimations();
}