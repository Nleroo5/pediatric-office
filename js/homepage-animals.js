class HomepageAnimals {
    constructor() {
        this.animals = [];
        this.container = null;
        this.isAnimated = false;
        this.init();
    }

    init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find the animal container
        this.container = document.getElementById('homepage-animals');
        if (!this.container) return;

        // Create all 4 animals
        this.createAnimals();

        // Start the swooping animation after a short delay
        setTimeout(() => this.startSwoopAnimation(), 1000);
    }

    createAnimals() {
        // Simple vertical stack on left side - FORGET EVERYTHING ELSE
        const animalConfigs = [
            {
                name: 'lion',
                image: 'images/animals/lion.png',
                startPosition: { left: '-300px', top: '100px' },
                endPosition: { left: '50px', top: '100px' },
                size: '100px',
                delay: 0,
                page: 'about.html',
                label: 'About Us'
            },
            {
                name: 'zebra',
                image: 'images/animals/zebra.png',
                startPosition: { left: '-300px', top: '220px' },
                endPosition: { left: '50px', top: '220px' },
                size: '100px',
                delay: 300,
                page: 'services.html',
                label: 'Our Services'
            },
            {
                name: 'alligator',
                image: 'images/animals/alligator.png',
                startPosition: { left: '-300px', top: '340px' },
                endPosition: { left: '50px', top: '340px' },
                size: '100px',
                delay: 600,
                page: 'new-patients.html',
                label: 'New Patients'
            },
            {
                name: 'monkey',
                image: 'images/animals/monkey.png',
                startPosition: { left: '-300px', top: '460px' },
                endPosition: { left: '50px', top: '460px' },
                size: '100px',
                delay: 900,
                page: 'patient-portal.html',
                label: 'Patient Portal'
            }
        ];

        animalConfigs.forEach(config => {
            this.createAnimal(config);
        });
    }

    createAnimal(config) {
        // Create animal element
        const animal = document.createElement('div');
        animal.className = `homepage-animal homepage-${config.name}`;

        // Set initial position (off-screen)
        Object.assign(animal.style, {
            position: 'absolute',
            width: config.size,
            height: config.size,
            zIndex: '50',
            opacity: '0',
            transform: 'scale(0.8)',
            transition: 'all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: 'pointer',
            ...config.startPosition
        });

        // Add animal image with visible label underneath
        animal.innerHTML = `
            <div class="animal-container">
                <img src="${config.image}" alt="${config.name}" class="w-full h-full object-contain ${config.name}-float">
                <div class="${config.name}-effects"></div>
                <div class="animal-label">${config.label}</div>
            </div>
        `;

        // Add click event to navigate to page
        animal.addEventListener('click', () => {
            window.location.href = config.page;
        });

        // Add hover effects
        animal.addEventListener('mouseenter', () => {
            animal.style.transform = animal.style.transform.replace('scale(1)', 'scale(1.1)');
        });

        animal.addEventListener('mouseleave', () => {
            animal.style.transform = animal.style.transform.replace('scale(1.1)', 'scale(1)');
        });

        this.container.appendChild(animal);
        this.animals.push({ element: animal, config });
    }

    startSwoopAnimation() {
        this.animals.forEach(({ element, config }, index) => {
            setTimeout(() => {
                this.swoopIn(element, config);
            }, config.delay);
        });
    }

    swoopIn(element, config) {
        // Make visible and animate to final position
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';

        // COMPLETELY CLEAR ALL POSITIONING - foolproof method
        element.style.removeProperty('left');
        element.style.removeProperty('right');
        element.style.removeProperty('top');
        element.style.removeProperty('bottom');

        // Force absolute positioning
        element.style.position = 'absolute';

        // Set ONLY the position we want - one property at a time
        if (config.endPosition.left) {
            element.style.left = config.endPosition.left;
        }
        if (config.endPosition.right) {
            element.style.right = config.endPosition.right;
        }
        if (config.endPosition.bottom) {
            element.style.bottom = config.endPosition.bottom;
        }
        if (config.endPosition.top) {
            element.style.top = config.endPosition.top;
        }

        // Debug log to see actual positions
        console.log(`${config.name} FINAL position:`, {
            left: element.style.left,
            right: element.style.right,
            bottom: element.style.bottom,
            position: element.style.position,
            computedLeft: window.getComputedStyle(element).left,
            computedRight: window.getComputedStyle(element).right
        });

        // Remove transition after animation completes to prevent further movement
        setTimeout(() => {
            element.style.transition = 'transform 0.3s ease'; // Only allow transform transitions for hover
            this.addFloatingAnimation(element, config.name);
        }, 1500);
    }

    addFloatingAnimation(element, animalName) {
        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            .${animalName}-float {
                animation: ${animalName}Float 4s ease-in-out infinite;
            }

            @keyframes ${animalName}Float {
                0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                50% { transform: translateY(-5px) rotate(1deg) scale(1); }
            }

            .homepage-${animalName}:hover {
                transform: scale(1.1) !important;
                transition: transform 0.3s ease;
            }

            .homepage-${animalName}:hover .${animalName}-float {
                animation-duration: 2s;
            }

            .animal-label {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                color: #0D2673;
                padding: 6px 12px;
                border-radius: 15px;
                font-family: 'Fredoka', sans-serif;
                font-size: 14px;
                font-weight: 600;
                white-space: nowrap;
                opacity: 1;
                pointer-events: none;
                transition: all 0.3s ease;
                z-index: 60;
                box-shadow: 0 3px 8px rgba(0,0,0,0.15);
                border: 2px solid #3B9D84;
            }

            .homepage-${animalName}:hover .animal-label {
                transform: translateX(-50%) scale(1.05);
                background: rgba(59, 157, 132, 0.95);
                color: white;
                border-color: #F2B138;
            }
        `;

        if (!document.getElementById(`${animalName}-float-styles`)) {
            style.id = `${animalName}-float-styles`;
            document.head.appendChild(style);
        }

        // Click interaction is handled in createAnimal method
    }

    animalClick(animalName) {
        // Navigate to the corresponding page when animal is clicked
        const pageMap = {
            lion: 'about.html',
            zebra: 'services.html',
            alligator: 'new-patients.html',
            monkey: 'patient-portal.html'
        };

        if (pageMap[animalName]) {
            window.location.href = pageMap[animalName];
        }
    }
}

// Initialize homepage animals when page loads
new HomepageAnimals();