/**
 * Multi-language Support System
 * Handles language switching and content translation
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.supportedLanguages = [
            'en',      // English
            'fr',      // French
            'de',      // German
            'ru',      // Russian
            'es',      // Spanish
            'es-la',   // Latin American Spanish
            'ja',      // Japanese
            'ko',      // Korean
            'pt-br',   // Brazilian Portuguese
            'zh'       // Simplified Chinese
        ];
        
        this.languageNames = {
            'en': 'English',
            'fr': 'Français',
            'de': 'Deutsch',
            'ru': 'РУССКИЙ',
            'es': 'ESPAÑOL',
            'es-la': 'ESPAÑOL LATINOAMÉRICA',
            'ja': '日本語',
            'ko': '한국어',
            'pt-br': 'Português Brasileiro',
            'zh': '简体中文'
        };
        
        this.init();
    }
    
    async init() {
        // Detect user's preferred language
        this.detectLanguage();
        
        // Load the current language
        await this.loadLanguage(this.currentLanguage);
        
        // Apply translations with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.applyTranslations();
        }, 100);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateLanguageUI();
    }
    
    detectLanguage() {
        // Check URL path first (e.g., /zh/, /ja/, /fr/)
        const pathLang = this.detectLanguageFromPath();
        if (pathLang && this.supportedLanguages.includes(pathLang)) {
            this.currentLanguage = pathLang;
            return;
        }
        
        // Check localStorage
        const savedLang = utils.storage.get('preferred_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.languages[0];
        const langCode = browserLang.toLowerCase();
        
        // Try exact match first
        if (this.supportedLanguages.includes(langCode)) {
            this.currentLanguage = langCode;
            return;
        }
        
        // Try partial match (e.g., 'en-US' -> 'en')
        const partialMatch = this.supportedLanguages.find(lang => 
            langCode.startsWith(lang) || lang.startsWith(langCode.split('-')[0])
        );
        
        if (partialMatch) {
            this.currentLanguage = partialMatch;
            return;
        }
        
        // Default to English
        this.currentLanguage = 'en';
    }
    
    detectLanguageFromPath() {
        const path = window.location.pathname;
        
        // Root path defaults to English
        if (path === '/' || path === '') {
            return 'en';
        }
        
        // Match subdirectory format: /lang/ or /lang (with or without trailing slash)
        const langMatch = path.match(/^\/([^\/]+)\/?/);
        if (langMatch) {
            const langCode = langMatch[1];
            // Return the language code if it's supported
            if (this.supportedLanguages.includes(langCode)) {
                return langCode;
            }
        }
        
        // If no valid language found in path, default to English
        return 'en';
    }
    
    async loadLanguage(langCode) {
        if (this.translations[langCode]) {
            return this.translations[langCode];
        }
        
        try {
            const response = await fetch(`/languages/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const translations = await response.json();
            this.translations[langCode] = translations;
            return translations;
        } catch (error) {
            console.warn(`Failed to load language ${langCode}:`, error);
            
            // Try to load fallback language
            if (langCode !== this.fallbackLanguage) {
                return this.loadLanguage(this.fallbackLanguage);
            }
            
            return {};
        }
    }
    
    async changeLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            console.warn(`Unsupported language: ${langCode}`);
            return;
        }
        
        if (langCode === this.currentLanguage) {
            return;
        }
        
        // Save preference before redirect
        utils.storage.set('preferred_language', langCode);
        
        // Redirect to appropriate URL path
        this.redirectToLanguage(langCode);
    }
    
    redirectToLanguage(langCode) {
        const currentPath = window.location.pathname;
        let newPath;
        
        if (langCode === 'en') {
            // English uses root path
            // Remove language prefix if exists
            const cleanPath = currentPath.replace(/^\/[^\/]+(\/.*)$/, '$1') || '/';
            newPath = cleanPath === '/' ? '/' : cleanPath;
        } else {
            // Other languages use subdirectory
            // Remove existing language prefix if exists, then add new one
            const cleanPath = currentPath.replace(/^\/[^\/]+(\/.*)$/, '$1') || '/';
            newPath = `/${langCode}${cleanPath === '/' ? '/' : cleanPath}`;
        }
        
        // Preserve query parameters and hash
        const search = window.location.search;
        const hash = window.location.hash;
        
        // Redirect to new URL
        window.location.href = newPath + search + hash;
    }
    
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        const currentTranslations = this.translations[this.currentLanguage] || {};
        const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
        
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = currentTranslations[key] || fallbackTranslations[key] || key;
            
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else if (element.hasAttribute('aria-label')) {
                element.setAttribute('aria-label', translation);
            } else {
                element.textContent = translation;
            }
        });
        
        // Update meta tags
        this.updateMetaTags();
    }
    
    updateMetaTags() {
        const currentTranslations = this.translations[this.currentLanguage] || {};
        const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
        
        // Update title
        const titleKey = 'page_title';
        const title = currentTranslations[titleKey] || fallbackTranslations[titleKey];
        if (title) {
            document.title = title;
        }
        
        // Update meta description
        const descKey = 'page_description';
        const description = currentTranslations[descKey] || fallbackTranslations[descKey];
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = description;
            }
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) {
            ogTitle.content = title;
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && description) {
            ogDesc.content = description;
        }
    }
    
    setupEventListeners() {
        // Language toggle button
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.showLanguageModal();
            });
        }
        
        // Language modal
        const languageModal = document.getElementById('languageModal');
        const closeModal = document.getElementById('closeLanguageModal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.hideLanguageModal();
            });
        }
        
        if (languageModal) {
            languageModal.addEventListener('click', (e) => {
                if (e.target === languageModal) {
                    this.hideLanguageModal();
                }
            });
        }
        
        // Language selection buttons
        const languageButtons = document.querySelectorAll('.language-btn, .footer-lang-btn');
        languageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const langCode = e.target.dataset.lang;
                if (langCode) {
                    this.changeLanguage(langCode);
                    this.hideLanguageModal();
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + L to open language modal
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                this.showLanguageModal();
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.hideLanguageModal();
            }
        });
    }
    
    showLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.style.display = 'flex';
            utils.addClass(modal, 'fade-in');
            
            // Set focus trap
            utils.a11y.trapFocus(modal);
        }
    }
    
    hideLanguageModal() {
        const modal = document.getElementById('languageModal');
        if (modal) {
            modal.style.display = 'none';
            utils.removeClass(modal, 'fade-in');
        }
    }
    
    updateLanguageUI() {
        // Update current language display
        // Display current language name on the toggle button
        const currentLangDisplay = document.getElementById('languageToggle');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = this.getLanguageName(this.currentLanguage);
        }
        
        // Update active language button
        const allLangButtons = document.querySelectorAll('.language-btn, .footer-lang-btn');
        allLangButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.lang === this.currentLanguage) {
                button.classList.add('active');
            }
        });
    }
    
    showLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
            utils.addClass(indicator, 'fade-in');
        }
    }
    
    hideLoadingIndicator() {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            utils.addClass(indicator, 'fade-out');
            setTimeout(() => {
                indicator.style.display = 'none';
                utils.removeClass(indicator, 'fade-out');
            }, 300);
        }
    }
    
    // Get translation for a specific key
    t(key, params = {}) {
        const currentTranslations = this.translations[this.currentLanguage] || {};
        const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
        
        let translation = currentTranslations[key] || fallbackTranslations[key] || key;
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{{${param}}}`, params[param]);
        });
        
        return translation;
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get supported languages
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
    
    // Get language name
    getLanguageName(langCode) {
        return this.languageNames[langCode] || langCode;
    }
    
    // Check if RTL language
    isRTL(langCode = this.currentLanguage) {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(langCode);
    }
    
    // Update page direction for RTL languages
    updateDirection() {
        document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    }
}

// Initialize language manager when DOM is ready
utils.domReady(() => {
    window.languageManager = new LanguageManager();
});