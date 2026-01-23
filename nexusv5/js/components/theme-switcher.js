/**
 * Theme Switcher Component
 * Restores the Dark/Light mode toggle functionality
 */

export function initThemeSwitcher() {
    // Configuration
    const THEME_STORAGE_KEY = 'nexus_theme';
    const DEFAULT_THEME = 'dark'; // Restore dark as default if preferred

    // DOM Elements
    const body = document.body;
    const html = document.documentElement;

    // Create Toggle Button explicitly if not present
    let toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) {
        toggleBtn = createToggleHTML();
    }

    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);

    // Event Listener
    toggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    /**
     * Apply the selected theme
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            html.classList.add('dark-mode');
            updateIcon('dark');
        } else {
            html.removeAttribute('data-theme');
            html.classList.remove('dark-mode');
            updateIcon('light');
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    /**
     * Update the toggle icon
     */
    function updateIcon(theme) {
        if (!toggleBtn) return;

        // Sun/Moon icons
        const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        toggleBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }

    /**
     * Inject button into Navbar
     */
    function createToggleHTML() {
        // Create button element
        const btn = document.createElement('button');
        btn.className = 'theme-toggle btn btn-icon';
        btn.style.cssText = `
            background: transparent;
            border: 1px solid var(--border-subtle);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-primary);
            margin-right: 12px;
            transition: all 0.3s ease;
        `;

        // Hover effect
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'var(--bg-secondary)';
            btn.style.borderColor = 'var(--primary-400)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            btn.style.borderColor = 'var(--border-subtle)';
        });

        // Find navbar actions container
        const navbarCta = document.querySelector('.navbar-cta');
        if (navbarCta) {
            // Insert before the Login button (first child)
            navbarCta.insertBefore(btn, navbarCta.firstChild);
        } else {
            // Fallback: append to body
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.left = '20px';
            btn.style.zIndex = '9999';
            btn.style.background = 'var(--bg-card)';
            document.body.appendChild(btn);
        }

        return btn;
    }
}
