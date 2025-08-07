/**
 * Utility Functions
 * Common helper functions used across the application
 */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll to element
function scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Add class with animation support
function addClass(element, className, delay = 0) {
    setTimeout(() => {
        if (element) {
            element.classList.add(className);
        }
    }, delay);
}

// Remove class with animation support
function removeClass(element, className, delay = 0) {
    setTimeout(() => {
        if (element) {
            element.classList.remove(className);
        }
    }, delay);
}

// Toggle class with animation support
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// Check if element is in viewport
function isInViewport(element, threshold = 0.1) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return (vertInView && horInView);
}

// Intersection Observer for scroll animations
function createScrollObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    if ('IntersectionObserver' in window) {
        return new IntersectionObserver(callback, observerOptions);
    }
    return null;
}

// Local storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('LocalStorage not available:', error);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Cookie helpers
const cookies = {
    set: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    remove: (name) => {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
};

// Device detection
const device = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isTablet: () => {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    },
    
    isDesktop: () => {
        return !device.isMobile() && !device.isTablet();
    },
    
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Performance helpers
const performance = {
    // Image lazy loading
    lazyLoadImage: (img) => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    },
    
    // Preload images
    preloadImages: (urls) => {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },
    
    // Get page load time
    getPageLoadTime: () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            return pageLoadTime;
        }
        return null;
    }
};

// Error handling
const errorHandler = {
    log: (error, context = '') => {
        console.error(`Error${context ? ` in ${context}` : ''}:`, error);
        
        // Send to analytics or error tracking service if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message || error,
                fatal: false
            });
        }
    },
    
    handleImageError: (img) => {
        img.style.display = 'none';
        console.warn('Failed to load image:', img.src);
    }
};

// Animation helpers
const animation = {
    // Add staggered animation to elements
    stagger: (elements, className, delay = 100) => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(className);
            }, index * delay);
        });
    },
    
    // Remove animation classes after completion
    cleanup: (element, animationClass) => {
        element.addEventListener('animationend', () => {
            element.classList.remove(animationClass);
        }, { once: true });
    }
};

// URL helpers
const url = {
    // Get query parameter
    getParam: (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },
    
    // Set query parameter
    setParam: (name, value) => {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },
    
    // Remove query parameter
    removeParam: (name) => {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    }
};

// DOM ready helper
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Format functions
const format = {
    // Format number with commas
    number: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Format date
    date: (date, locale = 'en-US') => {
        return new Date(date).toLocaleDateString(locale);
    },
    
    // Truncate text
    text: (text, length = 100, suffix = '...') => {
        if (text.length <= length) return text;
        return text.substr(0, length) + suffix;
    }
};

// Accessibility helpers
const a11y = {
    // Set focus trap for modals
    trapFocus: (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                element.style.display = 'none';
            }
        });
        
        firstElement.focus();
    },
    
    // Announce to screen readers
    announce: (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// Export functions for use in other files
window.utils = {
    debounce,
    throttle,
    scrollToElement,
    addClass,
    removeClass,
    toggleClass,
    isInViewport,
    createScrollObserver,
    storage,
    cookies,
    device,
    performance,
    errorHandler,
    animation,
    url,
    domReady,
    format,
    a11y
};