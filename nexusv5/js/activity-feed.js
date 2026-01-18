/**
 * Live Activity Feed Widget
 * Innovation #8: Shows fake real-time activity notifications for social proof
 * Creates FOMO and trust by showing recent "activity"
 */

(function () {
    'use strict';

    const ACTIVITY_CONFIG = {
        enabled: true,
        showOnPages: ['index', 'offres', 'services'], // Pages to show on
        initialDelay: 5000, // First notification after 5s
        interval: 15000, // Show new notification every 15s
        displayDuration: 5000, // Each notification visible for 5s
        maxNotifications: 10, // How many to cycle through
        position: 'bottom-left' // 'bottom-left' or 'bottom-right'
    };

    // Activity templates - randomized for each display
    const ACTIVITIES = [
        {
            type: 'signup',
            icon: '🎉',
            messages: [
                'Sophie M. vient de demander un devis',
                'Thomas D. a réservé un appel découverte',
                'Marie L. vient de commander un site vitrine',
                'Lucas P. a rejoint nos clients satisfaits'
            ],
            locations: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes', 'Toulouse']
        },
        {
            type: 'project',
            icon: '🚀',
            messages: [
                'RestauChic vient de recevoir son nouveau site',
                'E-Shop Plus a atteint 500 ventes ce mois',
                'TechStart a lancé sa plateforme avec nous',
                'MediCare Pro a vu son trafic doubler'
            ],
            locations: ['France']
        },
        {
            type: 'review',
            icon: '⭐',
            messages: [
                'Nouvel avis 5 étoiles sur Google',
                'Un client nous recommande à 100%',
                '98% de satisfaction ce trimestre',
                'Merci à nos 150+ clients fidèles'
            ],
            locations: null
        },
        {
            type: 'urgency',
            icon: '⏰',
            messages: [
                'Plus que 2 places ce mois-ci',
                'Offre -20% expire dans 48h',
                '3 projets lancés cette semaine',
                'Calendrier janvier presque complet'
            ],
            locations: null
        }
    ];

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomTime() {
        const times = ['Il y a 2 min', 'Il y a 5 min', 'Il y a 12 min', 'Il y a 23 min', 'Il y a 1h'];
        return getRandomItem(times);
    }

    function generateNotification() {
        const activity = getRandomItem(ACTIVITIES);
        const message = getRandomItem(activity.messages);
        const location = activity.locations ? getRandomItem(activity.locations) : null;
        const time = getRandomTime();

        return {
            icon: activity.icon,
            message,
            location,
            time,
            type: activity.type
        };
    }

    function injectStyles() {
        const isLeft = ACTIVITY_CONFIG.position === 'bottom-left';

        const styles = `
            .activity-notification {
                position: fixed;
                bottom: 100px;
                ${isLeft ? 'left: 24px' : 'right: 24px'};
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 16px 20px;
                max-width: 320px;
                z-index: 9997;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                transform: translateX(${isLeft ? '-120%' : '120%'});
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .activity-notification.visible {
                transform: translateX(0);
                opacity: 1;
            }

            .activity-notification.hiding {
                transform: translateX(${isLeft ? '-120%' : '120%'});
                opacity: 0;
            }

            .activity-content {
                display: flex;
                gap: 14px;
                align-items: flex-start;
            }

            .activity-icon {
                font-size: 28px;
                flex-shrink: 0;
            }

            .activity-text {
                flex: 1;
            }

            .activity-message {
                color: #e4e4e7;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.4;
                margin-bottom: 6px;
            }

            .activity-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: #71717a;
            }

            .activity-location {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .activity-location::before {
                content: '📍';
                font-size: 10px;
            }

            .activity-time {
                color: #52525b;
            }

            .activity-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: #52525b;
                cursor: pointer;
                font-size: 16px;
                padding: 4px;
                line-height: 1;
                transition: color 0.2s;
            }

            .activity-close:hover {
                color: #a1a1aa;
            }

            /* Pulse effect for urgency type */
            .activity-notification[data-type="urgency"] {
                border-color: rgba(239, 68, 68, 0.3);
            }

            .activity-notification[data-type="urgency"]::before {
                content: '';
                position: absolute;
                inset: -2px;
                border-radius: 18px;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), transparent);
                z-index: -1;
                animation: urgency-pulse 2s ease-in-out infinite;
            }

            @keyframes urgency-pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 1; }
            }

            /* Verified badge for reviews */
            .activity-notification[data-type="review"] .activity-message::after {
                content: ' ✓';
                color: #4ade80;
            }

            @media (max-width: 480px) {
                .activity-notification {
                    left: 16px;
                    right: 16px;
                    max-width: none;
                    bottom: 90px;
                    transform: translateY(100%);
                }

                .activity-notification.visible {
                    transform: translateY(0);
                }

                .activity-notification.hiding {
                    transform: translateY(100%);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    let notificationElement = null;
    let notificationCount = 0;
    let intervalId = null;

    function createNotificationElement() {
        const el = document.createElement('div');
        el.className = 'activity-notification';
        el.id = 'activity-notification';
        document.body.appendChild(el);
        return el;
    }

    function showNotification() {
        if (notificationCount >= ACTIVITY_CONFIG.maxNotifications) {
            clearInterval(intervalId);
            return;
        }

        const data = generateNotification();

        notificationElement.setAttribute('data-type', data.type);
        notificationElement.innerHTML = `
            <button class="activity-close" onclick="window.hideActivityNotification()">×</button>
            <div class="activity-content">
                <div class="activity-icon">${data.icon}</div>
                <div class="activity-text">
                    <div class="activity-message">${data.message}</div>
                    <div class="activity-meta">
                        ${data.location ? `<span class="activity-location">${data.location}</span>` : ''}
                        <span class="activity-time">${data.time}</span>
                    </div>
                </div>
            </div>
        `;

        // Show
        requestAnimationFrame(() => {
            notificationElement.classList.add('visible');
            notificationElement.classList.remove('hiding');
        });

        // Auto-hide after duration
        setTimeout(() => {
            hideNotification();
        }, ACTIVITY_CONFIG.displayDuration);

        notificationCount++;
    }

    function hideNotification() {
        if (!notificationElement) return;
        notificationElement.classList.remove('visible');
        notificationElement.classList.add('hiding');
    }

    window.hideActivityNotification = hideNotification;

    function shouldShowOnCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        return ACTIVITY_CONFIG.showOnPages.some(page =>
            path.includes(page) || path === '/' || path.endsWith('.html') && path.includes('index')
        );
    }

    function init() {
        if (!ACTIVITY_CONFIG.enabled) return;
        if (!shouldShowOnCurrentPage()) return;

        injectStyles();
        notificationElement = createNotificationElement();

        // Start showing notifications
        setTimeout(() => {
            showNotification();
            intervalId = setInterval(showNotification, ACTIVITY_CONFIG.interval);
        }, ACTIVITY_CONFIG.initialDelay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
