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
}
