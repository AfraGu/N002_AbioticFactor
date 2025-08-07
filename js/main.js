/**
 * Main JavaScript for Abiotic Factor Guide
 * Handles all interactive functionality according to design specifications
 */

class AbioticFactorGuide {
    constructor() {
        this.isInitialized = false;
        this.scrollObserver = null;
        this.isModalOpen = false;
        
        // Map data for modal display
        this.mapData = {
            'level1': {
                title: 'Level 1 - Entry Level',
                image: 'images/Abiotic-Factor-Guide Map-01 Level1.png',
                description: 'Office Sector Level 1 - Starting area with basic facilities'
            },
            'level2': {
                title: 'Level 2 - Research Labs',
                image: 'images/Abiotic-Factor-Guide Map-02 Level2.png',
                description: 'Office Sector Level 2 - Advanced research facilities'
            },
            'level3': {
                title: 'Level 3 - Deep Labs',
                image: 'images/Abiotic-Factor-Guide Map-03 Level3.png',
                description: 'Office Sector Level 3 - High-security research areas'
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core functionality
            this.setupEventListeners();
            this.initScrollAnimations();
            this.initNavigationEffects();
            this.initMapSystem();
            this.initImageHandling();
            this.initScrollProgress();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Add page loaded class for animations
            utils.addClass(document.body, 'page-loaded');
            
            console.log('Abiotic Factor Guide initialized successfully');
            
        } catch (error) {
            utils.errorHandler.log(error, 'Application initialization');
        }
    }
    
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleHeaderScroll();
            this.updateScrollProgress();
        }, 16));
        
        // Window resize
        window.addEventListener('resize', utils.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Navigation links - smooth scroll
        document.querySelectorAll('.main-nav a, .footer-links a').forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);
                });
            }
        });
        
        // Map cards
        document.querySelectorAll('.map-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const mapId = this.extractMapId(card.getAttribute('onclick'));
                this.openMapModal(mapId);
            });
            
            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const mapId = this.extractMapId(card.getAttribute('onclick'));
                    this.openMapModal(mapId);
                }
            });
        });
        
        // Close map modal
        const closeMapModal = document.getElementById('closeMapModal');
        if (closeMapModal) {
            closeMapModal.addEventListener('click', () => {
                this.closeMapModal();
            });
        }
        
        // Close modal on backdrop click
        const mapModal = document.getElementById('mapModal');
        if (mapModal) {
            mapModal.addEventListener('click', (e) => {
                if (e.target === mapModal) {
                    this.closeMapModal();
                }
            });
        }
        
        // Play button functionality
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                // In a real implementation, this would open the video
                alert('Video functionality would be implemented here');
            });
        }
        
        // YouTube link
        const youtubeLink = document.querySelector('.youtube-link');
        if (youtubeLink) {
            youtubeLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://www.youtube.com', '_blank');
            });
        }
        
        // Carousel buttons outside class
// Detailed Walkthrough nav switching
window.addEventListener('DOMContentLoaded',()=>{
  const navItems=document.querySelectorAll('.dw-nav-item');
  const panels=document.querySelectorAll('.dw-panel');
  navItems.forEach(btn=>{
    btn.addEventListener('click',()=>{
      navItems.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target=btn.dataset.target;
      panels.forEach(p=>p.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });
});

// Carousel buttons outside class - 支持多个轮播
window.addEventListener('DOMContentLoaded', () => {
    // Main Process 轮播
    const processTrack = document.querySelector('.main-process-section .carousel-track');
    if (processTrack) {
        const processPrevBtn = document.querySelector('.main-process-section .carousel-btn.prev');
        const processNextBtn = document.querySelector('.main-process-section .carousel-btn.next');
        
        processPrevBtn?.addEventListener('click', () => processTrack.scrollBy({left: -320, behavior: 'smooth'}));
        processNextBtn?.addEventListener('click', () => processTrack.scrollBy({left: 320, behavior: 'smooth'}));
    }
    
    // Valuation Reviews 轮播
    const reviewsTrack = document.querySelector('.reviews-section .carousel-track');
    if (reviewsTrack) {
        const reviewsPrevBtn = document.querySelector('.reviews-section .carousel-btn.prev');
        const reviewsNextBtn = document.querySelector('.reviews-section .carousel-btn.next');
        
        reviewsPrevBtn?.addEventListener('click', () => reviewsTrack.scrollBy({left: -340, behavior: 'smooth'}));
        reviewsNextBtn?.addEventListener('click', () => reviewsTrack.scrollBy({left: 340, behavior: 'smooth'}));
    }
});

// Carousel buttons (inside class for legacy)
        const carouselTrack = document.querySelector('.carousel-track');
        if (carouselTrack) {
            document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
                carouselTrack.scrollBy({ left: -320, behavior: 'smooth' });
            });
            document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
                carouselTrack.scrollBy({ left: 320, behavior: 'smooth' });
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    handleHeaderScroll() {
        const header = document.querySelector('.fixed-header');
        if (!header) return;
        
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            utils.addClass(header, 'scrolled');
        } else {
            utils.removeClass(header, 'scrolled');
        }
    }
    
    updateScrollProgress() {
        let scrollProgress = document.querySelector('.scroll-progress');
        if (!scrollProgress) {
            // Create scroll progress indicator
            scrollProgress = document.createElement('div');
            scrollProgress.className = 'scroll-progress';
            document.body.appendChild(scrollProgress);
        }
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        scrollProgress.style.width = scrolled + '%';
    }
    
    initScrollProgress() {
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    handleResize() {
        // Update any size-dependent calculations
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
            this.initScrollAnimations();
        }
    }
    
    initScrollAnimations() {
        if (!window.IntersectionObserver) {
            return;
        }
        
        // Create intersection observer for scroll animations
        this.scrollObserver = utils.createScrollObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    utils.addClass(element, 'animated');
                    
                    // Special handling for specific sections
                    if (element.classList.contains('process-flow')) {
                        this.animateProcessCards(element);
                    } else if (element.classList.contains('map-grid')) {
                        this.animateMapCards(element);
                    } else if (element.classList.contains('reviews-grid')) {
                        this.animateReviewCards(element);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.process-flow, .map-grid, .reviews-grid, .walkthrough-content, .intro-content'
        );
        
        animateElements.forEach(element => {
            utils.addClass(element, 'animate-on-scroll');
            this.scrollObserver.observe(element);
        });
    }
    
    animateProcessCards(container) {
        const cards = container.querySelectorAll('.process-step');
        utils.animation.stagger(Array.from(cards), 'fade-in-up', 100);
    }
    
    animateMapCards(container) {
        const cards = container.querySelectorAll('.map-card');
        utils.animation.stagger(Array.from(cards), 'scale-in', 150);
    }
    
    animateReviewCards(container) {
        const cards = container.querySelectorAll('.review-card');
        utils.animation.stagger(Array.from(cards), 'fade-in-up', 200);
    }
    
    initNavigationEffects() {
        // Add active nav link highlighting
        const navLinks = document.querySelectorAll('.main-nav a');
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', utils.throttle(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                utils.removeClass(link, 'active');
                if (link.getAttribute('href') === '#' + current) {
                    utils.addClass(link, 'active');
                }
            });
        }, 100));
    }
    
    initMapSystem() {
        // Map modal functionality is handled in setupEventListeners
        // This method can be extended for additional map features
    }
    
    initImageHandling() {
        // Add error handling for images
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                utils.addClass(img, 'loaded');
            });
            
            img.addEventListener('error', () => {
                utils.errorHandler.handleImageError(img);
            });
        });
        
        // Lazy loading for images (if needed)
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length > 0) {
                const imageObserver = utils.createScrollObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            utils.performance.lazyLoadImage(img);
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }
    }
    
    // Utility method for extracting map ID from onclick attributes
    extractMapId(onclickValue) {
        if (!onclickValue) return '';
        const match = onclickValue.match(/openMapModal\('([^']+)'\)/);
        return match ? match[1] : '';
    }
    
    // Public methods called from HTML
    scrollToSection(sectionId) {
        utils.scrollToElement(sectionId, 80);
        
        // Track navigation
        if (window.gtag) {
            window.gtag('event', 'navigation', {
                section: sectionId
            });
        }
    }
    
    openMapModal(mapId) {
        const modal = document.getElementById('mapModal');
        const modalTitle = document.getElementById('mapModalTitle');
        const modalImage = document.getElementById('mapModalImage');
        
        if (!modal || !this.mapData[mapId]) return;
        
        const mapInfo = this.mapData[mapId];
        
        // Update modal content
        modalTitle.textContent = mapInfo.title;
        modalImage.src = mapInfo.image;
        modalImage.alt = mapInfo.title;
        
        // Show modal
        modal.style.display = 'flex';
        utils.addClass(modal, 'fade-in');
        this.isModalOpen = true;
        
        // Set focus trap
        utils.a11y.trapFocus(modal);
        
        // Track map view
        if (window.gtag) {
            window.gtag('event', 'map_view', {
                map_id: mapId,
                map_title: mapInfo.title
            });
        }
    }
    
    closeMapModal() {
        const modal = document.getElementById('mapModal');
        if (modal) {
            modal.style.display = 'none';
            utils.removeClass(modal, 'fade-in');
            this.isModalOpen = false;
        }
    }
    
    closeAllModals() {
        this.closeMapModal();
        
        const languageModal = document.getElementById('languageModal');
        if (languageModal && languageModal.style.display !== 'none') {
            languageModal.style.display = 'none';
        }
        
        this.isModalOpen = false;
    }
    
    // Public API
    isReady() {
        return this.isInitialized;
    }
}

// Global functions for HTML onclick attributes
window.scrollToSection = function(sectionId) {
    if (window.abioticGuide) {
        window.abioticGuide.scrollToSection(sectionId);
    }
};

window.openMapModal = function(mapId) {
    if (window.abioticGuide) {
        window.abioticGuide.openMapModal(mapId);
    }
};

// Initialize application
utils.domReady(() => {
    window.abioticGuide = new AbioticFactorGuide();
});