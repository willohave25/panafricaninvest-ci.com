/* =============================================
   PANAFRICAN INVEST - JavaScript Principal
   Menu mobile, Carousel témoignages, Scroll header
   W2K-Digital 2025
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    /* =============================================
       1. HEADER SCROLL EFFECT
       ============================================= */
    
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();
    
    /* =============================================
       2. MENU MOBILE
       ============================================= */
    
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    function openMobileMenu() {
        hamburger.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Gestion sous-menus mobile
    mobileDropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const parent = this.parentElement;
            const submenu = parent.querySelector('.mobile-dropdown-menu');
            
            if (submenu) {
                submenu.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    });
    
    // Fermeture avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    /* =============================================
       3. CAROUSEL TÉMOIGNAGES
       ============================================= */
    
    const carousel = document.getElementById('temoignages-carousel');
    
    if (carousel) {
        const track = document.getElementById('carousel-track');
        const cards = track.querySelectorAll('.temoignage-card');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const dotsContainer = document.getElementById('carousel-dots');
        
        let currentIndex = 0;
        let visibleCards = 1;
        let autoplayInterval;
        const autoplayDelay = 5000;
        
        // Calcul cartes visibles selon largeur écran
        function calculateVisibleCards() {
            const width = window.innerWidth;
            if (width >= 1025) {
                visibleCards = 3;
            } else if (width >= 769) {
                visibleCards = 2;
            } else {
                visibleCards = 1;
            }
        }
        
        // Création des dots navigation
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(cards.length / visibleCards);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', function() {
                    goToSlide(i * visibleCards);
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        // Mise à jour dots actifs
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            const activeDotIndex = Math.floor(currentIndex / visibleCards);
            
            dots.forEach(function(dot, index) {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        }
        
        // Déplacement carousel
        function goToSlide(index) {
            const maxIndex = cards.length - visibleCards;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            
            const cardWidth = 100 / visibleCards;
            const offset = currentIndex * cardWidth;
            track.style.transform = 'translateX(-' + offset + '%)';
            
            updateDots();
        }
        
        // Navigation précédent/suivant
        function goToPrev() {
            goToSlide(currentIndex - visibleCards);
        }
        
        function goToNext() {
            const maxIndex = cards.length - visibleCards;
            if (currentIndex >= maxIndex) {
                goToSlide(0);
            } else {
                goToSlide(currentIndex + visibleCards);
            }
        }
        
        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(goToNext, autoplayDelay);
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                stopAutoplay();
                goToPrev();
                startAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                stopAutoplay();
                goToNext();
                startAutoplay();
            });
        }
        
        // Pause au survol
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Gestion touch/swipe mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        
        track.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (diff > swipeThreshold) {
                goToNext();
            } else if (diff < -swipeThreshold) {
                goToPrev();
            }
        }
        
        // Redimensionnement fenêtre
        window.addEventListener('resize', function() {
            calculateVisibleCards();
            createDots();
            goToSlide(currentIndex);
        });
        
        // Initialisation
        calculateVisibleCards();
        createDots();
        startAutoplay();
    }
    
    /* =============================================
       4. SMOOTH SCROLL LIENS ANCRES
       ============================================= */
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermeture menu mobile si ouvert
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    /* =============================================
       5. FORMULAIRE CONTACT (Validation basique)
       ============================================= */
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            let isValid = true;
            let firstError = null;
            
            // Validation champs requis
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(function(field) {
                removeError(field);
                
                if (!field.value.trim()) {
                    showError(field, 'Ce champ est requis');
                    isValid = false;
                    if (!firstError) firstError = field;
                }
            });
            
            // Validation email
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    showError(emailField, 'Veuillez entrer un email valide');
                    isValid = false;
                    if (!firstError) firstError = emailField;
                }
            }
            
            // Validation téléphone (format Côte d'Ivoire)
            const phoneField = this.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value) {
                const phoneValue = phoneField.value.replace(/\s/g, '');
                const phoneRegex = /^(\+225)?[0-9]{10}$/;
                if (!phoneRegex.test(phoneValue)) {
                    showError(phoneField, 'Format : +225 XXXXXXXXXX');
                    isValid = false;
                    if (!firstError) firstError = phoneField;
                }
            }
            
            if (isValid) {
                // Simulation envoi (remplacer par vrai backend)
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(function() {
                    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else if (firstError) {
                firstError.focus();
            }
        });
        
        function showError(field, message) {
            field.classList.add('error');
            
            const errorEl = document.createElement('span');
            errorEl.classList.add('form-error');
            errorEl.textContent = message;
            errorEl.style.color = '#DC3545';
            errorEl.style.fontSize = '13px';
            errorEl.style.marginTop = '4px';
            errorEl.style.display = 'block';
            
            field.parentNode.appendChild(errorEl);
        }
        
        function removeError(field) {
            field.classList.remove('error');
            const errorEl = field.parentNode.querySelector('.form-error');
            if (errorEl) {
                errorEl.remove();
            }
        }
        
        // Suppression erreur à la saisie
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(function(input) {
            input.addEventListener('input', function() {
                removeError(this);
            });
        });
    }
    
    /* =============================================
       6. ANIMATION AU SCROLL (Intersection Observer)
       ============================================= */
    
    const animatedElements = document.querySelectorAll('.service-card, .avantage-card, .valeur-card, .mv-card');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
    
});
