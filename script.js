import translations from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'it';

    // Language Switching Logic
    const langSelector = document.querySelector('.lang-selector');
    const langToggle = document.querySelector('.lang-toggle');
    const currentLangDisplay = document.querySelector('.current-lang');
    const langBtns = document.querySelectorAll('.lang-btn');
    
    // Toggle dropdown
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langSelector.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langSelector.classList.remove('active');
    });
    
    function updateLanguage(lang) {
        currentLang = lang;
        
        // Update current lang display
        if (currentLangDisplay) {
            currentLangDisplay.textContent = lang.toUpperCase();
        }
        
        // Update active button
        langBtns.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholders/alt text if needed
        document.querySelectorAll('img').forEach(img => {
            if (img.dataset.i18nAlt) {
                const key = img.dataset.i18nAlt;
                if (translations[lang][key]) {
                    img.alt = translations[lang][key];
                }
            }
        });

        // Save preference
        localStorage.setItem('vedendo_lang', lang);
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.dataset.lang);
        });
    });

    // Initialize with saved or default language
    const savedLang = localStorage.getItem('vedendo_lang');
    if (savedLang && translations[savedLang]) {
        updateLanguage(savedLang);
    } else {
        updateLanguage('it');
    }

    // Mobile Menu Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav-overlay';
    mobileNav.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        z-index: 2000;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    `;
    
    const navLinks = document.querySelector('nav').cloneNode(true);
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.alignItems = 'center';
    navLinks.style.fontSize = '1.5rem';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; font-size: 2rem; background: none; border: none; cursor: pointer;';
    
    mobileNav.appendChild(closeBtn);
    mobileNav.appendChild(navLinks);
    document.body.appendChild(mobileNav);

    menuToggle.addEventListener('click', () => {
        mobileNav.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        mobileNav.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // Image loading fade-in
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});
