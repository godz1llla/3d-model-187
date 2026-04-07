/**
 * Language Management System
 * Handles dynamic language switching and content loading
 */

/**
 * Текст из сети как UTF-8, даже если сервер отдал .txt с неверным charset в заголовке.
 * Иначе кириллица/қазақ тілі превращаются в «иероглифы».
 */
async function fetchTextUtf8(url) {
    const response = await fetch(url);
    if (!response.ok) {
        return { ok: false, status: response.status, text: '' };
    }
    const buffer = await response.arrayBuffer();
    let text = new TextDecoder('utf-8').decode(buffer);
    text = text.replace(/^\uFEFF/, '');
    return {
        ok: true,
        status: response.status,
        text
    };
}

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'kz'; // Default: Kazakh
        this.translations = {};
        this.init();
    }

    /**
     * Initialize language system
     */
    async init() {
        this.updateLanguageSwitcher();
        this.setupLanguageSwitcher();
        await this.loadCommonTranslations();
        this.applyTranslations();
    }

    /**
     * Load common translations (buttons, labels)
     */
    async loadCommonTranslations() {
        try {
            const res = await fetchTextUtf8(`data/common-${this.currentLang}.txt`);
            if (res.ok) {
                this.parseCommonTranslations(res.text);
            }
        } catch (error) {
            console.warn('Common translations file not found, using defaults');
            this.setDefaultTranslations();
        }
    }

    /**
     * Set default translations if files are missing
     */
    setDefaultTranslations() {
        const defaults = {
            kz: {
                'back': '← Артқа',
                'model-title': '3D Модель',
                'fullscreen': 'Толық экран режимі',
                'task-title': 'Есеп',
                'answer-placeholder': 'Жауапты енгізіңіз...',
                'check-btn': 'Жауапты тексеру',
                'footer-text': '© 2026 Білім беру сайты'
            },
            ru: {
                'back': '← Назад',
                'model-title': '3D Модель',
                'fullscreen': 'Полноэкранный режим',
                'task-title': 'Задача',
                'answer-placeholder': 'Введите ответ...',
                'check-btn': 'Проверить ответ',
                'footer-text': '© 2026 Образовательный сайт'
            },
            en: {
                'back': '← Back',
                'model-title': '3D Model',
                'fullscreen': 'Fullscreen Mode',
                'task-title': 'Task',
                'answer-placeholder': 'Enter answer...',
                'check-btn': 'Check Answer',
                'footer-text': '© 2026 Educational Website'
            }
        };
        this.translations = defaults[this.currentLang] || defaults.kz;
    }

    /**
     * Parse common translations from text file
     */
    parseCommonTranslations(text) {
        const lines = text.split('\n');
        this.translations = {};
        let currentKey = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                currentKey = trimmed.slice(1, -1).toLowerCase();
                this.translations[currentKey] = '';
            } else if (currentKey && trimmed) {
                this.translations[currentKey] += (this.translations[currentKey] ? '\n' : '') + trimmed;
            }
        }
    }

    /**
     * Load object-specific content
     */
    async loadObjectContent(objectId) {
        try {
            const res = await fetchTextUtf8(`data/${this.currentLang}/object${objectId}.txt`);
            if (!res.ok) {
                throw new Error(`Object ${objectId} not found for language ${this.currentLang}`);
            }
            return this.parseObjectContent(res.text);
        } catch (error) {
            console.error('Error loading object content:', error);
            return null;
        }
    }

    /**
     * Parse object content from text file
     * Expected format:
     * [TITLE]
     * Title text
     * [DESCRIPTION]
     * Description text...
     * [TASK]
     * Task text...
     * [ANSWER]
     * Answer text...
     */
    parseObjectContent(text) {
        const sections = {
            title: '',
            description: '',
            task: '',
            answer: ''
        };

        const lines = text.split('\n');
        let currentSection = null;
        let content = [];

        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                // Save previous section
                if (currentSection && content.length > 0) {
                    sections[currentSection] = content.join('\n').trim();
                }
                // Start new section
                const sectionName = trimmed.slice(1, -1).toLowerCase();
                currentSection = sectionName;
                content = [];
            } else if (currentSection && trimmed) {
                content.push(trimmed);
            }
        }

        // Save last section
        if (currentSection && content.length > 0) {
            sections[currentSection] = content.join('\n').trim();
        }

        return sections;
    }

    /**
     * Switch language
     */
    async switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        await this.loadCommonTranslations();
        this.updateLanguageSwitcher();
        this.applyTranslations();
        
        // Reload page content if on object page
        if (window.location.pathname.includes('object.html')) {
            const objectId = this.getObjectIdFromUrl();
            if (objectId && window.loadObjectPage) {
                await window.loadObjectPage(objectId);
            }
        } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
            // Reload main page content
            if (window.loadHeroContent) {
                await window.loadHeroContent();
            }
            if (window.loadObjectsGrid) {
                await window.loadObjectsGrid();
            }
        }
    }

    /**
     * Get current language
     */
    getCurrentLang() {
        return this.currentLang;
    }

    /**
     * Get translation by key
     */
    getTranslation(key) {
        return this.translations[key] || key;
    }

    /**
     * Update language switcher UI
     */
    updateLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Apply translations to elements with IDs
     */
    applyTranslations() {
        // Update common elements
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.textContent = this.getTranslation('back');
        }

        const modelTitle = document.getElementById('modelTitle');
        if (modelTitle) {
            modelTitle.textContent = this.getTranslation('model-title');
        }

        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = this.getTranslation('fullscreen');
        }

        const taskTitle = document.getElementById('taskTitle');
        if (taskTitle) {
            taskTitle.textContent = this.getTranslation('task-title');
        }

        const answerInput = document.getElementById('answerInput');
        if (answerInput) {
            answerInput.placeholder = this.getTranslation('answer-placeholder');
        }

        const checkBtn = document.getElementById('checkBtn');
        if (checkBtn) {
            checkBtn.textContent = this.getTranslation('check-btn');
        }

        const footerText = document.getElementById('footerText');
        if (footerText) {
            footerText.textContent = this.getTranslation('footer-text');
        }
    }

    /**
     * Setup language switcher event listeners
     */
    setupLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    /**
     * Get object ID from URL
     */
    getObjectIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }
}

// Initialize global language manager
const langManager = new LanguageManager();
