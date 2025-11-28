import { DEPARTMENTS, getAvailableDepartments } from '../utils/departments.js';

/**
 * Composant sélecteur de départements multi-sélection
 */
export class DepartmentSelector {
  constructor(selectedDepartments = [], projectId = null) {
    this.selectedDepartments = new Set(selectedDepartments);
    this.projectId = projectId;
    this.element = null;
    this.isOpen = false;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.style.position = 'relative';

    container.innerHTML = `
      <label class="form-label">Départements</label>
      <div class="department-selector">
        <button type="button" class="form-input" style="
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        ">
          <span class="selected-count">
            ${this.selectedDepartments.size} département(s) sélectionné(s)
          </span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="department-dropdown" style="
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: var(--color-bg-secondary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          max-height: 300px;
          overflow-y: auto;
          z-index: 100;
          box-shadow: var(--shadow-xl);
        ">
          <div style="padding: var(--spacing-sm); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <button type="button" class="btn btn-ghost" style="width: 100%; font-size: var(--font-size-sm);" data-select-all>
              Tout sélectionner
            </button>
            <button type="button" class="btn btn-ghost" style="width: 100%; font-size: var(--font-size-sm); margin-top: 0.25rem;" data-deselect-all>
              Tout désélectionner
            </button>
          </div>
          <div class="department-list">
            ${getAvailableDepartments(this.projectId).map(dept => `
              <label style="
                display: flex;
                align-items: center;
                padding: var(--spacing-sm) var(--spacing-md);
                cursor: pointer;
                transition: background-color var(--transition-fast);
              " onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
                <input 
                  type="checkbox" 
                  value="${dept.code}"
                  ${this.selectedDepartments.has(dept.code) ? 'checked' : ''}
                  style="margin-right: var(--spacing-sm);"
                >
                <span style="font-size: var(--font-size-sm);">
                  ${dept.code} - ${dept.name}
                </span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.element = container;
    this.setupEventListeners();

    return container;
  }

  setupEventListeners() {
    const button = this.element.querySelector('button[type="button"]');
    const dropdown = this.element.querySelector('.department-dropdown');
    const checkboxes = this.element.querySelectorAll('input[type="checkbox"]');
    const selectAllBtn = this.element.querySelector('[data-select-all]');
    const deselectAllBtn = this.element.querySelector('[data-deselect-all]');

    // Toggle dropdown
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      dropdown.style.display = this.isOpen ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.isOpen = false;
        dropdown.style.display = 'none';
      }
    });

    // Handle checkbox changes
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedDepartments.add(e.target.value);
        } else {
          this.selectedDepartments.delete(e.target.value);
        }
        this.updateSelectedCount();
      });
    });

    // Select all
    selectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      checkboxes.forEach(cb => {
        cb.checked = true;
        this.selectedDepartments.add(cb.value);
      });
      this.updateSelectedCount();
    });

    // Deselect all
    deselectAllBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      checkboxes.forEach(cb => {
        cb.checked = false;
        this.selectedDepartments.delete(cb.value);
      });
      this.updateSelectedCount();
    });
  }

  updateSelectedCount() {
    const countSpan = this.element.querySelector('.selected-count');
    countSpan.textContent = `${this.selectedDepartments.size} département(s) sélectionné(s)`;
  }

  getSelectedDepartments() {
    return Array.from(this.selectedDepartments);
  }
}
