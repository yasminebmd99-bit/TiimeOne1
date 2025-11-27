import './styles/index.css';
import { router } from './router.js';
import { initSupabase } from './database.js';
import { HomePage } from './pages/HomePage.js';
import { ProjectPage } from './pages/ProjectPage.js';
import { LeadsScraperPage } from './pages/LeadsScraperPage.js';

// Initialiser Supabase
initSupabase();

// Enregistrer les routes
router.addRoute('/', HomePage);
router.addRoute('/home', HomePage);
router.addRoute('/projet/:projectName', ProjectPage);
router.addRoute('/projet/:projectName/leads-scrapes', LeadsScraperPage);

// Démarrer le routeur
router.start();
