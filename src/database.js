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
 * Récupère les codes NAF d'un projet
 * @param {string} projectId - ID du projet
 * @param {string} type - Type de code ('project' ou 'scraper')
 */
export async function getNAFCodes(projectId, type = 'project') {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('naf_codes')
        .select('*')
        .eq('project_id', projectId)
        .eq('type', type)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erreur lors de la récupération des codes NAF:', error);
        return [];
    }

    return data || [];
}

/**
 * Ajoute un nouveau code NAF
 */
export async function addNAFCode(nafCode) {
    if (!supabase) return null;

    // S'assurer que le type est défini (par défaut 'project')
    const codeToAdd = {
        ...nafCode,
        type: nafCode.type || 'project'
    };

    const { data, error } = await supabase
        .from('naf_codes')
        .insert([codeToAdd])
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
