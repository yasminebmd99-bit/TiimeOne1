// Système de routage simple côté client
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;

        // Écouter les changements d'URL
        window.addEventListener('popstate', () => this.handleRoute());

        // Intercepter les clics sur les liens
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.getAttribute('href'));
            }
        });
    }

    /**
     * Enregistre une route
     */
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    /**
     * Navigue vers une URL
     */
    navigate(url) {
        window.history.pushState(null, null, url);
        this.handleRoute();
    }

    /**
     * Gère le routage actuel
     */
    async handleRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;

        // Trouver la route correspondante
        let handler = null;
        let params = {};

        // Route exacte
        if (this.routes[path]) {
            handler = this.routes[path];
        } else {
            // Routes avec paramètres
            for (const [route, routeHandler] of Object.entries(this.routes)) {
                const match = this.matchRoute(route, path);
                if (match) {
                    handler = routeHandler;
                    params = match;
                    break;
                }
            }
        }

        // Exécuter le handler ou afficher 404
        if (handler) {
            await handler(params);
        } else {
            this.show404();
        }
    }

    /**
     * Vérifie si un chemin correspond à une route avec paramètres
     */
    matchRoute(route, path) {
        const routeParts = route.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                // Paramètre dynamique
                const paramName = routeParts[i].slice(1);
                params[paramName] = decodeURIComponent(pathParts[i]);
            } else if (routeParts[i] !== pathParts[i]) {
                // Partie fixe ne correspond pas
                return null;
            }
        }

        return params;
    }

    /**
     * Affiche une page 404
     */
    show404() {
        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="container" style="padding-top: 4rem; text-align: center;">
        <h1 style="font-size: 4rem; margin-bottom: 1rem;">404</h1>
        <p style="font-size: 1.5rem; color: var(--color-text-secondary); margin-bottom: 2rem;">
          Page non trouvée
        </p>
        <a href="/" data-link class="btn btn-primary">
          Retour à l'accueil
        </a>
      </div>
    `;
    }

    /**
     * Démarre le routeur
     */
    start() {
        this.handleRoute();
    }
}

export const router = new Router();
