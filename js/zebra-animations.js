/**
 * Zebra Animation Controller for Servicespage
 * Handles page load and scroll-based animations
 */

class ZebraAnimations {
    constructor() {
        this.zebra = null;
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
        this.createZebraElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.isInitialized = true;
    }

    createZebraElement() {
        // Create zebra container
        this.zebra = document.createElement('div');
        this.zebra.className = 'zebra-animation';
        this.zebra.innerHTML = `
            <img src="images/animals/zebra.png" alt="Zebra" class="zebra-image">
            <div class="zebra-spotlight"></div>
            <a href="contact.html" class="text-bubble">
                <div class="bubble-content">Schedule your visit today!</div>
                <div class="bubble-tail"></div>
            </a>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .zebra-animation {
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

            .zebra-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .zebra-spotlight {
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

            .zebra-visible {
                right: 20px;
                animation: gentleFloat 3.5s ease-in-out infinite;
            }

            @media (max-width: 768px) {
                .zebra-animation {
                    width: 75px;
                    height: 75px;
                    bottom: 16px;
                    right: -200px;
                    top: auto;
                    transform: none;
                }
                .zebra-visible {
                    right: 16px;
                }
                .text-bubble {
                    top: -40px !important;
                    left: -50px !important;
                    min-width: 32px !important;
                    max-width: 100px !important;
                    padding: 6px 10px !important;
                }
                .bubble-content {
                    font-size: 9px !important;
                    line-height: 1.2 !important;
                    white-space: normal !important;
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
                text-decoration: none;
                display: block;
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

            /* Desktop only - show on hover and keep visible */
            @media (min-width: 769px) {
                .zebra-animation:hover .text-bubble {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                    pointer-events: auto;
                }

                .text-bubble.bubble-shown {
                    opacity: 1 !important;
                    transform: scale(1) translateY(0) !important;
                    pointer-events: auto !important;
                }

                .text-bubble.bubble-shown:hover {
                    background: #FFF8E1;
                    border-color: #F2B138;
                    transform: scale(1.05) translateY(-2px) !important;
                }
            }

            /* Mobile - keep original behavior (no persistent bubble) */
            @media (max-width: 768px) {
                .zebra-animation:hover .text-bubble {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.zebra);
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
        this.zebra.style.opacity = '1';
        this.zebra.style.right = '20px';
        this.zebra.classList.add('zebra-visible');
    }

    hideAnimal() {
        this.zebra.style.opacity = '0';
        this.zebra.style.right = '-250px';
        this.zebra.classList.remove('zebra-visible');
    }

    bindEvents() {
        let ticking = false;
        let bubbleActivated = false;

        // Desktop only - make bubble persist on first hover
        if (window.innerWidth >= 769) {
            this.zebra.addEventListener('mouseenter', () => {
                if (!bubbleActivated) {
                    const bubble = this.zebra.querySelector('.text-bubble');
                    if (bubble) {
                        bubble.classList.add('bubble-shown');
                        bubbleActivated = true;
                    }
                }
            });
        }

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
        if (this.zebra) {
            this.zebra.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize zebra animations when script loads
// Only initialize zebra animations on services page
if (window.location.pathname.includes('services.html') || document.title.includes('Services')) {
    new ZebraAnimations();
}