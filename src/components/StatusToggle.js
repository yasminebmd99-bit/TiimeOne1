/**
 * Composant toggle de statut
 */
export class StatusToggle {
    constructor(currentStatus, statuses, onChange) {
        this.currentStatus = currentStatus;
        this.statuses = statuses;
        this.onChange = onChange;
        this.element = null;
    }

    getStatusColor(status) {
        const colors = {
            'non injecté': 'var(--color-text-muted)',
            'injecté': 'var(--color-info)',
            'en cours': 'var(--color-warning)',
            'terminé': 'var(--color-success)',
            'En cours': 'var(--color-warning)',
            'Terminé': 'var(--color-success)'
        };
        return colors[status] || 'var(--color-text-secondary)';
    }

    render() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'status-toggle';
        button.style.cssText = `
      padding: 0.375rem 0.75rem;
      border-radius: var(--radius-full);
      border: none;
      font-size: var(--font-size-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-base);
      background: ${this.getStatusColor(this.currentStatus)}22;
      color: ${this.getStatusColor(this.currentStatus)};
      border: 1px solid ${this.getStatusColor(this.currentStatus)}44;
    `;
        button.textContent = this.currentStatus;

        button.addEventListener('click', () => {
            const currentIndex = this.statuses.indexOf(this.currentStatus);
            const nextIndex = (currentIndex + 1) % this.statuses.length;
            this.currentStatus = this.statuses[nextIndex];

            // Update button appearance
            button.textContent = this.currentStatus;
            button.style.background = `${this.getStatusColor(this.currentStatus)}22`;
            button.style.color = this.getStatusColor(this.currentStatus);
            button.style.borderColor = `${this.getStatusColor(this.currentStatus)}44`;

            // Trigger onChange callback
            if (this.onChange) {
                this.onChange(this.currentStatus);
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });

        this.element = button;
        return button;
    }

    getStatus() {
        return this.currentStatus;
    }
}
