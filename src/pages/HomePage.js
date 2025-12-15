import { config } from '../config.js';
import { ProjectCard } from '../components/ProjectCard.js';

/**
 * Page d'accueil - Design premium et professionnel
 */
export function HomePage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <h1 class="brand-title animate-fade-in">
          <span class="gradient-text" id="blinking-title">TimeOne</span>
        </h1>
        <p class="brand-subtitle animate-fade-in" style="animation-delay: 0.1s;">
          Plateforme de gestion des leads et codes NAF
        </p>
      </header>
      
      <!-- Section de recherche -->
      <section class="search-section animate-slide-up" style="animation-delay: 0.15s;">
        <div class="search-header">
          <div class="search-title">
            <div class="search-title-icon">🔍</div>
            <span>Recherche avancée</span>
          </div>
          <p class="search-description">
            Retrouvez rapidement vos codes NAF et requêtes à travers tous vos projets
          </p>
        </div>
        
        <div class="search-form">
          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="search-code">Code NAF</label>
            <input 
              type="text" 
              id="search-code" 
              class="form-input" 
              placeholder="Ex: 62.01Z, 70.10Z..."
            >
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label" for="search-query">Mots-clés</label>
            <input 
              type="text" 
              id="search-query" 
              class="form-input" 
              placeholder="Ex: développement, marketing..."
            >
          </div>
          <button id="search-btn" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            Rechercher
          </button>
        </div>
        
        <!-- Résultats -->
        <div id="search-results" style="margin-top: var(--spacing-xl); display: none;"></div>
      </section>
      
      <!-- Section projets -->
      <section class="projects-section">
        <div class="section-header-with-action animate-fade-in" style="animation-delay: 0.25s;">
          <div class="section-header-text">
            <h2 class="section-title">Vos projets</h2>
            <p class="section-subtitle">Sélectionnez un projet pour gérer ses codes NAF</p>
          </div>
          <button id="add-project-btn" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Ajouter un projet
          </button>
        </div>
        
        <div id="projects-grid" class="projects-grid"></div>
      </section>
    </div>
  `;

  // Animation du titre
  const titleElement = document.getElementById('blinking-title');
  const words = ['TimeOne', 'Staffy'];
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    titleElement.style.opacity = '0';
    titleElement.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      titleElement.textContent = words[currentIndex];
      titleElement.style.opacity = '1';
      titleElement.style.transform = 'translateY(0)';
    }, 200);
  }, 4000);

  titleElement.style.transition = 'all 0.3s ease-out';
  titleElement.style.display = 'inline-block';

  // Afficher la grille de projets
  renderProjectsGrid();

  // Bouton ajouter projet
  document.getElementById('add-project-btn').addEventListener('click', () => {
    showAddProjectModal();
  });

  // Setup recherche
  setupSearch();
}

/**
 * Rendu de la grille des projets
 */
function renderProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  // Ajouter les cartes projets
  config.projects.forEach((project, index) => {
    const card = ProjectCard(project, (proj) => showDeleteConfirmModal(proj));
    card.style.animationDelay = `${0.3 + index * 0.05}s`;
    grid.appendChild(card);
  });
}

/**
 * Modal de confirmation de suppression
 */
function showDeleteConfirmModal(project) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'delete-confirm-modal';

  modalOverlay.innerHTML = `
    <div class="modal-content" style="max-width: 420px;">
      <div class="modal-header">
        <h3 class="modal-title">Supprimer le projet</h3>
        <button id="close-delete-modal" class="modal-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body" style="text-align: center; padding: var(--spacing-2xl);">
        <div style="
          width: 64px; 
          height: 64px; 
          margin: 0 auto var(--spacing-lg); 
          background: var(--color-error-light); 
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        ">🗑️</div>
        <p style="font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-sm);">
          Êtes-vous sûr ?
        </p>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">
          Le projet <strong style="color: var(--color-primary);">"${project.name}"</strong> sera supprimé définitivement.
        </p>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: var(--spacing-md);">
        <button id="cancel-delete" class="btn btn-secondary">
          Annuler
        </button>
        <button id="confirm-delete" class="btn" style="background: var(--color-error); color: white; box-shadow: 0 4px 14px rgba(244, 67, 54, 0.25);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Supprimer
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeModal = () => modalOverlay.remove();

  document.getElementById('close-delete-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-delete').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.getElementById('confirm-delete').addEventListener('click', () => {
    // Supprimer le projet de la config
    const index = config.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      config.projects.splice(index, 1);
    }

    closeModal();
    showNotification(`Projet "${project.name}" supprimé`, 'success');
    renderProjectsGrid();
  });
}

/**
 * Modal d'ajout de projet
 */
function showAddProjectModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'add-project-modal';

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Nouveau projet</h3>
        <button id="close-add-modal" class="modal-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="new-project-name">Nom du projet *</label>
          <input 
            type="text" 
            id="new-project-name" 
            class="form-input" 
            placeholder="Ex: Mon Nouveau Client"
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label" for="new-project-id">Identifiant</label>
          <input 
            type="text" 
            id="new-project-id" 
            class="form-input" 
            placeholder="Généré automatiquement"
          >
          <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-xs);">
            Utilisé dans l'URL du projet
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button id="cancel-add-project" class="btn btn-secondary">Annuler</button>
        <button id="confirm-add-project" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
          Créer le projet
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  setTimeout(() => document.getElementById('new-project-name').focus(), 100);

  const closeModal = () => modalOverlay.remove();

  document.getElementById('close-add-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-add-project').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.getElementById('confirm-add-project').addEventListener('click', () => {
    const name = document.getElementById('new-project-name').value.trim();
    let id = document.getElementById('new-project-id').value.trim();

    if (!name) {
      showNotification('Le nom du projet est requis', 'error');
      return;
    }

    if (!id) {
      id = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (config.projects.some(p => p.id === id)) {
      showNotification('Un projet avec cet identifiant existe déjà', 'error');
      return;
    }

    config.projects.push({ id, name });
    closeModal();
    showNotification(`Projet "${name}" créé avec succès`, 'success');
    renderProjectsGrid();
  });
}

/**
 * Notification
 */
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(10px)';
    notification.style.transition = 'all 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Configuration de la recherche
 */
async function setupSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchCodeInput = document.getElementById('search-code');
  const searchQueryInput = document.getElementById('search-query');
  const resultsContainer = document.getElementById('search-results');

  const performSearch = async () => {
    const codeQuery = searchCodeInput.value.trim();
    const queryText = searchQueryInput.value.trim();

    if (!codeQuery && !queryText) {
      showNotification('Veuillez entrer un critère de recherche', 'error');
      return;
    }

    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-secondary);">
        <div style="font-size: 1.5rem; margin-bottom: var(--spacing-md); animation: pulse 1s infinite;">⏳</div>
        Recherche en cours...
      </div>
    `;

    const { searchNAFCodes } = await import('../database.js');
    const results = await searchNAFCodes(codeQuery, queryText);
    displayResults(results);
  };

  searchBtn.addEventListener('click', performSearch);
  searchCodeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
  searchQueryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

/**
 * Affichage des résultats
 */
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');

  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-results-empty">
        <div class="search-results-empty-icon">🔍</div>
        <p style="color: var(--color-text-primary); font-weight: 600; margin-bottom: var(--spacing-xs);">
          Aucun résultat trouvé
        </p>
        <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
          Essayez avec d'autres termes
        </p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = `
    <div class="search-results-header">
      <span class="badge badge-success">${results.length} résultat${results.length > 1 ? 's' : ''}</span>
    </div>
    <div class="table-container" style="max-height: 350px; overflow-y: auto;">
      <table>
        <thead>
          <tr>
            <th>Projet</th>
            <th>Code NAF</th>
            <th>Requête</th>
            <th style="width: 100px;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(result => {
    const project = config.projects.find(p => p.id === result.project_id);
    return `
              <tr>
                <td><strong style="color: var(--color-primary);">${project?.name || result.project_id}</strong></td>
                <td><code>${result.code}</code></td>
                <td style="max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${result.query}">${result.query}</td>
                <td>
                  <a href="/projet/${result.project_id}" data-link class="btn btn-ghost" style="padding: 0.5rem 0.75rem; font-size: var(--font-size-xs);">
                    Voir →
                  </a>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Réactiver navigation
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      window.history.pushState(null, null, href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  });
}
