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
        this.createAlligatorElement();
        this.bindEvents();
        this.startPageLoadAnimation();
        this.startTailWagging();
        this.isInitialized = true;
    }

    createAlligatorElement() {
        // Create alligator container
        this.alligator = document.createElement('div');
        this.alligator.className = 'alligator-animation';
        this.alligator.innerHTML = `
            <div class="alligator-ripples"></div>
            <img src="images/animals/alligator.png" alt="Alligator" class="alligator-image">
            <div class="alligator-tail"></div>
            <div class="alligator-bubbles"></div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .alligator-animation {
                position: fixed;
                bottom: -200px;
                left: 20px;
                width: 200px;
                height: 120px;
                z-index: 100;
                pointer-events: none;
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

            .alligator-ripples {
                position: absolute;
                bottom: -10px;
                left: 10%;
                width: 80%;
                height: 20px;
                background: radial-gradient(
                    ellipse,
                    rgba(80, 179, 238, 0.3) 0%,
                    rgba(80, 179, 238, 0.1) 60%,
                    transparent 100%
                );
                border-radius: 50%;
                z-index: 1;
                animation: rippleEffect 3s ease-in-out infinite;
            }

            .alligator-tail {
                position: absolute;
                right: 10px;
                top: 40%;
                width: 40px;
                height: 15px;
                background: linear-gradient(90deg, #3B9D84, #50B3EE);
                border-radius: 50% 10px;
                transform-origin: left center;
                z-index: 1;
                animation: tailWag 2s ease-in-out infinite;
            }

            .alligator-bubbles {
                position: absolute;
                top: 20px;
                right: 30px;
                width: 30px;
                height: 40px;
                z-index: 3;
            }

            .alligator-bubbles::before,
            .alligator-bubbles::after {
                content: '';
                position: absolute;
                border-radius: 50%;
                background: rgba(80, 179, 238, 0.6);
                animation: bubbleFloat 2.5s ease-in-out infinite;
            }

            .alligator-bubbles::before {
                width: 6px;
                height: 6px;
                top: 0;
                left: 5px;
                animation-delay: 0s;
            }

            .alligator-bubbles::after {
                width: 4px;
                height: 4px;
                top: 15px;
                left: 15px;
                animation-delay: 0.8s;
            }

            @keyframes rippleEffect {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.3;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.1;
                }
            }

            @keyframes tailWag {
                0%, 100% { transform: rotateZ(0deg); }
                25% { transform: rotateZ(15deg); }
                75% { transform: rotateZ(-10deg); }
            }

            @keyframes bubbleFloat {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0.3);
                }
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
                bottom: 20px;
            }

            .alligator-center {
                left: 50%;
                transform: translateX(-50%);
            }

            @media (max-width: 768px) {
                .alligator-animation {
                    width: 150px;
                    height: 90px;
                    left: 10px;
                }
                .alligator-visible {
                    bottom: 10px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.alligator);
    }

    startPageLoadAnimation() {
        // Swim up from bottom animation
        setTimeout(() => {
            this.alligator.classList.add('alligator-visible');
            this.alligator.classList.add('alligator-swimming');

            // Welcome gesture after surfacing
            setTimeout(() => {
                this.welcomeNewPatients();
            }, 2000);
        }, 600);
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
        const scrollPercent = scrollTop / (document.documentElement.scrollHeight - window.innerHeight);

        // Move alligator horizontally based on scroll (swimming across the page)
        if (scrollPercent > 0.2 && scrollPercent < 0.8) {
            const leftPosition = 20 + (scrollPercent * 200);
            this.alligator.style.left = `${Math.min(leftPosition, window.innerWidth - 220)}px`;
            this.alligator.classList.add('alligator-swimming');
        } else if (scrollPercent >= 0.8) {
            this.alligator.classList.remove('alligator-swimming');
            this.welcomeNewPatients();
        } else {
            this.alligator.style.left = '20px';
            this.alligator.classList.add('alligator-swimming');
        }
    }

    reactToFormInteraction() {
        if (!this.alligator.classList.contains('alligator-snapping')) {
            this.alligator.classList.remove('alligator-swimming', 'alligator-welcoming');
            this.alligator.classList.add('alligator-snapping');

            // Create extra bubbles during form interaction
            this.createExtraBubbles();

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

    createExtraBubbles() {
        const bubbleContainer = this.alligator.querySelector('.alligator-bubbles');
        const extraBubble = document.createElement('div');
        extraBubble.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: rgba(80, 179, 238, 0.7);
            border-radius: 50%;
            top: 10px;
            left: 10px;
            animation: bubbleFloat 1.5s ease-out forwards;
            pointer-events: none;
        `;

        bubbleContainer.appendChild(extraBubble);

        setTimeout(() => {
            extraBubble.remove();
        }, 1500);
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
const alligatorAnimations = new AlligatorAnimations();