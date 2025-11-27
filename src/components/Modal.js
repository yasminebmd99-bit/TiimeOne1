/**
 * Composant modal réutilisable
 */
export class Modal {
    constructor(title, content, options = {}) {
        this.title = title;
        this.content = content;
        this.options = {
            showFooter: true,
            confirmText: 'Confirmer',
            cancelText: 'Annuler',
            onConfirm: null,
            onCancel: null,
            ...options
        };
        this.element = null;
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.animation = 'fadeIn 0.2s ease-out';

        const modal = document.createElement('div');
        modal.className = 'modal-content';
        modal.style.animation = 'scaleIn 0.3s ease-out';

        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
      <h2 class="modal-title">${this.title}</h2>
      <button class="btn btn-ghost" style="padding: 0.5rem;" data-close>
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';
        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else {
            body.appendChild(this.content);
        }

        modal.appendChild(header);
        modal.appendChild(body);

        // Footer
        if (this.options.showFooter) {
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            footer.innerHTML = `
        <button class="btn btn-secondary" data-cancel>${this.options.cancelText}</button>
        <button class="btn btn-primary" data-confirm>${this.options.confirmText}</button>
      `;
            modal.appendChild(footer);
        }

        overlay.appendChild(modal);
        this.element = overlay;

        // Event listeners
        this.setupEventListeners();

        return overlay;
    }

    setupEventListeners() {
        // Fermer au clic sur l'overlay
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });

        // Bouton fermer
        const closeBtn = this.element.querySelector('[data-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Bouton annuler
        const cancelBtn = this.element.querySelector('[data-cancel]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (this.options.onCancel) {
                    this.options.onCancel();
                }
                this.close();
            });
        }

        // Bouton confirmer
        const confirmBtn = this.element.querySelector('[data-confirm]');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.options.onConfirm) {
                    this.options.onConfirm();
                }
            });
        }
    }

    open() {
        document.body.appendChild(this.render());
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (this.element) {
            this.element.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                this.element.remove();
                document.body.style.overflow = '';
            }, 200);
        }
    }
}
