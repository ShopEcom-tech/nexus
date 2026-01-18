/**
 * Nexus Web Shop - Dashboard Module (Supabase)
 * 
 * Gestion du tableau de bord utilisateur avec Supabase
 */

const Dashboard = {
    /**
     * Initialisation
     */
    init() {
        // Charger les données
        this.loadUserProfile();
        this.loadOrders();
        this.loadProjects();

        // Initialiser la navigation
        this.initNavigation();

        // Initialiser le dropdown utilisateur
        this.initUserDropdown();
    },

    /**
     * Charger les commandes récentes
     */
    /**
     * Charger le profil utilisateur
     */
    async loadUserProfile() {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return;

        try {
            // Récupérer l'utilisateur courant
            const { data: { user } } = await window.supabaseClient.auth.getUser();

            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            // Charger les détails du profil
            const { data: profile, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            // Mettre à jour l'UI
            this.updateProfileUI(user, profile);

        } catch (error) {
            console.error('Error loading profile:', error);
        }
    },

    /**
     * Mettre à jour l'interface du profil
     */
    updateProfileUI(user, profile) {
        const userName = document.getElementById('user-name');
        const userInitials = document.getElementById('user-initials');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileInitials = document.getElementById('profile-initials');
        const profileCompany = document.getElementById('profile-company');
        const profilePhone = document.getElementById('profile-phone');
        const profileSince = document.getElementById('profile-since');

        const displayName = (profile && profile.name) || user.email.split('@')[0];
        const initials = displayName.substring(0, 2).toUpperCase();
        const email = user.email;

        // Header
        if (userName) userName.textContent = displayName;
        if (userInitials) userInitials.textContent = initials;

        // Sidebar
        if (profileName) profileName.textContent = displayName;
        if (profileEmail) profileEmail.textContent = email;
        if (profileInitials) profileInitials.textContent = initials;
        if (profileCompany) profileCompany.textContent = (profile && profile.company) || 'Non renseigné';
        if (profilePhone) profilePhone.textContent = (profile && profile.phone) || 'Non renseigné';

        if (profileSince && user.created_at) {
            profileSince.textContent = new Date(user.created_at).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
            });
        }
    },

    /**
     * Charger les commandes récentes
     */
    async loadOrders() {
        const ordersList = document.getElementById('orders-list');
        const ordersCount = document.getElementById('stat-orders');

        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) return;

        try {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            if (!user) return;

            // Charger les commandes
            const { data: orders, error } = await window.supabaseClient
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            // Mettre à jour le compteur
            if (ordersCount) {
                ordersCount.textContent = orders ? orders.length : 0;
            }

            // Afficher la liste
            if (ordersList) {
                if (orders && orders.length > 0) {
                    ordersList.innerHTML = orders.map(order => this.renderOrder(order)).join('');
                } else {
                    ordersList.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">📦</div>
                            <h3>Aucune commande</h3>
                            <p>Vous n'avez pas encore passé de commande</p>
                            <a href="offres.html" class="btn btn-primary">Découvrir nos offres</a>
                        </div>
                    `;
                }
            }

        } catch (error) {
            console.error('Load orders error:', error);
        }
    },

    /**
     * Charger les projets en cours
     */
    async loadProjects() {
        const projectsList = document.getElementById('projects-list');
        if (!projectsList) return;

        // Vérifier si Supabase est configuré
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            console.log('Dashboard: Mode démonstration - pas de projets');
            return;
        }

        try {
            const { data: projects, error } = await window.supabaseClient
                .from('projects')
                .select('*')
                .neq('status', 'completed')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            if (projects && projects.length > 0) {
                projectsList.innerHTML = projects.map(project => this.renderProject(project)).join('');
            }
        } catch (error) {
            console.error('Load projects error:', error);
        }
    },

    /**
     * Créer une commande
     */
    async createOrder(items) {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            console.error('Supabase non configuré');
            return null;
        }

        try {
            // Calculer le total
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const taxAmount = totalAmount * 0.2; // TVA 20%
            const finalAmount = totalAmount + taxAmount;

            // Générer le numéro de commande
            const orderNumber = 'CMD-' + Date.now().toString(36).toUpperCase();

            // Créer la commande
            const { data: order, error: orderError } = await window.supabaseClient
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    total_amount: totalAmount,
                    tax_amount: taxAmount,
                    final_amount: finalAmount,
                    status: 'pending',
                    payment_status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Créer les items de commande
            const orderItems = items.map(item => ({
                order_id: order.id,
                service_id: item.service_id || null,
                service_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await window.supabaseClient
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return order;
        } catch (error) {
            console.error('Create order error:', error);
            return null;
        }
    },

    /**
     * Envoyer un message de contact
     */
    async sendContact(formData) {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            // Fallback sur Web3Forms si Supabase non configuré
            console.log('Contact: Utilisation de Web3Forms');
            return null;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('contacts')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company || null,
                    budget: formData.budget || null,
                    message: formData.message,
                    status: 'new'
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Send contact error:', error);
            return null;
        }
    },

    /**
     * S'inscrire à la newsletter
     */
    async subscribeNewsletter(email, name = null) {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            console.log('Newsletter: Supabase non configuré');
            return false;
        }

        try {
            const { error } = await window.supabaseClient
                .from('newsletter_subscribers')
                .upsert({
                    email,
                    name,
                    status: 'active',
                    subscribed_at: new Date().toISOString()
                }, {
                    onConflict: 'email'
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Subscribe newsletter error:', error);
            return false;
        }
    },

    /**
     * Charger les services
     */
    async loadServices() {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            return [];
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Load services error:', error);
            return [];
        }
    },

    /**
     * Charger les témoignages
     */
    async loadTestimonials() {
        if (!window.isSupabaseConfigured || !window.isSupabaseConfigured()) {
            return [];
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('testimonials')
                .select('*')
                .eq('is_approved', true)
                .order('display_order');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Load testimonials error:', error);
            return [];
        }
    },

    /**
     * Rendre une commande (depuis customer_info)
     */
    renderOrder(order) {
        const statusColors = {
            'pending': '#f59e0b',
            'paid': '#10b981',
            'failed': '#ef4444',
            'refunded': '#6b7280',
            'cancelled': '#ef4444'
        };

        const statusLabels = {
            'pending': 'En attente',
            'paid': 'Payée',
            'failed': 'Échouée',
            'refunded': 'Remboursée',
            'cancelled': 'Annulée'
        };

        // Formater les items depuis order_items (JSONB)
        let itemNames = 'Commande';
        if (order.order_items && Array.isArray(order.order_items) && order.order_items.length > 0) {
            itemNames = order.order_items.map(item => item.id || item.name).slice(0, 2).join(', ');
            if (order.order_items.length > 2) itemNames += '...';
        }

        // Générer un numéro de commande lisible
        const orderNumber = order.id ? 'WS-' + String(order.id).padStart(4, '0') : 'WS-XXXX';

        // Nom du client
        const customerName = `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Client';

        return `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-number">${orderNumber}</div>
                    <div class="order-items-preview">${customerName} - ${itemNames}</div>
                    <div class="order-date">${new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div class="order-details">
                    <div class="order-amount">${parseFloat(order.total || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</div>
                    <div class="order-status" style="color: ${statusColors[order.status] || '#71717a'}">
                        ${statusLabels[order.status] || order.status || 'Inconnu'}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Rendre un projet
     */
    renderProject(project) {
        const typeLabels = {
            'vitrine': 'Vitrine',
            'ecommerce': 'E-commerce',
            'surmesure': 'Sur-mesure',
            'autre': 'Autre'
        };

        return `
            <div class="project-item">
                <div class="project-header">
                    <h4 class="project-name">${project.name}</h4>
                    <span class="project-type">${typeLabels[project.project_type] || project.project_type}</span>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.completion_percentage || 0}%"></div>
                    </div>
                    <span class="progress-text">${project.completion_percentage || 0}%</span>
                </div>
            </div>
        `;
    },

    /**
     * Initialiser la navigation interne
     */
    initNavigation() {
        const hash = window.location.hash;
        if (hash) {
            this.showSection(hash.substring(1));
        }

        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash;
            if (newHash) {
                this.showSection(newHash.substring(1));
            }
        });
    },

    /**
     * Afficher une section
     */
    showSection(section) {
        console.log('Show section:', section);
        // Pour une future implémentation d'onglets
    },

    /**
     * Initialiser le dropdown utilisateur
     */
    initUserDropdown() {
        const avatar = document.getElementById('user-avatar');
        const dropdown = document.querySelector('.user-dropdown');

        if (avatar && dropdown) {
            avatar.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }
    }
};

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Exposer globalement
window.Dashboard = Dashboard;
