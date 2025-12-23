import { config } from '../config.js';
import { getNAFCodes, addNAFCode } from '../database.js';
import { Modal } from '../components/Modal.js';
import { DepartmentSelector } from '../components/DepartmentSelector.js';
import { NAFTable } from '../components/NAFTable.js';
import { router } from '../router.js';

/**
 * Page détail d'un projet
 */
export async function ProjectPage(params) {
  const projectId = params.projectName;
  const { getProjectById, createProject } = await import('../database.js');
  let project = await getProjectById(projectId);

  // Fallback: Si pas en base mais dans config, on le crée en base maintenant (auto-fix)
  if (!project) {
    const configProject = config.projects.find(p => p.id === projectId);
    if (configProject) {
      try {
        console.log(`Projet ${projectId} trouvé en config mais pas en DB. Création auto...`);
        project = await createProject(configProject);
      } catch (e) {
        console.error("Impossible de créer le projet manquant en DB", e);
      }
    } else {
      // Si vraiment pas trouvé, peut-être qu'on vient juste de le créer dans un autre onglet ? ou 404
      // Essayons de l'afficher quand même avec juste l'ID pour ne pas bloquer
      project = { id: projectId, name: projectId.charAt(0).toUpperCase() + projectId.slice(1) };
      // Mais idéalement on devrait le créer pour éviter les erreurs de foreign key
      try {
        await createProject(project);
      } catch (e) { }
    }
  }

  if (!project) {
    router.show404();
    return;
  }

  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container" style="padding: var(--spacing-xl) var(--spacing-lg);">
      <div style="margin-bottom: var(--spacing-xl);">
        <a href="/" data-link class="btn btn-ghost" style="margin-bottom: var(--spacing-lg);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour à l'accueil
        </a>
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h1 class="gradient-text" style="
              font-size: var(--font-size-3xl);
              font-weight: 800;
              margin-bottom: var(--spacing-sm);
            ">
              ${project.name}
            </h1>
            <p style="color: var(--color-text-secondary);">
              Gestion des codes NAF
            </p>
          </div>
          
          <div style="display: flex; gap: var(--spacing-md);">
            <button id="add-naf-btn" class="btn btn-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Ajouter un code NAF
            </button>
            <a href="/projet/${projectId}/leads-scrapes" data-link class="btn btn-secondary">
              Leads scrapés
            </a>
          </div>
        </div>
      </div>
      
      <div id="naf-table-container"></div>
    </div>
  `;

  // Charger et afficher les codes NAF
  await loadNAFCodes(projectId);

  // Bouton ajouter code NAF
  document.getElementById('add-naf-btn').addEventListener('click', () => {
    showAddNAFModal(projectId);
  });
}

async function loadNAFCodes(projectId) {
  const nafCodes = await getNAFCodes(projectId);
  const container = document.getElementById('naf-table-container');

  const table = new NAFTable(
    nafCodes,
    () => loadNAFCodes(projectId),
    ['non injecté', 'injecté', 'en cours', 'terminé'],
    'status_project',
    projectId,
    'departments_project'
  );
  container.innerHTML = '';
  container.appendChild(table.render());
}

function showAddNAFModal(projectId) {
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="form-group">
      <label class="form-label">Code NAF</label>
      <input type="text" name="code" class="form-input" placeholder="Ex: 62.01Z" required>
    </div>
    
    <div class="form-group">
      <label class="form-label">Requête</label>
      <textarea name="query" class="form-textarea" placeholder="Description de la requête..." required></textarea>
    </div>
    
    <div id="department-selector-container"></div>
  `;

  const deptSelector = new DepartmentSelector([], projectId);
  form.querySelector('#department-selector-container').appendChild(deptSelector.render());

  const modal = new Modal('Ajouter un code NAF', form, {
    confirmText: 'Ajouter',
    cancelText: 'Annuler',
    onConfirm: async () => {
      const formData = new FormData(form);
      const code = formData.get('code');
      const query = formData.get('query');
      const departments = deptSelector.getSelectedDepartments();

      if (!code || !query) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      try {
        await addNAFCode({
          project_id: projectId,
          code: code,
          query: query,
          departments_project: departments,
          departments_scraper: [],
          status_project: 'non injecté',
          status_scraper: 'scrapé'
        });

        modal.close();
        await loadNAFCodes(projectId);
      } catch (error) {
        alert('Erreur lors de l\'ajout du code NAF');
        console.error(error);
      }
    }
  });

  modal.open();
}
