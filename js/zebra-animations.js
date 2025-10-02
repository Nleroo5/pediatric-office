/**
 * Zebra Animation Controller for Services Page
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
            <div class="zebra-stripes"></div>
            <div class="text-bubble">
                <div class="bubble-content">Schedule your visit today!</div>
                <div class="bubble-tail"></div>
            </div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .zebra-animation {
                position: fixed;
                top: 70vh;
                right: -250px;
                width: 240px;
                height: 240px;
                z-index: 100;
                pointer-events: auto;
                transform: translateY(-50%);
                opacity: 0;
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .zebra-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
            }

            .zebra-stripes {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 8px,
                    rgba(59, 157, 132, 0.1) 8px,
                    rgba(59, 157, 132, 0.1) 16px
                );
                opacity: 0;
                animation: stripeShimmer 3s ease-in-out infinite;
            }

            @keyframes stripeShimmer {
                0%, 100% { opacity: 0; transform: translateX(0); }
                50% { opacity: 0.3; transform: translateX(10px); }
            }

            @keyframes zebraWalk {
                0%, 100% { transform: translateY(0) rotateZ(0deg); }
                25% { transform: translateY(-5px) rotateZ(1deg); }
                75% { transform: translateY(-3px) rotateZ(-1deg); }
            }

            @keyframes zebraPoint {
                0%, 100% { transform: rotateZ(0deg) scale(1); }
                50% { transform: rotateZ(-10deg) scale(1.05); }
            }

            .zebra-walking {
                animation: zebraWalk 2s ease-in-out infinite;
            }

            .zebra-pointing {
                animation: zebraPoint 1.5s ease-in-out;
            }

            .zebra-visible {
                right: 20px;
            }

            .zebra-center {
                right: 50%;
                transform: translateX(50%);
            }

            @media (max-width: 768px) {
                .zebra-animation {
                    width: 120px;
                    height: 120px;
                    top: 70vh;
                }
                .zebra-visible {
                    right: 5px;
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

            @media (max-width: 480px) {
                .zebra-animation {
                    width: 180px;
                    height: 180px;
                    top: 65vh;
                    right: -220px;
                }
                .zebra-visible {
                    right: 2px;
                }
                .text-bubble {
                    top: -45px;
                    left: -70px;
                    min-width: 100px;
                    padding: 8px 12px;
                }
                .bubble-content {
                    font-size: 10px;
                }
            }

            @media (max-width: 320px) {
                .zebra-animation {
                    width: 140px;
                    height: 140px;
                    top: 60vh;
                    right: -180px;
                }
                .zebra-visible {
                    right: 1px;
                }
                .text-bubble {
                    top: -40px;
                    left: -60px;
                    min-width: 90px;
                    padding: 6px 10px;
                }
                .bubble-content {
                    font-size: 9px;
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

            .zebra-animation:hover .text-bubble {
                opacity: 1;
                transform: scale(1) translateY(0);
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

        // Initial entrance animation
        setTimeout(() => {
            this.showAnimal();

            // Point to services after entrance
            setTimeout(() => {
                this.pointToServices();
            }, 1500);
        }, 500);
    }

    showAnimal() {
        this.zebra.style.opacity = '1';
        this.zebra.style.right = '20px';
        this.zebra.classList.add('zebra-visible');
        this.zebra.classList.add('zebra-walking');
    }

    hideAnimal() {
        this.zebra.style.opacity = '0';
        this.zebra.style.right = '-250px';
        this.zebra.classList.remove('zebra-visible', 'zebra-walking', 'zebra-pointing');
    }

    pointToServices() {
        const serviceCards = document.querySelectorAll('.service-card, .card, [class*="service"]');
        if (serviceCards.length > 0) {
            this.zebra.classList.remove('zebra-walking');
            this.zebra.classList.add('zebra-pointing');

            setTimeout(() => {
                this.zebra.classList.remove('zebra-pointing');
                this.zebra.classList.add('zebra-walking');
            }, 2000);
        }
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

        // Service card hover interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.service-card, .card, [class*="service"]')) {
                this.reactToServiceHover();
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

        // Move zebra based on scroll
        if (scrollPercent > 0.2 && scrollPercent < 0.8) {
            this.zebra.style.right = `${20 + (scrollPercent * 30)}px`;
            this.zebra.classList.add('zebra-walking');
        } else if (scrollPercent >= 0.8) {
            this.zebra.classList.remove('zebra-walking');
            this.zebra.classList.add('zebra-pointing');
        } else {
            this.zebra.style.right = '20px';
            this.zebra.classList.add('zebra-walking');
            this.zebra.classList.remove('zebra-pointing');
        }
    }

    reactToServiceHover() {
        if (!this.zebra.classList.contains('zebra-pointing')) {
            this.zebra.classList.remove('zebra-walking');
            this.zebra.classList.add('zebra-pointing');

            setTimeout(() => {
                this.zebra.classList.remove('zebra-pointing');
                this.zebra.classList.add('zebra-walking');
            }, 1500);
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

// Only initialize zebra animations on services page
if (window.location.pathname.includes('services.html') || document.title.includes('Services')) {
    new ZebraAnimations();
}