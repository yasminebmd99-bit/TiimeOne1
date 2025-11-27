// Configuration de l'application
export const config = {
    // Configuration Supabase - Utilise les variables d'environnement en production
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || 'https://vpshksqponatwxjlnahh.supabase.co',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc2hrc3Fwb25hdHd4amxuYWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDgyNzUsImV4cCI6MjA3OTgyNDI3NX0.bPJy_S5nsN8jCc2sWDxOM5aTAfv6gnSG0mzmL43nA_k'
    },

    // Liste des projets
    projects: [
        { id: '6xpos', name: '6xpos' },
        { id: 'ayvens', name: 'Ayvens' },
        { id: 'canal', name: 'Canal+' },
        { id: 'danone', name: 'Danone' },
        { id: 'ebp', name: 'EBP' },
        { id: 'herschenbach', name: 'Herschenbach' },
        { id: 'hyundai', name: 'Hyundai Pro' },
        { id: 'quadra', name: 'Quadra' },
        { id: 'sage', name: 'Sage' },
        { id: 'staffy', name: 'Staffy' }
    ]
};
