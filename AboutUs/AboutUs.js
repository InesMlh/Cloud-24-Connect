// ==========================================
// LANGUAGE MANAGEMENT
// ==========================================

let currentLang = 'en';

console.log('=== ABOUTUS.JS LOADED ===');
console.log('Translations object exists:', typeof translations !== 'undefined');

function initLanguageDropdown() {
    console.log('Initializing language dropdown...');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    console.log('Found lang options:', langOptions.length);
    
    if (!langOptions.length || !currentLangSpan) return;
    
    updateActiveLang();
    
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            console.log('Language clicked:', selectedLang);
            if (selectedLang !== currentLang) {
                currentLang = selectedLang;
                updateActiveLang();
                translatePage();
            }
        });
    });
}

function updateActiveLang() {
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
    
    langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    document.documentElement.lang = currentLang;
}

function translatePage() {
    console.log('Translating to:', currentLang);
    
    if (typeof translations === 'undefined') {
        console.error('Translations object not found!');
        return;
    }
    
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('Found elements with data-i18n:', elements.length);
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[currentLang]?.[key];
        
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
        }
    });
}

// ==========================================
// THEME TOGGLE
// ==========================================

function initThemeToggle() {
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
}

// ==========================================
// MOUSE GRADIENT EFFECT
// ==========================================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ==========================================
// PARTICLES CANVAS
// ==========================================

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
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
        this.x += this.vx;
        this.y += this.vy;
        
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
            const force = (200 - dist) / 200;
            this.x -= dx * force * 0.08;
            this.y -= dy * force * 0.08;
        }
        
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
        
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

function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 200;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
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
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
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

    document.querySelectorAll('.stat-item, .infra-card, .blog-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.about-stats');
    
    if (!statsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach((stat, index) => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    setTimeout(() => {
                        animateValue(stat, 0, target, 2000);
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// ==========================================
// STICKY NAV
// ==========================================

function initStickyNav() {
    const nav = document.querySelector('nav');
    const stickyOffset = 80;

    function onScroll() {
        if (window.scrollY > stickyOffset) {
            if (!nav.classList.contains('nav--sticky')) {
                nav.classList.add('nav--sticky');
            }
        } else {
            nav.classList.remove('nav--sticky');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// PARALLAX SCROLL EFFECT
// ==========================================

function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-content, .infra-card, .timeline-item');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed / 10);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM LOADED ===');
    
    // Initialize all components
    initLanguageDropdown();
    initThemeToggle();
    initParticlesCanvas();
    initScrollAnimations();
    initStatsCounter();
    initStickyNav();
    initSmoothScroll();
    initParallax();
    
    // Translate page on load
    translatePage();
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('=== INITIALIZATION COMPLETE ===');
});