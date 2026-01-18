/**
 * Multi-Theme System
 * 4 Themes: Cyberpunk, Ocean, Forest, Sunset
 * DROPDOWN VERSION - Click to open list
 */

(function () {
    'use strict';

    const THEMES = {
        cyberpunk: {
            name: 'Cyberpunk',
            icon: '🦀',
            colors: ['#a855f7', '#ec4899', '#06b6d4']
        },
        ocean: {
            name: 'Ocean',
            icon: '🌊',
            colors: ['#00d4ff', '#ffd700', '#4fc3f7']
        },
        forest: {
            name: 'Forest',
            icon: '🌲',
            colors: ['#52c41a', '#ff8c42', '#f5e6d3']
        },
        sunset: {
            name: 'Sunset',
            icon: '🌅',
            colors: ['#ff6b35', '#ff4757', '#ffd93d']
        }
    };

    const CONFIG = {
        storageKey: 'nexus_color_theme',
        defaultTheme: 'cyberpunk'
    };

    function injectStyles() {
        const styles = `
            /* Theme Picker - Navbar Style */
            .theme-picker {
                position: relative;
                margin-right: 12px;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .theme-toggle-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
            }

            .theme-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.05);
            }

            .theme-dropdown {
                position: absolute;
                top: 120%;
                right: 0;
                min-width: 160px;
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 6px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-5px);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                z-index: 1000;
            }

            .theme-picker.active .theme-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            /* Each theme option in the list */
            .theme-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .theme-option:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .theme-option.active {
                background: rgba(255, 255, 255, 0.1);
            }

            .theme-option.active .theme-option-name {
                color: #ffffff;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'theme-picker-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function getStoredTheme() {
        return localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultTheme;
    }

    function setTheme(themeName) {
        if (!THEMES[themeName]) {
            console.error('Unknown theme:', themeName);
            return;
        }

        localStorage.setItem(CONFIG.storageKey, themeName);
        document.documentElement.setAttribute('data-theme', themeName);

        // Dispatch custom event for WASM/other integrations
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: themeName, colors: THEMES[themeName].colors }
        }));

        updateUI(themeName);
    }

    function updateUI(activeTheme) {
        // Update toggle button icon
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = THEMES[activeTheme].icon;
        }

        // Update active states in dropdown
        document.querySelectorAll('.theme-option').forEach(option => {
            const theme = option.dataset.theme;
            if (theme === activeTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    function createThemeOption(key, data, isActive) {
        const colorDots = data.colors.map(color =>
            `<span class="theme-color-dot" style="background: ${color};"></span>`
        ).join('');

        return `
            <div class="theme-option ${isActive ? 'active' : ''}" data-theme="${key}">
                <span class="theme-option-icon">${data.icon}</span>
                <span class="theme-option-name">${data.name}</span>
                <div class="theme-option-colors">${colorDots}</div>
            </div>
        `;
    }

    function createThemePicker() {
        const picker = document.createElement('div');
        picker.className = 'theme-picker';
        picker.id = 'theme-picker';

        const currentTheme = getStoredTheme();

        // Create theme options
        const themeOptions = Object.entries(THEMES)
            .map(([key, data]) => createThemeOption(key, data, currentTheme === key))
            .join('');

        picker.innerHTML = `
            <button class="theme-toggle-btn" id="theme-toggle-btn" title="Changer de thème">
                ${THEMES[currentTheme].icon}
            </button>
            <div class="theme-dropdown">
                ${themeOptions}
            </div>
        `;

        // Inject into Navbar CTA if it exists
        const navbarCta = document.querySelector('.navbar-cta');
        if (navbarCta) {
            // Insert after language switcher (if exists) or at the beginning
            const langSwitcher = navbarCta.querySelector('.lang-switcher');
            if (langSwitcher) {
                navbarCta.insertBefore(picker, langSwitcher.nextSibling);
            } else {
                navbarCta.insertBefore(picker, navbarCta.firstChild);
            }
        } else {
            // Fallback
            picker.style.position = 'fixed';
            picker.style.bottom = '20px';
            picker.style.left = '20px';
            document.body.appendChild(picker);
        }

        // Toggle dropdown on button click
        const toggleBtn = picker.querySelector('.theme-toggle-btn');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            picker.classList.toggle('active');
        });

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target)) {
                picker.classList.remove('active');
            }
        });

        // Handle theme option clicks
        picker.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                setTheme(theme);
                picker.classList.remove('active');
            });
        });
    }

    function init() {
        injectStyles();
        createThemePicker();

        // Apply stored theme
        const storedTheme = getStoredTheme();
        setTheme(storedTheme);

        console.log('🎨 Multi-theme system loaded (dropdown version)');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.setTheme = setTheme;
})();
