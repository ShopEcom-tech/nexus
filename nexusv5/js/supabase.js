/**
 * Nexus Web Shop - Supabase Configuration
 * 
 * Configuration du client Supabase pour l'authentification et la base de données.
 * Utilise la configuration centralisée depuis config.js
 */

/**
 * Nexus Web Shop - Supabase Configuration
 * 
 * Configuration du client Supabase pour l'authentification et la base de données.
 * Utilise la configuration centralisée depuis config.js
 */

import { createClient } from '@supabase/supabase-js';

// Ensure config is loaded
if (!window.NexusConfig) {
    console.error('❌ NexusConfig non chargé. Assurez-vous que config.js est importé.');
}

/**
 * Vérifier si Supabase est configuré
 */
export function isSupabaseConfigured() {
    return window.NexusConfig && window.NexusConfig.isSupabaseConfigured();
}

/**
 * Initialiser Supabase
 */
export function initSupabase() {
    // Si déjà initialisé, retourner le client existant
    if (window.supabaseClient) {
        return window.supabaseClient;
    }

    if (!window.NexusConfig) return null;

    const { url, anonKey } = window.NexusConfig.supabase;

    try {
        window.supabaseClient = createClient(url, anonKey);
        console.log('%c✅ Supabase client initialisé avec succès (Module)', 'color: #10b981; font-weight: bold;');
        return window.supabaseClient;
    } catch (error) {
        console.error('Erreur lors de la création du client Supabase:', error);
        return null;
    }
}

// Expose globally for legacy scripts (like auth.js if not refactored yet)
window.isSupabaseConfigured = isSupabaseConfigured;
window.initSupabase = initSupabase;

// Auto init
initSupabase();

// Warning if not configured
if (!isSupabaseConfigured()) {
    console.warn(
        '%c⚠️ Supabase non configuré!',
        'color: #f59e0b; font-size: 16px; font-weight: bold;'
    );
    console.warn(
        'Ouvrez js/config.js et configurez vos identifiants Supabase.'
    );
}

