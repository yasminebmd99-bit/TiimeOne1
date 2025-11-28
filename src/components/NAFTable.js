import { getMissingDepartments, getDepartmentNames } from '../utils/departments.js';
import { StatusToggle } from './StatusToggle.js';
import { updateNAFStatus, deleteNAFCode, updateNAFCode } from '../database.js';
import { Modal } from './Modal.js';
import { DepartmentSelector } from './DepartmentSelector.js';

/**
 * Composant tableau de codes NAF
 */
export class NAFTable {
  constructor(nafCodes, onUpdate, allowedStatuses = ['non injecté', 'injecté', 'en cours', 'terminé'], statusField = 'status_project') {
    this.nafCodes = nafCodes;
    this.onUpdate = onUpdate;
    this.allowedStatuses = allowedStatuses;
    this.statusField = statusField; // 'status_project' ou 'status_scraper'
    this.element = null;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'table-container';
    container.style.marginTop = 'var(--spacing-xl)';

    if (this.nafCodes.length === 0) {
      container.innerHTML = `
        <div style="
          padding: var(--spacing-3xl);
          text-align: center;
          color: var(--color-text-secondary);
        ">
          <p>Aucun code NAF pour le moment.</p>
          <p style="font-size: var(--font-size-sm); margin-top: var(--spacing-sm);">
            Cliquez sur "Ajouter un code NAF" pour commencer.
          </p>
        </div>
      `;
      return container;
    }

    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Code NAF</th>
          <th>Requête</th>
          <th>Départements</th>
          <th>Dép. manquants</th>
          <th>Statut</th>
          <th style="text-align: center;">Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    this.nafCodes.forEach(nafCode => {
      const row = document.createElement('tr');

      const missingDepts = getMissingDepartments(nafCode.departments || []);
      const deptNames = getDepartmentNames(nafCode.departments || []);
      const missingDeptNames = getDepartmentNames(missingDepts);

      // Code NAF
      const codeCell = document.createElement('td');
      codeCell.innerHTML = `<strong>${nafCode.code}</strong>`;
      row.appendChild(codeCell);

      // Requête
      const queryCell = document.createElement('td');
      queryCell.textContent = nafCode.query;
      queryCell.style.maxWidth = '200px';
      queryCell.style.overflow = 'hidden';
      queryCell.style.textOverflow = 'ellipsis';
      queryCell.style.whiteSpace = 'nowrap';
      queryCell.title = nafCode.query;
      row.appendChild(queryCell);

      // Départements
      const deptsCell = document.createElement('td');
      deptsCell.style.maxWidth = '250px';

      if (deptNames.length > 5) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-ghost';
        btn.style.fontSize = 'var(--font-size-xs)';
        btn.style.padding = '0.25rem 0.5rem';
        btn.textContent = `Voir les ${deptNames.length} départements`;
        btn.onclick = () => this.showDepartmentsModal('Départements inclus', deptNames);
        deptsCell.appendChild(btn);
      } else {
        deptsCell.innerHTML = `
          <div style="font-size: var(--font-size-sm); line-height: 1.4;">
            ${deptNames.join(', ') || 'Aucun'}
          </div>
        `;
      }
      row.appendChild(deptsCell);

      // Départements manquants
      const missingCell = document.createElement('td');
      missingCell.style.maxWidth = '250px';

      if (missingDeptNames.length > 5) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-ghost';
        btn.style.fontSize = 'var(--font-size-xs)';
        btn.style.padding = '0.25rem 0.5rem';
        btn.style.color = missingDepts.length > 0 ? 'var(--color-warning)' : 'var(--color-success)';
        btn.textContent = `Voir les ${missingDeptNames.length} manquants`;
        btn.onclick = () => this.showDepartmentsModal('Départements manquants', missingDeptNames);
        missingCell.appendChild(btn);
      } else {
        missingCell.innerHTML = `
          <div style="
            font-size: var(--font-size-sm);
            line-height: 1.4;
            color: ${missingDepts.length > 0 ? 'var(--color-warning)' : 'var(--color-success)'};
          ">
            ${missingDeptNames.join(', ') || 'Aucun'}
          </div>
        `;
      }
      row.appendChild(missingCell);

      // Statut
      const statusCell = document.createElement('td');
      const statusToggle = new StatusToggle(
        nafCode[this.statusField] || this.allowedStatuses[0],
        this.allowedStatuses,
        async (newStatus) => {
          try {
            await updateNAFCode(nafCode.id, { [this.statusField]: newStatus });
            if (this.onUpdate) this.onUpdate();
          } catch (error) {
            alert('Erreur lors de la mise à jour du statut');
          }
        }
      );
      statusCell.appendChild(statusToggle.render());
      row.appendChild(statusCell);

      // Actions
      const actionsCell = document.createElement('td');
      actionsCell.style.textAlign = 'center';
      actionsCell.style.display = 'flex';
      actionsCell.style.gap = '0.5rem';
      actionsCell.style.justifyContent = 'center';

      // Edit Button
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-ghost';
      editBtn.style.padding = '0.5rem';
      editBtn.title = 'Modifier';
      editBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      `;
      editBtn.onclick = () => this.showEditModal(nafCode);
      actionsCell.appendChild(editBtn);

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-ghost';
      deleteBtn.style.padding = '0.5rem';
      deleteBtn.title = 'Supprimer';
      deleteBtn.innerHTML = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      `;
      deleteBtn.onclick = async () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le code NAF "${nafCode.code}" ?`)) {
          try {
            await deleteNAFCode(nafCode.id);
            if (this.onUpdate) this.onUpdate();
          } catch (error) {
            alert('Erreur lors de la suppression');
          }
        }
      };
      actionsCell.appendChild(deleteBtn);

      row.appendChild(actionsCell);
      tbody.appendChild(row);
    });

    container.appendChild(table);
    this.element = container;

    return container;
  }

  showDepartmentsModal(title, departments) {
    const content = document.createElement('div');
    content.innerHTML = `
      <div style="max-height: 400px; overflow-y: auto;">
        <ul style="list-style: none; padding: 0;">
          ${departments.map(d => `<li style="padding: 0.5rem; border-bottom: 1px solid var(--color-surface);">${d}</li>`).join('')}
        </ul>
      </div>
    `;

    const modal = new Modal(title, content, {
      confirmText: 'Fermer',
      onConfirm: () => modal.close()
    });
    modal.open();
  }

  showEditModal(nafCode) {
    const form = document.createElement('form');
    form.innerHTML = `
      <div class="form-group">
        <label class="form-label">Code NAF</label>
        <input type="text" name="code" class="form-input" value="${nafCode.code}" required>
      </div>
      
      <div class="form-group">
        <label class="form-label">Requête</label>
        <textarea name="query" class="form-textarea" required>${nafCode.query}</textarea>
      </div>
      
      <div id="edit-department-selector-container"></div>
    `;

    const deptSelector = new DepartmentSelector(nafCode.departments || []);
    form.querySelector('#edit-department-selector-container').appendChild(deptSelector.render());

    const modal = new Modal('Modifier le code NAF', form, {
      confirmText: 'Enregistrer',
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
          await updateNAFCode(nafCode.id, {
            code,
            query,
            departments
          });
          modal.close();
          if (this.onUpdate) this.onUpdate();
        } catch (error) {
          alert('Erreur lors de la modification');
          console.error(error);
        }
      }
    });

    modal.open();
  }
}
