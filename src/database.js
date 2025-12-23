import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

// Initialiser le client Supabase
let supabase = null;

export function initSupabase() {
    if (config.supabase.url === 'VOTRE_URL_SUPABASE') {
        console.warn('⚠️ Supabase non configuré. Veuillez ajouter vos identifiants dans src/config.js');
        return null;
    }

    supabase = createClient(config.supabase.url, config.supabase.anonKey);
    return supabase;
}

export function getSupabase() {
    return supabase;
}

// ==================== OPÉRATIONS CRUD ====================

/**
 * Récupère la liste des projets
 */
export async function getProjects() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

    if (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return [];
    }

    return data || [];
}

/**
 * Récupère un projet par son ID
 * @param {string} id - ID du projet
 */
export async function getProjectById(id) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        // Ignorer l'erreur si c'est juste que le projet n'existe pas (406 ou vide)
        if (error.code !== 'PGRST116') {
            console.error('Erreur lors de la récupération du projet:', error);
        }
        return null;
    }

    return data;
}


/**
 * Crée un nouveau projet
 * @param {Object} project - Objet projet { id, name }
 */
export async function createProject(project) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

    if (error) {
        console.error('Erreur lors de la création du projet:', error);
        throw error;
    }

    return data;
}

/**
 * Récupère les codes NAF d'un projet
 * @param {string} projectId - ID du projet
 */
export async function getNAFCodes(projectId) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('naf_codes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erreur lors de la récupération des codes NAF:', error);
        return [];
    }

    return data || [];
}

/**
 * Recherche des codes NAF à travers tous les projets
 * @param {string} codeQuery - Recherche par code NAF
 * @param {string} queryText - Recherche par requête
 */
export async function searchNAFCodes(codeQuery = '', queryText = '') {
    if (!supabase) return [];

    let query = supabase
        .from('naf_codes')
        .select('*')
        .order('created_at', { ascending: false });

    // Filtrer par code NAF si fourni
    if (codeQuery) {
        query = query.ilike('code', `%${codeQuery}%`);
    }

    // Filtrer par requête si fourni
    if (queryText) {
        query = query.ilike('query', `%${queryText}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erreur lors de la recherche des codes NAF:', error);
        return [];
    }

    return data || [];
}

/**
 * Ajoute un nouveau code NAF
 */
export async function addNAFCode(nafCode) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('naf_codes')
        .insert([nafCode])
        .select()
        .single();

    if (error) {
        console.error('Erreur lors de l\'ajout du code NAF:', error);
        throw error;
    }

    return data;
}

/**
 * Met à jour un code NAF complet
 */
export async function updateNAFCode(id, updates) {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('naf_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erreur lors de la mise à jour du code NAF:', error);
        throw error;
    }

    return data;
}

/**
 * Supprime un code NAF
 */
export async function deleteNAFCode(id) {
    if (!supabase) return false;

    const { error } = await supabase
        .from('naf_codes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erreur lors de la suppression du code NAF:', error);
        throw error;
    }

    return true;
}

/**
 * Met à jour le statut d'un code NAF
 */
export async function updateNAFStatus(id, status) {
    return updateNAFCode(id, { status });
}
