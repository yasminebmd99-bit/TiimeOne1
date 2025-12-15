/**
 * Composant carte de projet - Design premium avec suppression
 */

// Génère une icône basée sur le nom du projet
function getProjectIcon(projectName) {
  const icons = {
    '6xpos': '💳',
    'ayvens': '🚗',
    'canal': '📺',
    'danone': '🥛',
    'ebp': '📊',
    'herschenbach': '🏭',
    'hyundai': '🚙',
    'quadra': '📐',
    'sage': '💼',
    'staffy': '👥'
  };
  return icons[projectName.toLowerCase()] || '📁';
}

export function ProjectCard(project, onDelete) {
  const card = document.createElement('div');
  card.className = 'project-card animate-scale-in';
  card.id = `project-card-${project.id}`;

  const icon = getProjectIcon(project.id);

  card.innerHTML = `
    <button class="card-delete-btn" title="Supprimer le projet" aria-label="Supprimer ${project.name}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"></path>
      </svg>
    </button>
    <a href="/projet/${project.id}" data-link class="card-link">
      <div class="card-icon">${icon}</div>
      <h3 class="card-title">${project.name}</h3>
    </a>
  `;

  // Gestion du clic sur le lien
  const link = card.querySelector('.card-link');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState(null, null, link.getAttribute('href'));
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  // Gestion de la suppression
  const deleteBtn = card.querySelector('.card-delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(project);
    }
  });

  return card;
}

/**
 * Composant bouton d'ajout de projet
 */
export function AddProjectCard(onClick) {
  const card = document.createElement('div');
  card.className = 'add-project-card animate-scale-in';
  card.id = 'add-project-card';

  card.innerHTML = `
    <div class="add-icon">+</div>
    <span class="add-text">Nouveau projet</span>
  `;

  card.addEventListener('click', onClick);

  return card;
}
