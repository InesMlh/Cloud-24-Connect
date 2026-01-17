// ==========================================
// LANGUAGE & TRANSLATIONS
// ==========================================

let currentLang = 'en';

function initLanguageDropdown() {
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (!langOptions.length || !currentLangSpan) return;
    
    updateActiveLang();
    
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

function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

function initTranslations() {
    document.documentElement.lang = currentLang;
    updateTranslations();
}

// ==========================================
// PARTICLES ANIMATION - MATCHING HOMEPAGE
// ==========================================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

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

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 150;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
        );
        
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(canvas));
        }
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Update canvas height on content changes
    const observer = new MutationObserver(() => {
        const newHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            window.innerHeight
        );
        if (Math.abs(canvas.height - newHeight) > 50) {
            resizeCanvas();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
    
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
// THEME TOGGLE
// ==========================================

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

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Initialize translations
    initTranslations();
    
    // Initialize language dropdown
    initLanguageDropdown();
    
    // Initialize Particles
    initParticles();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Setup theme toggle
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
    
    // Observe service cards for scroll animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(card);
    });
});