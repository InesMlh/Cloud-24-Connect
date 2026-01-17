// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentLang = 'en';
let mouseX = 0;
let mouseY = 0;

// ==========================================
// LANGUAGE & TRANSLATIONS MODULE
// ==========================================
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
    if (typeof translations === 'undefined') return;
    
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
// MOUSE GRADIENT EFFECT
// ==========================================
function initMouseGradient() {
    const mouseGradient = document.getElementById('mouse-gradient');
    if (!mouseGradient) return;
    
    let gradientX = 0;
    let gradientY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseGradient.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        mouseGradient.style.opacity = '0';
    });

    function animateGradient() {
        const dx = mouseX - gradientX;
        const dy = mouseY - gradientY;
        
        gradientX += dx * 0.1;
        gradientY += dy * 0.1;
        
        mouseGradient.style.left = gradientX + 'px';
        mouseGradient.style.top = gradientY + 'px';
        
        requestAnimationFrame(animateGradient);
    }

    animateGradient();
}

// ==========================================
// PARTICLES ANIMATION
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
        
        // Mouse repulsion effect
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
            const force = (200 - dist) / 200;
            this.x -= dx * force * 0.08;
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

function initParticlesCanvas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    
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
        
        // Draw connections
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
function initThemeToggle() {
    const themeCheckbox = document.querySelector('.theme-switch__checkbox');
    if (!themeCheckbox) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeCheckbox.checked = currentTheme === 'light';
    
    themeCheckbox.addEventListener('change', function() {
        const theme = this.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'flex';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
            }
        });
        
        // Reset category filter if searching
        if (searchTerm.length > 0) {
            const categoryBtns = document.querySelectorAll('.category-btn');
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.category-btn[data-category="all"]')?.classList.add('active');
        }
    });
}

// ==========================================
// CATEGORY FILTER
// ==========================================
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('searchInput');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Filter cards
            blogCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.5s forwards';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
            
            // Clear search when filtering by category
            if (searchInput) searchInput.value = '';
        });
    });
}

// ==========================================
// NEWSLETTER FORM
// ==========================================
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
        const submitBtn = newsletterForm.querySelector('.subscribe-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Subscribing...</span>';
        submitBtn.disabled = true;
        
        // Form will be handled by Web3Forms
        // After submission, show success message
        setTimeout(() => {
            submitBtn.innerHTML = `
                <span>Subscribed!</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
}

// ==========================================
// LOAD MORE FUNCTIONALITY
// ==========================================
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!loadMoreBtn) return;
    
    let visibleCards = 6;
    
    // Initially show only first 6 cards
    blogCards.forEach((card, index) => {
        if (index >= visibleCards) {
            card.style.display = 'none';
            card.dataset.hidden = 'true';
        }
    });
    
    if (blogCards.length <= visibleCards) {
        loadMoreBtn.style.display = 'none';
    }
    
    loadMoreBtn.addEventListener('click', () => {
        const allCards = Array.from(blogCards);
        const hiddenCards = allCards.filter(card => card.dataset.hidden === 'true');
        
        // Show next 3 cards
        const cardsToShow = hiddenCards.slice(0, 3);
        cardsToShow.forEach(card => {
            card.style.display = 'flex';
            card.dataset.hidden = 'false';
            card.style.animation = 'fadeInUp 0.5s forwards';
        });
        
        visibleCards += 3;
        
        // Hide button if all cards are visible
        const remainingHidden = allCards.filter(card => card.dataset.hidden === 'true');
        if (remainingHidden.length === 0) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe blog cards
    document.querySelectorAll('.blog-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe featured post
    const featuredPost = document.querySelector('.featured-grid');
    if (featuredPost) {
        featuredPost.style.opacity = '0';
        featuredPost.style.transform = 'translateY(30px)';
        featuredPost.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(featuredPost);
    }

    // Observe newsletter section
    const newsletterSection = document.querySelector('.newsletter-content');
    if (newsletterSection) {
        newsletterSection.style.opacity = '0';
        newsletterSection.style.transform = 'translateY(30px)';
        newsletterSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(newsletterSection);
    }
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
function initKeyboardShortcuts() {
    const searchInput = document.getElementById('searchInput');
    const blogCards = document.querySelectorAll('.blog-card');
    
    document.addEventListener('keydown', (e) => {
        // Press '/' to focus search
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Press 'Escape' to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            
            blogCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.remove('hidden');
            });
        }
    });
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-light) 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
        transition: all 0.3s;
        z-index: 999;
    `;

    scrollToTopBtn.querySelector('svg').style.cssText = `
        width: 24px;
        height: 24px;
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-5px)';
        scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.3)';
    });
}

// ==========================================
// INITIALIZE EVERYTHING ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize translations
    initTranslations();
    initLanguageDropdown();
    
    // Initialize visual effects
    initMouseGradient();
    initParticlesCanvas();
    initThemeToggle();
    
    // Initialize functionality
    initSearch();
    initCategoryFilter();
    initNewsletterForm();
    initLoadMore();
    initScrollAnimations();
    initKeyboardShortcuts();
    initScrollToTop();
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Console message
    console.log('%c🎨 Blog Page Loaded Successfully!', 'background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;');
    console.log('%cKeyboard Shortcuts:', 'font-weight: bold; font-size: 14px; margin-top: 10px;');
    console.log('  / - Focus search bar');
    console.log('  Esc - Clear search and blur input');
});