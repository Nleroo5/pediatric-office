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
        this.createLionElement();
        this.bindEvents();
        this.startPageLoadAnimation();
        this.startManeAnimation();
        this.isInitialized = true;
    }

    createLionElement() {
        // Create lion container
        this.lion = document.createElement('div');
        this.lion.className = 'lion-animation';
        this.lion.innerHTML = `
            <div class="lion-mane"></div>
            <img src="images/animals/lion.png" alt="Lion" class="lion-image">
            <div class="lion-crown"></div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .lion-animation {
                position: fixed;
                top: 20px;
                left: -200px;
                width: 180px;
                height: 180px;
                z-index: 100;
                pointer-events: none;
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

            .lion-mane {
                position: absolute;
                top: -10px;
                left: -10px;
                width: 120%;
                height: 120%;
                background: radial-gradient(
                    circle,
                    rgba(242, 177, 56, 0.3) 0%,
                    rgba(242, 177, 56, 0.1) 40%,
                    transparent 70%
                );
                border-radius: 50%;
                z-index: 1;
                animation: maneFlow 4s ease-in-out infinite;
            }

            .lion-crown {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 20px;
                background: linear-gradient(45deg, #F2B138, #FFD700);
                clip-path: polygon(50% 0%, 20% 35%, 40% 35%, 40% 100%, 60% 100%, 60% 35%, 80% 35%);
                opacity: 0;
                z-index: 3;
                animation: crownGlow 3s ease-in-out infinite 1s;
            }

            @keyframes maneFlow {
                0%, 100% {
                    transform: scale(1) rotateZ(0deg);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1.1) rotateZ(2deg);
                    opacity: 0.5;
                }
            }

            @keyframes crownGlow {
                0%, 100% { opacity: 0; transform: translateX(-50%) scale(0.8); }
                50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
            }

            @keyframes lionNod {
                0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
                25% { transform: rotateX(-5deg) rotateY(2deg); }
                75% { transform: rotateX(5deg) rotateY(-2deg); }
            }

            @keyframes lionPride {
                0%, 100% { transform: scale(1) rotateZ(0deg); }
                50% { transform: scale(1.05) rotateZ(3deg); }
            }

            @keyframes lionWalk {
                0%, 100% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(5px) translateY(-3px); }
                75% { transform: translateX(-3px) translateY(-1px); }
            }

            .lion-nodding {
                animation: lionNod 2s ease-in-out;
            }

            .lion-proud {
                animation: lionPride 1.5s ease-in-out;
            }

            .lion-walking {
                animation: lionWalk 3s ease-in-out infinite;
            }

            .lion-visible {
                left: 20px;
            }

            .lion-center {
                left: 50%;
                transform: translateX(-50%);
            }

            @media (max-width: 768px) {
                .lion-animation {
                    width: 120px;
                    height: 120px;
                    top: 10px;
                }
                .lion-visible {
                    left: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.lion);
    }

    startPageLoadAnimation() {
        // Majestic entrance animation
        setTimeout(() => {
            this.lion.classList.add('lion-visible');
            this.lion.classList.add('lion-walking');

            // Show pride after entrance
            setTimeout(() => {
                this.showPride();
            }, 2000);
        }, 800);
    }

    startManeAnimation() {
        // Continuous mane flowing animation is handled by CSS
        // This method can be extended for more complex mane animations
    }

    showPride() {
        this.lion.classList.remove('lion-walking');
        this.lion.classList.add('lion-proud');

        setTimeout(() => {
            this.lion.classList.remove('lion-proud');
            this.lion.classList.add('lion-walking');
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

        // Team member hover interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.team-member, .team-card, [class*="team"]')) {
                this.reactToTeamHover();
            }
        });

        // About section hover
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('[class*="about"], .mission, .vision, .values')) {
                this.showPride();
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = scrollTop / (document.documentElement.scrollHeight - window.innerHeight);

        // Move lion vertically based on scroll
        if (scrollPercent > 0.1 && scrollPercent < 0.9) {
            const topPosition = 20 + (scrollPercent * 50);
            this.lion.style.top = `${topPosition}px`;
            this.lion.classList.add('lion-walking');
        } else if (scrollPercent >= 0.9) {
            this.lion.classList.remove('lion-walking');
            this.showPride();
        } else {
            this.lion.style.top = '20px';
            this.lion.classList.add('lion-walking');
        }

        // Special animation at certain scroll points
        if (scrollPercent > 0.3 && scrollPercent < 0.7) {
            if (!this.lion.classList.contains('lion-proud')) {
                this.lion.style.left = '50%';
                this.lion.style.transform = 'translateX(-50%)';
            }
        } else {
            this.lion.style.left = '20px';
            this.lion.style.transform = 'none';
        }
    }

    reactToTeamHover() {
        if (!this.lion.classList.contains('lion-nodding')) {
            this.lion.classList.remove('lion-walking', 'lion-proud');
            this.lion.classList.add('lion-nodding');

            setTimeout(() => {
                this.lion.classList.remove('lion-nodding');
                this.lion.classList.add('lion-walking');
            }, 2000);
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
const lionAnimations = new LionAnimations();