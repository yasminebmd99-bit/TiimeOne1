import { config } from '../config.js';
import { ProjectCard } from '../components/ProjectCard.js';

/**
 * Page d'accueil avec les cartes de projets
 */
export function HomePage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container" style="padding: var(--spacing-3xl) var(--spacing-lg);">
      <header style="text-align: center; margin-bottom: var(--spacing-3xl);">
        <h1 class="gradient-text animate-fade-in" style="
          font-size: var(--font-size-4xl);
          font-weight: 800;
          margin-bottom: var(--spacing-md);
          letter-spacing: -0.02em;
        ">
          <span id="blinking-title">TimeOne</span>
        </h1>
        <p class="animate-fade-in" style="
          color: var(--color-text-secondary);
          font-size: var(--font-size-lg);
          animation-delay: 0.1s;
        ">
          Gestion des leads et codes NAF
        </p>
      </header>
      
      <!-- Filtre de recherche -->
      <div style="
        max-width: 800px;
        margin: 0 auto var(--spacing-3xl);
        padding: var(--spacing-lg);
        background: var(--color-bg-secondary);
        border-radius: var(--radius-lg);
        border: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <h3 style="margin-bottom: var(--spacing-md); font-size: var(--font-size-lg);">
          🔍 Recherche approfondie
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: var(--spacing-md);">
          <div class="form-group" style="margin: 0;">
            <input 
              type="text" 
              id="search-code" 
              class="form-input" 
              placeholder="Code NAF (ex: 62.01Z)"
            >
          </div>
          <div class="form-group" style="margin: 0;">
            <input 
              type="text" 
              id="search-query" 
              class="form-input" 
              placeholder="Requête"
            >
          </div>
          <button id="search-btn" class="btn btn-primary">
            Rechercher
          </button>
        </div>
        
        <!-- Résultats de recherche -->
        <div id="search-results" style="margin-top: var(--spacing-md); display: none;"></div>
      </div>
      
      <div id="projects-grid" style="
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        max-width: 1000px;
        margin: 0 auto;
      "></div>
    </div>
  `;

  // Animation du titre qui clignote entre TimeOne et Staffy
  const titleElement = document.getElementById('blinking-title');
  const words = ['TimeOne', 'Staffy'];
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % words.length;
    titleElement.textContent = words[currentIndex];
  }, 2000); // Change toutes les 2 secondes

  const grid = document.getElementById('projects-grid');

  // Ajouter les cartes de projets avec animation échelonnée
  config.projects.forEach((project, index) => {
    const card = ProjectCard(project);
    card.style.animationDelay = `${index * 0.05}s`;
    grid.appendChild(card);
  });

  // Fonctionnalité de recherche
  setupSearch();
}

async function setupSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchCodeInput = document.getElementById('search-code');
  const searchQueryInput = document.getElementById('search-query');
  const resultsContainer = document.getElementById('search-results');

  const performSearch = async () => {
    const codeQuery = searchCodeInput.value.trim();
    const queryText = searchQueryInput.value.trim();

    if (!codeQuery && !queryText) {
      alert('Veuillez entrer au moins un critère de recherche');
      return;
    }

    // Import dynamique pour éviter les dépendances circulaires
    const { searchNAFCodes } = await import('../database.js');
    const results = await searchNAFCodes(codeQuery, queryText);

    displayResults(results);
  };

  searchBtn.addEventListener('click', performSearch);

  // Recherche avec Enter
  searchCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  searchQueryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');

  if (results.length === 0) {
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
      <p style="text-align: center; color: var(--color-text-secondary); padding: var(--spacing-lg);">
        Aucun résultat trouvé
      </p>
    `;
    return;
  }

  resultsContainer.style.display = 'block';
  resultsContainer.innerHTML = `
    <h4 style="margin-bottom: var(--spacing-md);">${results.length} résultat(s) trouvé(s)</h4>
    <div style="max-height: 400px; overflow-y: auto;">
      <table style="width: 100%;">
        <thead>
          <tr>
            <th>Projet</th>
            <th>Code NAF</th>
            <th>Requête</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(result => {
    const project = config.projects.find(p => p.id === result.project_id);
    return `
              <tr>
                <td><strong>${project?.name || result.project_id}</strong></td>
                <td>${result.code}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${result.query}">${result.query}</td>
                <td>
                  <a href="/projet/${result.project_id}" data-link class="btn btn-ghost" style="font-size: var(--font-size-sm); padding: 0.25rem 0.5rem;">
                    Voir le projet
                  </a>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Réactiver la navigation pour les liens dynamiques
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      window.history.pushState(null, null, href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  });
}
