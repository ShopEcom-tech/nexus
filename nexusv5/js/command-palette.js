/**
 * Nexus Command Palette (Cmd+K)
 * "Spotlight-style" navigation and agentic control.
 */

class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.selectedIndex = 0;
        this.query = '';

        // Navigation Items
        this.items = [
            { type: 'link', label: 'Accueil', url: 'index.html', icon: '🏠' },
            { type: 'link', label: 'Offres & Tarifs', url: 'pages/offres.html', icon: '💎' },
            { type: 'link', label: 'Services', url: 'pages/services.html', icon: '⚡' },
            { type: 'link', label: 'Portfolio', url: 'pages/portfolio.html', icon: '🎨' },
            { type: 'link', label: 'Contact', url: 'pages/contact.html', icon: '📞' },
            { type: 'link', label: 'Se connecter', url: 'pages/login.html', icon: '🔐' },
            { type: 'action', label: 'Toggle Dark Mode', action: 'toggleTheme', icon: '🌙' },
            { type: 'action', label: 'Demander à l\'IA', action: 'askAI', icon: '🤖' }
        ];

        this.filteredItems = [...this.items];

        this.init();
    }

    init() {
        this.injectStyles();
        this.createDOM();
        this.bindEvents();
    }

    injectStyles() {
        if (document.getElementById('cmd-palette-styles')) return;

        const style = document.createElement('style');
        style.id = 'cmd-palette-styles';
        style.textContent = `
            .cmd-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                z-index: 10000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 15vh;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            .cmd-overlay.open {
                display: flex;
                opacity: 1;
            }
            .cmd-modal {
                width: 600px;
                max-width: 90%;
                background: rgba(20, 20, 25, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.95);
                transition: transform 0.2s ease;
            }
            .cmd-overlay.open .cmd-modal {
                transform: scale(1);
            }
            .cmd-header {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            .cmd-search-icon {
                font-size: 18px;
                color: rgba(255, 255, 255, 0.4);
                margin-right: 12px;
            }
            .cmd-input {
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                flex: 1;
                outline: none;
                font-family: inherit;
            }
            .cmd-input::placeholder {
                color: rgba(255, 255, 255, 0.3);
            }
            .cmd-list {
                max-height: 400px;
                overflow-y: auto;
                padding: 8px;
                list-style: none;
                margin: 0;
            }
            .cmd-item {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.1s;
                color: rgba(255, 255, 255, 0.8);
            }
            .cmd-item.selected {
                background: rgba(124, 58, 237, 0.15);
                color: white;
                border-left: 2px solid #7c3aed;
            }
            .cmd-item-icon {
                margin-right: 12px;
                font-size: 16px;
                width: 24px;
                text-align: center;
            }
            .cmd-item-label {
                flex: 1;
                font-size: 15px;
            }
            .cmd-item-shortcut {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.3);
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
            }
            .cmd-footer {
                padding: 10px 20px;
                background: rgba(0, 0, 0, 0.2);
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
            }
            .cmd-key {
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 5px;
                border-radius: 3px;
                color: rgba(255, 255, 255, 0.7);
            }
            /* Scrollbar */
            .cmd-list::-webkit-scrollbar { width: 6px; }
            .cmd-list::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
        `;
        document.head.appendChild(style);
    }

    createDOM() {
        const overlay = document.createElement('div');
        overlay.className = 'cmd-overlay';
        overlay.innerHTML = `
            <div class="cmd-modal">
                <div class="cmd-header">
                    <span class="cmd-search-icon">🔍</span>
                    <input type="text" class="cmd-input" placeholder="Tapez une commande ou une question..." spellcheck="false">
                </div>
                <ul class="cmd-list"></ul>
                <div class="cmd-footer">
                    <span><span class="cmd-key">↵</span> sélectionner</span>
                    <span><span class="cmd-key">↑↓</span> naviguer</span>
                    <span><span class="cmd-key">esc</span> fermer</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        this.overlay = overlay;
        this.input = overlay.querySelector('.cmd-input');
        this.list = overlay.querySelector('.cmd-list');
    }

    bindEvents() {
        // Toggle on Ctrl+K or Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
                e.preventDefault();
                this.toggle();
            }

            // Close on Esc
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }

            // Navigation
            if (this.isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.moveSelection(1);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.moveSelection(-1);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelection();
                }
            }
        });

        // Close on backdrop click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Search input
        this.input.addEventListener('input', (e) => {
            this.filter(e.target.value);
        });
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('open');
        this.input.value = '';
        this.query = '';
        this.filter('');
        this.input.focus();

        // Prevent body scroll (basic)
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    filter(query) {
        this.query = query.toLowerCase();

        if (this.query === '') {
            this.filteredItems = [...this.items];
        } else {
            this.filteredItems = this.items.filter(item =>
                item.label.toLowerCase().includes(this.query)
            );

            // If no nav matches, add "Ask AI" specific item
            if (this.filteredItems.length === 0) {
                this.filteredItems.push({
                    type: 'action',
                    label: `Demander à l'IA : "${query}"`,
                    action: 'askAI_query',
                    icon: '🤖',
                    query: this.query
                });
            }
        }

        this.selectedIndex = 0;
        this.renderList();
    }

    renderList() {
        this.list.innerHTML = '';
        this.filteredItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `cmd-item ${index === this.selectedIndex ? 'selected' : ''}`;
            li.innerHTML = `
                <span class="cmd-item-icon">${item.icon}</span>
                <span class="cmd-item-label">${item.label}</span>
                ${item.type === 'link' ? '<span class="cmd-item-shortcut">Aller</span>' : ''}
            `;
            li.addEventListener('click', () => {
                this.selectedIndex = index;
                this.executeSelection();
            });
            li.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                // Re-render only selected class would be faster but this is fine for small lists
                Array.from(this.list.children).forEach((el, i) => {
                    el.classList.toggle('selected', i === index);
                });
            });
            this.list.appendChild(li);
        });
    }

    moveSelection(direction) {
        this.selectedIndex += direction;
        if (this.selectedIndex < 0) this.selectedIndex = this.filteredItems.length - 1;
        if (this.selectedIndex >= this.filteredItems.length) this.selectedIndex = 0;

        // Update visual selection
        Array.from(this.list.children).forEach((el, i) => {
            const isSelected = i === this.selectedIndex;
            el.classList.toggle('selected', isSelected);
            if (isSelected) {
                el.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    executeSelection() {
        const item = this.filteredItems[this.selectedIndex];
        if (!item) return;

        this.close();

        if (item.type === 'link') {
            window.location.href = item.url;
        } else if (item.type === 'action') {
            if (item.action === 'askAI') {
                this.openChatbot();
            } else if (item.action === 'askAI_query') {
                this.openChatbot(this.query); // Pass the query
            } else if (item.action === 'toggleTheme') {
                // Implement theme toggle if exists, mostly just log for now
                console.log('Toggle theme');
            }
        }
    }

    openChatbot(initialMessage = '') {
        const toggle = document.querySelector('.chatbot-toggle');
        if (toggle) {
            // Force open logic (simulate click if closed)
            const window = document.querySelector('.chatbot-window');
            if (window && window.style.display === 'none') {
                toggle.click();
            }

            if (initialMessage) {
                const input = document.getElementById('chatbot-input');
                const form = document.getElementById('chatbot-form');
                if (input && form) {
                    input.value = initialMessage;
                    // Optional: auto submit
                    // form.dispatchEvent(new Event('submit'));
                }
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
    console.log('Command Palette initialized');
});
