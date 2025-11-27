import { config } from '../config.js';
import { getNAFCodes, addNAFCode } from '../database.js';
import { Modal } from '../components/Modal.js';
import { DepartmentSelector } from '../components/DepartmentSelector.js';
import { NAFTable } from '../components/NAFTable.js';
import { router } from '../router.js';

/**
 * Page Leads Scrapés
 */
export async function LeadsScraperPage(params) {
    const projectId = params.projectName;
    const project = config.projects.find(p => p.id === projectId);

    if (!project) {
        router.show404();
        return;
    }

    const app = document.getElementById('app');

    app.innerHTML = `
    <div class="container" style="padding: var(--spacing-xl) var(--spacing-lg);">
      <div style="margin-bottom: var(--spacing-xl);">
        <a href="/projet/${projectId}" data-link class="btn btn-ghost" style="margin-bottom: var(--spacing-lg);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour au projet
        </a>
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
          <div>
            <h1 class="gradient-text" style="
              font-size: var(--font-size-3xl);
              font-weight: 800;
              margin-bottom: var(--spacing-sm);
            ">
              ${project.name} - Leads Scrapés
            </h1>
            <p style="color: var(--color-text-secondary);">
              Gestion des codes NAF pour le scraping
            </p>
          </div>
          
          <button id="add-naf-btn" class="btn btn-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Ajouter un code NAF
          </button>
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

    const table = new NAFTable(nafCodes, () => loadNAFCodes(projectId));
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

    const deptSelector = new DepartmentSelector([]);
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
                    departments: departments,
                    status: 'En cours'
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
