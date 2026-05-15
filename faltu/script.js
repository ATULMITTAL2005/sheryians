// Planet data with detailed information
const planetsData = {
    mercury: {
        name: 'MERCURY',
        color: '#ff6b6b',
        description: 'Mercury, the smallest planet, orbits closest to the sun with extreme temperatures. It has no atmosphere and experiences severe thermal fluctuations.',
        diameter: '4,879 km',
        moons: '0',
        gravity: '3.7 m/s²',
        orbit: '87.97 days',
        image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg'
    },
    venus: {
        name: 'VENUS',
        color: '#ffa94d',
        description: 'Venus, Earth\'s sister, is the hottest planet with a toxic atmosphere and retrograde rotation. It shines brighter than any star in the night sky.',
        diameter: '12,104 km',
        moons: '0',
        gravity: '8.87 m/s²',
        orbit: '224.7 days',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus_globe.jpg'
    },
    earth: {
        name: 'EARTH',
        color: '#4dabf7',
        description: 'Earth, our home, is the only known planet supporting diverse life forms and liquid water. It\'s a dynamic world of beauty and complexity.',
        diameter: '12,742 km',
        moons: '1',
        gravity: '9.8 m/s²',
        orbit: '365.25 days',
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg'
    },
    mars: {
        name: 'MARS',
        color: '#fa5252',
        description: 'Mars, the red planet, holds secrets of ancient water and potential for future exploration. It\'s a target for human space exploration.',
        diameter: '6,779 km',
        moons: '2',
        gravity: '3.71 m/s²',
        orbit: '687 days',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/OSIRIS_Mars_true_color.jpg'
    },
    jupiter: {
        name: 'JUPITER',
        color: '#a78bfa',
        description: 'Jupiter, the gas giant, dominates our solar system with its massive size and the famous Great Red Spot. It has a strong magnetic field.',
        diameter: '139,820 km',
        moons: '95',
        gravity: '24.79 m/s²',
        orbit: '11.86 years',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg'
    },
    saturn: {
        name: 'SATURN',
        color: '#ffd43b',
        description: 'Saturn, adorned with stunning rings, is a gas giant of immense beauty and mystery. Its rings are composed of ice and rock particles.',
        diameter: '116,460 km',
        moons: '146',
        gravity: '10.44 m/s²',
        orbit: '29.46 years',
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg'
    },
    uranus: {
        name: 'URANUS',
        color: '#74c0fc',
        description: 'Uranus, the ice giant, rotates on its side with a pale blue-green atmosphere. It has a unique tilted axis of rotation.',
        diameter: '50,724 km',
        moons: '28',
        gravity: '8.69 m/s²',
        orbit: '84.01 years',
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg'
    },
    neptune: {
        name: 'NEPTUNE',
        color: '#4dabf7',
        description: 'Neptune, the windy world, is the most distant planet with supersonic storms. It has the strongest winds in the solar system.',
        diameter: '49,244 km',
        moons: '16',
        gravity: '11.15 m/s²',
        orbit: '164.79 years',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg'
    }
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializePlanetCards();
    initializeHeroAnimation();
    addEventListeners();
    updateActiveStates();
    initializeGsapAnimations();
});

// Initialize planet card click events
function initializePlanetCards() {
    const planetCards = document.querySelectorAll('.planet-card');
    
    planetCards.forEach(card => {
        card.addEventListener('click', function() {
            const planetKey = this.getAttribute('data-planet');
            switchPlanet(planetKey);
            
            // Update active state
            planetCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Switch planet display
function switchPlanet(planetKey) {
    const planet = planetsData[planetKey];
    
    if (!planet) return;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const planetImage = document.getElementById('planetImage');
    const planetGlow = document.querySelector('.planet-glow');
    const detailsImage = document.getElementById('detailsImage');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDescription = document.getElementById('detailsDescription');
    const statValues = document.querySelectorAll('.stat-value');

    if (window.gsap) {
        gsap.timeline()
            .to([heroTitle, planetImage], {
                opacity: 0,
                y: -18,
                duration: 0.25,
                ease: 'power2.in'
            })
            .to([detailsTitle, detailsDescription, detailsImage], {
                opacity: 0,
                y: 18,
                duration: 0.2,
                ease: 'power2.in'
            }, '<')
            .add(() => {
                heroTitle.textContent = planet.name;
                planetImage.src = planet.image;
                detailsImage.src = planet.image;
                planetGlow.style.boxShadow = `0 0 35px ${planet.color}`;
                heroTitle.style.background = `linear-gradient(135deg, ${planet.color}, #7c3aed)`;
                heroTitle.style.webkitBackgroundClip = 'text';
                heroTitle.style.webkitTextFillColor = 'transparent';
                heroTitle.style.backgroundClip = 'text';
                updateDetailsSection(planet, true);
            })
            .to([heroTitle, planetImage], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.04,
                ease: 'power3.out'
            })
            .to([detailsTitle, detailsDescription, detailsImage, ...statValues], {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power3.out'
            }, '<0.05');
        
        return;
    }
    
    // Fade out animation
    heroTitle.style.opacity = '0';
    planetImage.style.opacity = '0';
    
    setTimeout(() => {
        // Update content
        heroTitle.textContent = planet.name;
        planetImage.src = planet.image;
        planetGlow.style.boxShadow = `0 0 30px ${planet.color}`;
        
        // Update details section
        updateDetailsSection(planet);
        
        // Update hero title gradient color
        heroTitle.style.background = `linear-gradient(135deg, ${planet.color}, #7c3aed)`;
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.backgroundClip = 'text';
        
        // Fade in animation
        heroTitle.style.opacity = '1';
        planetImage.style.opacity = '1';
    }, 300);
}

// Update details section
function updateDetailsSection(planet, skipAnimation = false) {
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDescription = document.getElementById('detailsDescription');
    const detailsImage = document.getElementById('detailsImage');
    const detailsGlow = document.getElementById('detailsGlow');
    
    const statDiameter = document.getElementById('statDiameter');
    const statMoons = document.getElementById('statMoons');
    const statGravity = document.getElementById('statGravity');
    const statOrbit = document.getElementById('statOrbit');
    const statValues = document.querySelectorAll('.stat-value');
    
    const updateContent = () => {
        detailsTitle.textContent = planet.name;
        detailsDescription.textContent = planet.description;
        detailsImage.src = planet.image;
        detailsGlow.style.boxShadow = `0 0 55px ${planet.color}`;
        
        statDiameter.textContent = planet.diameter;
        statMoons.textContent = planet.moons;
        statGravity.textContent = planet.gravity;
        statOrbit.textContent = planet.orbit;
        
        detailsTitle.style.background = `linear-gradient(135deg, ${planet.color}, #7c3aed)`;
        detailsTitle.style.webkitBackgroundClip = 'text';
        detailsTitle.style.webkitTextFillColor = 'transparent';
        detailsTitle.style.backgroundClip = 'text';
        statValues.forEach(stat => {
            stat.style.color = planet.color;
        });
    };

    if (skipAnimation || !window.gsap) {
        updateContent();
        return;
    }

    gsap.timeline()
        .to([detailsTitle, detailsDescription, detailsImage, statValues], {
            opacity: 0,
            y: 14,
            duration: 0.22,
            stagger: 0.03,
            ease: 'power2.in'
        })
        .add(updateContent)
        .to([detailsTitle, detailsDescription, detailsImage, statValues], {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: 'power3.out'
        });
}

// Initialize hero animation
function initializeHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');

    if (window.gsap) {
        gsap.fromTo(
            [heroTitle, heroDescription, heroCta],
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                delay: 0.15
            }
        );
        return;
    }

    // Stagger animation fallback
    setTimeout(() => {
        heroTitle.style.animation = 'fadeInDown 1s ease-out forwards';
    }, 100);
    
    setTimeout(() => {
        heroDescription.style.animation = 'fadeInUp 1s ease-out 0.2s forwards';
    }, 300);
    
    setTimeout(() => {
        heroCta.style.animation = 'fadeInUp 1s ease-out 0.4s forwards';
    }, 500);
}

// Add event listeners
function addEventListeners() {
    // CTA button hover effects
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        if (window.gsap) {
            btn.addEventListener('mouseenter', function() {
                gsap.to(this, { scale: 1.06, duration: 0.25, ease: 'power2.out' });
            });

            btn.addEventListener('mouseleave', function() {
                gsap.to(this, { scale: 1, duration: 0.25, ease: 'power2.out' });
            });
        } else {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll animations
    addScrollAnimations();
}

function initializeGsapAnimations() {
    if (!window.gsap) return;

    gsap.from('.navbar', {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.float-planet', {
        scale: 0,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'back.out(1.8)'
    });

    gsap.from('.planet-display', {
        scale: 0.85,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.15
    });

    gsap.from('.planet-card', {
        opacity: 0,
        y: 60,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: undefined
    });

    gsap.from('.about-card', {
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
    });

    gsap.to('.floating-planets', {
        y: -18,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.starfield', {
        opacity: 0.95,
        duration: 1.8,
        ease: 'power2.out'
    });

    gsap.utils.toArray('.planet-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -16, scale: 1.04, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    gsap.utils.toArray('.about-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -10, scale: 1.02, duration: 0.25, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
        });
    });
}

// Scroll animations
function addScrollAnimations() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe planet cards
    document.querySelectorAll('.planet-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // Observe about cards
    document.querySelectorAll('.about-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Update active states on page load
function updateActiveStates() {
    const earthCard = document.querySelector('[data-planet="earth"]');
    if (earthCard) {
        earthCard.classList.add('active');
    }
}

// Parallax effect on mouse move
document.addEventListener('mousemove', function(e) {
    const planetDisplay = document.querySelector('.planet-display');
    if (planetDisplay) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        planetDisplay.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Smooth transitions for details section
const detailsSection = document.querySelector('.planet-details');
if (detailsSection) {
    const detailsTitle = detailsSection.querySelector('h2');
    const detailsDescription = detailsSection.querySelector('p');
    const detailsImage = detailsSection.querySelector('img');
    
    if (detailsTitle) detailsTitle.style.transition = 'all 0.3s ease';
    if (detailsDescription) detailsDescription.style.transition = 'all 0.3s ease';
    if (detailsImage) detailsImage.style.transition = 'all 0.3s ease';
}

// Apply initial opacity to elements
document.querySelectorAll('.stat-value').forEach(el => {
    el.style.transition = 'color 0.3s ease';
});
