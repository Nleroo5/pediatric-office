/**
 * Monkey Animation Controller for Patient Portal Page
 * Handles page load and scroll-based animations
 */

class MonkeyAnimations {
    constructor() {
        this.monkey = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
        this.swingInterval = null;
        this.currentVine = 0;
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
        this.createMonkeyElement();
        this.createVines();
        this.bindEvents();
        this.checkInitialScroll();
        this.isInitialized = true;
    }

    createMonkeyElement() {
        // Create monkey container
        this.monkey = document.createElement('div');
        this.monkey.className = 'monkey-animation';
        this.monkey.innerHTML = `
            <div class="monkey-tablet"></div>
            <img src="images/animals/monkey.png" alt="Monkey" class="monkey-image">
            <div class="monkey-tail"></div>
            <div class="typing-indicator"></div>
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
                top: 50px;
                right: -200px;
                width: 220px;
                height: 220px;
                z-index: 100;
                pointer-events: auto;
                transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateX(50px);
            }

            .monkey-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .monkey-tablet {
                position: absolute;
                bottom: 20px;
                left: 20px;
                width: 40px;
                height: 30px;
                background: linear-gradient(145deg, #50B3EE, #3B9D84);
                border-radius: 4px;
                z-index: 3;
                opacity: 0;
                transform: rotateX(-20deg);
                animation: tabletGlow 3s ease-in-out infinite 2s;
            }

            .monkey-tablet::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                right: 2px;
                bottom: 6px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 2px;
            }

            .monkey-tablet::after {
                content: '';
                position: absolute;
                bottom: 2px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 3px;
                background: #333;
                border-radius: 2px;
            }

            .monkey-tail {
                position: absolute;
                bottom: 30px;
                right: 10px;
                width: 60px;
                height: 8px;
                background: linear-gradient(90deg, #F2B138, #3B9D84);
                border-radius: 20px;
                transform-origin: left center;
                z-index: 1;
                animation: tailCurl 3s ease-in-out infinite;
            }

            .typing-indicator {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 20px;
                height: 20px;
                z-index: 4;
                opacity: 0;
            }

            .typing-indicator::before,
            .typing-indicator::after {
                content: '';
                position: absolute;
                width: 4px;
                height: 4px;
                background: #50B3EE;
                border-radius: 50%;
                animation: typingDots 1.5s ease-in-out infinite;
            }

            .typing-indicator::before {
                left: 0;
                animation-delay: 0s;
            }

            .typing-indicator::after {
                left: 8px;
                animation-delay: 0.3s;
            }

            .vine {
                position: fixed;
                width: 4px;
                background: linear-gradient(180deg, #3B9D84, #50B3EE);
                border-radius: 2px;
                z-index: 99;
                opacity: 0;
                animation: vineGrow 1s ease-out forwards;
            }

            .vine-1 { top: 0; right: 25%; height: 200px; }
            .vine-2 { top: 0; right: 50%; height: 250px; }
            .vine-3 { top: 0; right: 75%; height: 180px; }

            @keyframes tabletGlow {
                0%, 100% { opacity: 0; transform: rotateX(-20deg) scale(0.9); }
                50% { opacity: 1; transform: rotateX(0deg) scale(1); }
            }

            @keyframes tailCurl {
                0%, 100% { transform: rotateZ(0deg) scaleX(1); }
                50% { transform: rotateZ(20deg) scaleX(1.1); }
            }

            @keyframes typingDots {
                0%, 100% { opacity: 0; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }

            @keyframes vineGrow {
                0% { height: 0; opacity: 0; }
                100% { height: var(--vine-height); opacity: 0.6; }
            }

            @keyframes monkeySwing {
                0%, 100% { transform: translateX(0) rotateZ(0deg); }
                50% { transform: translateX(-30px) rotateZ(-10deg); }
            }

            @keyframes monkeyBounce {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-10px) scale(1.05); }
            }

            @keyframes monkeyType {
                0%, 100% { transform: rotateZ(0deg); }
                25% { transform: rotateZ(-2deg); }
                75% { transform: rotateZ(2deg); }
            }

            .monkey-swinging {
                animation: monkeySwing 2.5s ease-in-out infinite;
            }

            .monkey-bouncing {
                animation: monkeyBounce 1.5s ease-in-out;
            }

            .monkey-typing {
                animation: monkeyType 2s ease-in-out;
            }

            .monkey-visible {
                right: 20px;
            }

            .monkey-show-tablet .monkey-tablet {
                opacity: 1;
            }

            .monkey-show-typing .typing-indicator {
                opacity: 1;
            }

            @media (max-width: 768px) {
                .monkey-animation {
                    width: 120px;
                    height: 120px;
                    top: 30px;
                }
                .monkey-visible {
                    right: 10px;
                }
                .vine { display: none; }
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
                .monkey-animation {
                    width: 150px;
                    height: 150px;
                    top: 60px;
                    right: -180px;
                }
                .monkey-visible {
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
                .monkey-animation {
                    width: 120px;
                    height: 120px;
                    top: 50px;
                    right: -150px;
                }
                .monkey-visible {
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

            .monkey-animation:hover .text-bubble {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.monkey);
    }

    createVines() {
        // Create swinging vines for desktop
        if (window.innerWidth > 768) {
            for (let i = 1; i <= 3; i++) {
                const vine = document.createElement('div');
                vine.className = `vine vine-${i}`;
                vine.style.setProperty('--vine-height', vine.className.includes('vine-2') ? '250px' :
                                     vine.className.includes('vine-1') ? '200px' : '180px');
                document.body.appendChild(vine);
            }
        }
    }

    calculateHeroThreshold() {
        // Calculate when hero section ends - usually around 80vh or check for hero elements
        const heroElement = document.querySelector('section[class*="hero"]');
        if (heroElement) {
            this.heroScrollThreshold = heroElement.offsetHeight * 0.8;
        } else {
            // Fallback to standard hero height
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

        // Swing into view animation
        setTimeout(() => {
            this.showAnimal();

            // Show tablet after swinging in
            setTimeout(() => {
                this.showTablet();
            }, 2000);
        }, 500);
    }

    showAnimal() {
        this.monkey.style.opacity = '1';
        this.monkey.style.transform = 'translateX(0)';
        this.monkey.style.right = '20px';
        this.monkey.classList.add('monkey-visible');
        this.monkey.classList.add('monkey-swinging');
    }

    hideAnimal() {
        this.monkey.style.opacity = '0';
        this.monkey.style.transform = 'translateX(50px)';
        this.monkey.style.right = '-200px';
        this.monkey.classList.remove('monkey-visible', 'monkey-swinging', 'monkey-show-tablet', 'monkey-bouncing', 'monkey-typing', 'monkey-show-typing');
    }

    showTablet() {
        this.monkey.classList.remove('monkey-swinging');
        this.monkey.classList.add('monkey-show-tablet');
        this.monkey.classList.add('monkey-bouncing');

        setTimeout(() => {
            this.monkey.classList.remove('monkey-bouncing');
            this.monkey.classList.add('monkey-swinging');
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

        // Portal feature interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.portal-feature, .feature-card, [class*="portal"]')) {
                this.reactToPortalFeature();
            }
        });

        // Login/form interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.startTyping();
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.stopTyping();
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

        // Swing between vines based on scroll
        if (window.innerWidth > 768) {
            if (scrollPercent < 0.3) {
                this.monkey.style.right = '75%';
                this.monkey.classList.add('monkey-swinging');
            } else if (scrollPercent < 0.6) {
                this.monkey.style.right = '50%';
                this.monkey.classList.add('monkey-swinging');
            } else if (scrollPercent < 0.9) {
                this.monkey.style.right = '25%';
                this.monkey.classList.add('monkey-swinging');
            } else {
                this.monkey.style.right = '20px';
                this.showTablet();
            }
        } else {
            // Mobile behavior - move up and down
            const topPosition = 30 + (scrollPercent * 100);
            this.monkey.style.top = `${Math.min(topPosition, window.innerHeight - 150)}px`;
        }
    }

    reactToPortalFeature() {
        if (!this.monkey.classList.contains('monkey-bouncing')) {
            this.monkey.classList.remove('monkey-swinging', 'monkey-typing');
            this.monkey.classList.add('monkey-bouncing');
            this.showTablet();

            setTimeout(() => {
                this.monkey.classList.remove('monkey-bouncing');
                this.monkey.classList.add('monkey-swinging');
            }, 1500);
        }
    }

    startTyping() {
        this.monkey.classList.remove('monkey-swinging', 'monkey-bouncing');
        this.monkey.classList.add('monkey-typing', 'monkey-show-typing');
        this.showTablet();
    }

    stopTyping() {
        setTimeout(() => {
            this.monkey.classList.remove('monkey-typing', 'monkey-show-typing');
            this.monkey.classList.add('monkey-swinging');
        }, 500);
    }

    reactToButtonClick() {
        // Excited jumping for successful interactions
        this.monkey.classList.remove('monkey-swinging', 'monkey-typing');
        this.monkey.classList.add('monkey-bouncing');

        setTimeout(() => {
            this.monkey.classList.remove('monkey-bouncing');
            this.monkey.classList.add('monkey-swinging');
        }, 2000);
    }


    destroy() {
        if (this.monkey) {
            this.monkey.remove();
        }

        // Remove vines
        document.querySelectorAll('.vine').forEach(vine => vine.remove());

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.swingInterval) {
            clearInterval(this.swingInterval);
        }
    }
}

// Initialize monkey animations when script loads
// Only initialize monkey animations on patient portal page
if (window.location.pathname.includes('patient-portal.html') || document.title.includes('Patient Portal')) {
    new MonkeyAnimations();
}