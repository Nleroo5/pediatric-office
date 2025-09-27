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
        this.createZebraElement();
        this.bindEvents();
        this.startPageLoadAnimation();
        this.isInitialized = true;
    }

    createZebraElement() {
        // Create zebra container
        this.zebra = document.createElement('div');
        this.zebra.className = 'zebra-animation';
        this.zebra.innerHTML = `
            <img src="images/animals/zebra.png" alt="Zebra" class="zebra-image">
            <div class="zebra-stripes"></div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .zebra-animation {
                position: fixed;
                bottom: 20px;
                right: -200px;
                width: 150px;
                height: 150px;
                z-index: 100;
                pointer-events: none;
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
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
                    width: 100px;
                    height: 100px;
                    bottom: 10px;
                }
                .zebra-visible {
                    right: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.zebra);
    }

    startPageLoadAnimation() {
        // Initial entrance animation
        setTimeout(() => {
            this.zebra.classList.add('zebra-visible');
            this.zebra.classList.add('zebra-walking');

            // Point to services after entrance
            setTimeout(() => {
                this.pointToServices();
            }, 1500);
        }, 500);
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

// Initialize zebra animations when script loads
const zebraAnimations = new ZebraAnimations();