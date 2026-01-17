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
    // Update text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            // Preserve HTML for addresses
            if (key === 'contact.location.address') {
                el.innerHTML = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    
    // Update placeholders
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
// PARTICLES ANIMATION - FIXED FULL SCREEN
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
        // FIXED: Use window dimensions for full screen coverage
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
// FAQ TOGGLE
// ==========================================

function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        faqItem.classList.add('active');
    }

    lucide.createIcons();
}

// ==========================================
// FORM SUBMISSION
// ==========================================

function initFormSubmission() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(form);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success message
                    submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
                    // Reset form
                    form.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        lucide.createIcons();
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.innerHTML = '<span>Error - Try Again</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    lucide.createIcons();
                }, 3000);
            }
        });
    }
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
    
    // Initialize form submission
    initFormSubmission();
    
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
});