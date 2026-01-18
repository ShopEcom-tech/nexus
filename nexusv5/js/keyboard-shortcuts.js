/**
 * Keyboard Shortcuts
 * Innovation #29: Quick navigation with keyboard
 */

(function () {
    'use strict';

    const SHORTCUTS = {
        'ctrl+k': { action: 'search', description: 'Ouvrir la recherche' },
        'ctrl+h': { action: 'home', description: 'Aller à l\'accueil' },
        'ctrl+p': { action: 'offres', description: 'Voir les offres' },
        'ctrl+m': { action: 'contact', description: 'Page contact' },
        'escape': { action: 'close', description: 'Fermer les popups' },
        '?': { action: 'help', description: 'Afficher l\'aide' }
    };

    function injectStyles() {
        const styles = `
            .keyboard-help {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                background: rgba(15, 15, 20, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 20px;
                padding: 32px;
                z-index: 100001;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                min-width: 350px;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .keyboard-help.visible {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, -50%) scale(1);
            }

            .keyboard-help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 100000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s;
            }

            .keyboard-help-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .keyboard-help-title {
                font-size: 20px;
                font-weight: 700;
                color: white;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .keyboard-shortcut {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .keyboard-shortcut:last-child {
                border-bottom: none;
            }

            .keyboard-key {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            .keyboard-key kbd {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                padding: 4px 10px;
                font-family: monospace;
                font-size: 13px;
                color: white;
                text-transform: uppercase;
            }

            .keyboard-desc {
                color: #a1a1aa;
                font-size: 14px;
            }

            /* Command palette search */
            .command-palette {
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 15, 20, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 16px;
                width: 90%;
                max-width: 500px;
                z-index: 100002;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
            }

            .command-palette.visible {
                opacity: 1;
                visibility: visible;
            }

            .command-palette-input {
                width: 100%;
                padding: 20px 24px;
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .command-palette-input:focus {
                outline: none;
            }

            .command-palette-input::placeholder {
                color: #71717a;
            }

            .command-palette-results {
                max-height: 300px;
                overflow-y: auto;
            }

            .command-palette-item {
                padding: 14px 24px;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .command-palette-item:hover,
            .command-palette-item.active {
                background: rgba(124, 58, 237, 0.2);
            }

            .command-palette-item-icon {
                font-size: 18px;
            }

            .command-palette-item-text {
                color: white;
                font-size: 15px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    const PAGES = [
        { name: 'Accueil', url: 'index.html', icon: '🏠' },
        { name: 'Nos Offres', url: 'pages/offres.html', icon: '💎' },
        { name: 'Services', url: 'pages/services.html', icon: '⚡' },
        { name: 'Portfolio', url: 'pages/portfolio.html', icon: '🎨' },
        { name: 'Témoignages', url: 'pages/temoignages.html', icon: '⭐' },
        { name: 'Contact', url: 'pages/contact.html', icon: '📧' }
    ];

    function createHelpModal() {
        const overlay = document.createElement('div');
        overlay.className = 'keyboard-help-overlay';
        overlay.id = 'keyboard-overlay';
        overlay.onclick = window.hideKeyboardHelp;

        const modal = document.createElement('div');
        modal.className = 'keyboard-help';
        modal.id = 'keyboard-help';

        modal.innerHTML = `
            <div class="keyboard-help-title">⌨️ Raccourcis clavier</div>
            ${Object.entries(SHORTCUTS).map(([key, { description }]) => `
                <div class="keyboard-shortcut">
                    <span class="keyboard-key">
                        ${key.split('+').map(k => `<kbd>${k}</kbd>`).join(' + ')}
                    </span>
                    <span class="keyboard-desc">${description}</span>
                </div>
            `).join('')}
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    function createCommandPalette() {
        const palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.id = 'command-palette';

        palette.innerHTML = `
            <input type="text" class="command-palette-input" id="command-input" 
                placeholder="Tapez pour rechercher..." autocomplete="off">
            <div class="command-palette-results" id="command-results"></div>
        `;

        document.body.appendChild(palette);

        const input = document.getElementById('command-input');
        input.addEventListener('input', filterCommands);
        input.addEventListener('keydown', handleCommandNav);
    }

    function filterCommands() {
        const input = document.getElementById('command-input');
        const results = document.getElementById('command-results');
        const query = input.value.toLowerCase();

        const filtered = PAGES.filter(p =>
            p.name.toLowerCase().includes(query)
        );

        results.innerHTML = filtered.map((p, i) => `
            <div class="command-palette-item ${i === 0 ? 'active' : ''}" 
                data-url="${p.url}" onclick="window.navigateTo('${p.url}')">
                <span class="command-palette-item-icon">${p.icon}</span>
                <span class="command-palette-item-text">${p.name}</span>
            </div>
        `).join('');
    }

    function handleCommandNav(e) {
        const items = document.querySelectorAll('.command-palette-item');
        const active = document.querySelector('.command-palette-item.active');
        const activeIndex = Array.from(items).indexOf(active);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = items[activeIndex + 1] || items[0];
            active?.classList.remove('active');
            next?.classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = items[activeIndex - 1] || items[items.length - 1];
            active?.classList.remove('active');
            prev?.classList.add('active');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const url = active?.dataset.url;
            if (url) window.navigateTo(url);
        }
    }

    window.showKeyboardHelp = function () {
        document.getElementById('keyboard-overlay')?.classList.add('visible');
        document.getElementById('keyboard-help')?.classList.add('visible');
    };

    window.hideKeyboardHelp = function () {
        document.getElementById('keyboard-overlay')?.classList.remove('visible');
        document.getElementById('keyboard-help')?.classList.remove('visible');
    };

    window.showCommandPalette = function () {
        const palette = document.getElementById('command-palette');
        const input = document.getElementById('command-input');
        palette?.classList.add('visible');
        document.getElementById('keyboard-overlay')?.classList.add('visible');
        input?.focus();
        filterCommands();
    };

    window.hideCommandPalette = function () {
        document.getElementById('command-palette')?.classList.remove('visible');
        document.getElementById('keyboard-overlay')?.classList.remove('visible');
    };

    window.navigateTo = function (url) {
        window.location.href = url;
    };

    function handleKeydown(e) {
        const key = [];
        if (e.ctrlKey || e.metaKey) key.push('ctrl');
        if (e.shiftKey) key.push('shift');
        if (e.altKey) key.push('alt');
        key.push(e.key.toLowerCase());

        const combo = key.join('+');
        const shortcut = SHORTCUTS[combo] || SHORTCUTS[e.key];

        if (shortcut) {
            e.preventDefault();

            switch (shortcut.action) {
                case 'search':
                    window.showCommandPalette();
                    break;
                case 'home':
                    window.navigateTo('index.html');
                    break;
                case 'offres':
                    window.navigateTo('pages/offres.html');
                    break;
                case 'contact':
                    window.navigateTo('pages/contact.html');
                    break;
                case 'close':
                    window.hideKeyboardHelp();
                    window.hideCommandPalette();
                    break;
                case 'help':
                    window.showKeyboardHelp();
                    break;
            }
        }
    }

    function init() {
        injectStyles();
        createHelpModal();
        createCommandPalette();
        document.addEventListener('keydown', handleKeydown);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
