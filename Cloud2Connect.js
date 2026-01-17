// ==========================================
// NAVBAR MODULE - Navigation & Translations
// ==========================================

// Current Language (default: English)
let currentLang = 'en';

// Initialize Language Dropdown
function initLanguageDropdown() {
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (!langOptions.length || !currentLangSpan) return;
    
    // Set active language on init
    updateActiveLang();
    
    // Add click listeners to language options
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            if (selectedLang !== currentLang) {
                currentLang = selectedLang;
                updateActiveLang();
                updateTranslations();
            }
        });
    });
}

function updateActiveLang() {
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    // Update button text
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
    
    // Update active state
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update document language
    document.documentElement.lang = currentLang;
}

function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    // Handle placeholder translations
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

// Initialize translations on page load
function initTranslations() {
    // Set default language
    document.documentElement.lang = currentLang;
    
    // Apply translations
    updateTranslations();
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const checkbox = document.querySelector('.theme-switch__checkbox');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        if (checkbox) checkbox.checked = false;
    } else {
        body.setAttribute('data-theme', 'light');
        if (checkbox) checkbox.checked = true;
    }
}

// Initialize Navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations
    initTranslations();
    
    // Initialize language dropdown
    initLanguageDropdown();
    
    // Initialize Particles Canvas - ADD THIS LINE
    initParticlesCanvas();
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Setup theme toggle checkbox listener
    const themeCheckbox = document.querySelector('.theme-switch__checkbox');
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', function() {
            const body = document.body;
            if (this.checked) {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme');
            }
        });
    }
});

// ==========================================
// PARTICLES CANVAS - Mouse Interaction
// ==========================================

let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// PARTICLES ANIMATION

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        // Start at random position instead of edge
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
    // Move particle
    this.x += this.vx;
    this.y += this.vy;
    
    // Mouse repulsion effect - INCREASED VALUES
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {  // Changed from 150 to 200 (larger range)
        const force = (200 - dist) / 200;  // Updated to match new range
        this.x -= dx * force * 0.08;  // Changed from 0.03 to 0.08 (stronger push)
        this.y -= dy * force * 0.08;
    }
    
    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    
    // Keep within bounds
    this.x = Math.max(0, Math.min(this.canvas.width, this.x));
    this.y = Math.max(0, Math.min(this.canvas.height, this.y));
}
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${this.opacity})`;
        ctx.fill();
    }
}

// Initialize Particles Canvas
function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 200;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Recreate particles on resize
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(147, 197, 253, ${0.2 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations
    initTranslations();
    
    // Initialize language dropdown
    initLanguageDropdown();
    
    // Initialize Particles Canvas
    initParticlesCanvas();
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Setup theme toggle checkbox listener
    const themeCheckbox = document.querySelector('.theme-switch__checkbox');
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', function() {
            const body = document.body;
            if (this.checked) {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme');
            }
        });
    }
    
    // ==========================================
    // SCROLL ANIMATIONS - NOW INSIDE DOMContentLoaded
    // ==========================================
    
    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.stat-item, .feature-card, .section-title, .section-subtitle').forEach(el => {
        observer.observe(el);
    });

    // Animated Counter
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toFixed(target % 1 !== 0 ? 1 : 0);
                clearInterval(timer);
            } else {
                element.textContent = current.toFixed(target % 1 !== 0 ? 1 : 0);
            }
        }, 16);
    }

    // Stats Observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.stat-number');
                if (counter && !counter.hasAttribute('data-animated')) {
                    counter.setAttribute('data-animated', 'true');
                    animateCounter(counter);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    
    //cards section scroll animation
    const cards = document.querySelectorAll('.card');

    // Observer pour détecter quand chaque carte entre dans la vue
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observer chaque carte
    cards.forEach(card => {
        cardObserver.observe(card);
    });

    // Make nav sticky on scroll: add/remove .nav--sticky
    (function() {
        const nav = document.querySelector('nav');
        const stickyOffset = 80; // px scrolled before sticky activates (ajuste si besoin)

        function onScroll() {
            if (window.scrollY > stickyOffset) {
                if (!nav.classList.contains('nav--sticky')) nav.classList.add('nav--sticky');
            } else {
                nav.classList.remove('nav--sticky');
            }
        }

        window.addEventListener('scroll', onScroll, {
            passive: true
        });
        // Run once on load to set correct state
        onScroll();
    })();
});



