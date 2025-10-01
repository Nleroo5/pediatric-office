/**
 * Giraffe Animation Controller for FAQ Page
 * Handles page load and scroll-based animations
 */

class GiraffeAnimations {
    constructor() {
        this.giraffe = null;
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.animationFrame = null;
        this.neckStretchInterval = null;
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
        this.createGiraffeElement();
        this.bindEvents();
        this.checkInitialScroll();
        this.startNeckStretching();
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

    createGiraffeElement() {
        // Create giraffe container
        this.giraffe = document.createElement('div');
        this.giraffe.className = 'giraffe-animation';
        this.giraffe.innerHTML = `
            <img src="images/animals/giraffe.png" alt="Giraffe" class="giraffe-image">
            <div class="giraffe-spots"></div>
            <div class="question-bubble">?</div>
        `;

        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .giraffe-animation {
                position: fixed;
                top: 60vh;
                right: -300px;
                width: 300px;
                height: 320px;
                z-index: 100;
                pointer-events: none;
                transform: translateY(-50%);
                opacity: 0;
                transition: all 1.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .giraffe-image {
                position: relative;
                width: 100%;
                height: 100%;
                object-fit: contain;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
                z-index: 2;
            }

            .giraffe-spots {
                position: absolute;
                top: 20%;
                left: 20%;
                width: 60%;
                height: 60%;
                background: radial-gradient(
                    circle at 20% 30%,
                    rgba(242, 177, 56, 0.3) 0%,
                    transparent 15%
                ),
                radial-gradient(
                    circle at 70% 20%,
                    rgba(59, 157, 132, 0.3) 0%,
                    transparent 12%
                ),
                radial-gradient(
                    circle at 40% 70%,
                    rgba(80, 179, 238, 0.3) 0%,
                    transparent 10%
                );
                border-radius: 50%;
                z-index: 1;
                animation: spotsShimmer 5s ease-in-out infinite;
            }

            .question-bubble {
                position: absolute;
                top: 10%;
                right: 10%;
                width: 40px;
                height: 40px;
                background: rgba(80, 179, 238, 0.9);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: white;
                z-index: 4;
                opacity: 0;
                transform: scale(0);
                animation: questionPop 3s ease-in-out infinite 1s;
            }

            @keyframes spotsShimmer {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.1); }
            }

            @keyframes questionPop {
                0%, 80%, 100% { opacity: 0; transform: scale(0); }
                10%, 70% { opacity: 1; transform: scale(1); }
                40% { opacity: 1; transform: scale(1.2); }
            }

            @keyframes giraffeStretch {
                0%, 100% { transform: scaleY(1) rotateZ(0deg); }
                50% { transform: scaleY(1.1) rotateZ(1deg); }
            }

            @keyframes giraffeNod {
                0%, 100% { transform: rotateX(0deg) translateY(0); }
                25% { transform: rotateX(-5deg) translateY(-5px); }
                75% { transform: rotateX(5deg) translateY(5px); }
            }

            @keyframes giraffeReach {
                0%, 100% { transform: scale(1) rotateZ(0deg); }
                50% { transform: scale(1.05) rotateZ(-5deg); }
            }

            .giraffe-stretching {
                animation: giraffeStretch 4s ease-in-out infinite;
            }

            .giraffe-nodding {
                animation: giraffeNod 2s ease-in-out;
            }

            .giraffe-reaching {
                animation: giraffeReach 2.5s ease-in-out;
            }

            .giraffe-visible {
                right: 20px;
                opacity: 1;
            }

            @media (max-width: 768px) {
                .giraffe-animation {
                    width: 150px;
                    height: 160px;
                    top: 65vh;
                }
                .giraffe-visible {
                    right: 10px;
                }
                .question-bubble {
                    width: 25px;
                    height: 25px;
                    font-size: 16px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(this.giraffe);
    }

    startPageLoadAnimation() {
        // Only start animation if we've passed the hero section
        if (!this.hasPassedHero) return;

        // Stretch into view animation
        setTimeout(() => {
            this.showAnimal();

            // Nod hello after entrance
            setTimeout(() => {
                this.nodHello();
            }, 3000);
        }, 800);
    }

    showAnimal() {
        this.giraffe.style.opacity = '1';
        this.giraffe.style.right = '20px';
        this.giraffe.classList.add('giraffe-visible');
        this.giraffe.classList.add('giraffe-stretching');
    }

    hideAnimal() {
        this.giraffe.style.opacity = '0';
        this.giraffe.style.right = '-300px';
        this.giraffe.style.top = '60vh';
        this.giraffe.classList.remove('giraffe-visible', 'giraffe-stretching', 'giraffe-nodding', 'giraffe-reaching');
    }

    startNeckStretching() {
        // Neck stretching is handled by CSS animation
        // This method can be extended for more complex neck animations
    }

    nodHello() {
        this.giraffe.classList.remove('giraffe-stretching');
        this.giraffe.classList.add('giraffe-nodding');

        setTimeout(() => {
            this.giraffe.classList.remove('giraffe-nodding');
            this.giraffe.classList.add('giraffe-stretching');
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

        // FAQ item interactions
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.faq-item, .accordion, [class*="faq"], .question')) {
                this.reactToQuestionHover();
            }
        });

        // FAQ answer reveals
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-item, .accordion, [class*="faq"], .question')) {
                this.reactToAnswerReveal();
            }
        });

        // Search or filter interactions
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input[type="search"], .search-input, .filter-input')) {
                this.reactToSearch();
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

        // Stretch higher as user scrolls through FAQs
        if (scrollPercent > 0.3 && scrollPercent < 0.9) {
            this.giraffe.style.top = `${60 - (scrollPercent * 20)}vh`;
            this.giraffe.classList.add('giraffe-stretching');
        } else if (scrollPercent >= 0.9) {
            this.giraffe.classList.remove('giraffe-stretching');
            this.giraffe.classList.add('giraffe-nodding');
        } else {
            this.giraffe.style.top = '60vh';
            this.giraffe.classList.add('giraffe-stretching');
            this.giraffe.classList.remove('giraffe-nodding');
        }
    }

    reactToQuestionHover() {
        if (!this.giraffe.classList.contains('giraffe-reaching')) {
            this.giraffe.classList.remove('giraffe-stretching', 'giraffe-nodding');
            this.giraffe.classList.add('giraffe-reaching');

            setTimeout(() => {
                this.giraffe.classList.remove('giraffe-reaching');
                this.giraffe.classList.add('giraffe-stretching');
            }, 2500);
        }
    }

    reactToAnswerReveal() {
        // Happy nodding when answer is revealed
        this.giraffe.classList.remove('giraffe-stretching', 'giraffe-reaching');
        this.giraffe.classList.add('giraffe-nodding');

        setTimeout(() => {
            this.giraffe.classList.remove('giraffe-nodding');
            this.giraffe.classList.add('giraffe-stretching');
        }, 2000);
    }

    reactToSearch() {
        // Stretch higher to "look" for answers
        this.giraffe.classList.remove('giraffe-stretching', 'giraffe-nodding');
        this.giraffe.classList.add('giraffe-reaching');

        setTimeout(() => {
            this.giraffe.classList.remove('giraffe-reaching');
            this.giraffe.classList.add('giraffe-stretching');
        }, 3000);
    }

    destroy() {
        if (this.giraffe) {
            this.giraffe.remove();
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.neckStretchInterval) {
            clearInterval(this.neckStretchInterval);
        }
    }
}

// Initialize giraffe animations when script loads
// Only initialize giraffe animations on FAQ page
if (window.location.pathname.includes('faq.html') || document.title.includes('FAQ') || document.title.includes('Questions')) {
    new GiraffeAnimations();
}