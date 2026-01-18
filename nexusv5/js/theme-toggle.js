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
            /* Theme Picker - Dropdown Style */
            .theme-picker {
                position: fixed;
                top: 100px;
                left: 200px;
                z-index: 9991;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            /* Main toggle button - shows current theme */
            .theme-toggle-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: rgba(15, 15, 20, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .theme-toggle-btn:hover {
                background: rgba(124, 58, 237, 0.2);
                border-color: var(--primary-500, #a855f7);
                transform: scale(1.05);
            }

            /* Dropdown menu */
            .theme-dropdown {
                position: absolute;
                top: 54px;
                left: 0;
                min-width: 180px;
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 8px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
                gap: 12px;
                padding: 10px 14px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }

            .theme-option:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .theme-option.active {
                background: rgba(124, 58, 237, 0.15);
                border-color: var(--primary-500, #a855f7);
            }

            .theme-option-icon {
                font-size: 18px;
                width: 24px;
                text-align: center;
            }

            .theme-option-name {
                font-size: 14px;
                font-weight: 500;
                color: #e4e4e7;
            }

            .theme-option.active .theme-option-name {
                color: #ffffff;
            }

            .theme-option-colors {
                display: flex;
                gap: 3px;
                margin-left: auto;
            }

            .theme-color-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            /* Mobile positioning */
            @media (max-width: 768px) {
                .theme-picker {
                    top: auto;
                    bottom: 180px;
                    left: 150px;
                }

                .theme-dropdown {
                    top: auto;
                    bottom: 54px;
                    transform: translateY(10px);
                }

                .theme-picker.active .theme-dropdown {
                    transform: translateY(0);
                }
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

        document.body.appendChild(picker);

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
