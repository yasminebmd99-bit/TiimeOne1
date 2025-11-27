import { getMissingDepartments } from '../utils/departments.js';
import { StatusToggle } from './StatusToggle.js';
import { updateNAFStatus, deleteNAFCode } from '../database.js';

/**
 * Composant tableau de codes NAF
 */
export class NAFTable {
    constructor(nafCodes, onUpdate) {
        this.nafCodes = nafCodes;
        this.onUpdate = onUpdate;
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

            // Code NAF
            const codeCell = document.createElement('td');
            codeCell.innerHTML = `<strong>${nafCode.code}</strong>`;
            row.appendChild(codeCell);

            // Requête
            const queryCell = document.createElement('td');
            queryCell.textContent = nafCode.query;
            queryCell.style.maxWidth = '300px';
            queryCell.style.overflow = 'hidden';
            queryCell.style.textOverflow = 'ellipsis';
            queryCell.style.whiteSpace = 'nowrap';
            row.appendChild(queryCell);

            // Départements
            const deptsCell = document.createElement('td');
            deptsCell.innerHTML = `
        <span style="
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
        ">
          ${(nafCode.departments || []).length} dép.
        </span>
      `;
            row.appendChild(deptsCell);

            // Départements manquants
            const missingCell = document.createElement('td');
            missingCell.innerHTML = `
        <span style="
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: ${missingDepts.length > 0 ? 'var(--color-warning)22' : 'var(--color-success)22'};
          color: ${missingDepts.length > 0 ? 'var(--color-warning)' : 'var(--color-success)'};
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
        ">
          ${missingDepts.length} dép.
        </span>
      `;
            row.appendChild(missingCell);

            // Statut
            const statusCell = document.createElement('td');
            const statuses = ['non injecté', 'injecté', 'en cours', 'terminé'];
            const statusToggle = new StatusToggle(
                nafCode.status || 'non injecté',
                statuses,
                async (newStatus) => {
                    try {
                        await updateNAFStatus(nafCode.id, newStatus);
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
            actionsCell.innerHTML = `
        <button class="btn btn-ghost" style="padding: 0.5rem;" title="Supprimer">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;

            const deleteBtn = actionsCell.querySelector('button');
            deleteBtn.addEventListener('click', async () => {
                if (confirm(`Êtes-vous sûr de vouloir supprimer le code NAF "${nafCode.code}" ?`)) {
                    try {
                        await deleteNAFCode(nafCode.id);
                        if (this.onUpdate) this.onUpdate();
                    } catch (error) {
                        alert('Erreur lors de la suppression');
                    }
                }
            });

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });

        container.appendChild(table);
        this.element = container;

        return container;
    }
}
