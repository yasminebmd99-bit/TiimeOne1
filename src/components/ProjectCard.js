/**
 * Composant carte de projet
 */
export function ProjectCard(project) {
  const card = document.createElement('a');
  card.href = `/projet/${project.id}`;
  card.className = 'card-glass animate-scale-in';
  card.setAttribute('data-link', '');
  card.style.cssText = 'text-decoration: none; cursor: pointer; height: 80px; display: block;';

  card.innerHTML = `
    <div style="
      text-align: center;
      padding: var(--spacing-md);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <h3 style="
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        margin: 0;
      ">
        ${project.name}
      </h3>
    </div>
  `;

  return card;
}
