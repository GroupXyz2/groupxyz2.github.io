/**
 * SLRender App - Main application logic
 * Handles loading content and rendering with the parser
 */

class SLRenderApp {
    constructor() {
        this.parser = new SLParser();
        this.contentElement = document.getElementById('content');
        this.loadingElement = document.getElementById('loading');
        this.animationDelay = 100; // Delay between line animations
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.loadContent();
        } catch (error) {
            this.showError('Fehler beim Laden des Contents: ' + error.message);
        }
    }

    /**
     * Load content from content.txt file
     */
    async loadContent() {
        try {
            // For GitHub Pages, we'll embed the content directly
            // This is because fetch() might not work with local files
            const response = await this.fetchContent();
            
            if (response) {
                await this.renderContent(response);
            } else {
                // Fallback: Use embedded content
                await this.loadEmbeddedContent();
            }
        } catch (error) {
            console.warn('Failed to fetch content.txt, using embedded content:', error);
            await this.loadEmbeddedContent();
        }
    }

    /**
     * Try to fetch content.txt
     */
    async fetchContent() {
        try {
            const response = await fetch('./content.txt');
            if (response.ok) {
                return await response.text();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Load embedded content as fallback
     */
    async loadEmbeddedContent() {
        // Embedded content from the original file
        const embeddedContent = `<align="center"><size=36><color=#FF66CC>L</color><color=#E356D6>o</color><color=#C646E0>t</color><color=#AA36EA>u</color><color=#8E26F4>s</color><color=#7116FF>N</color><color=#5A11CC>e</color><color=#440C99>t</color><color=#2D0866>w</color><color=#170433>o</color><color=#0A0219>r</color><color=#000000>k</color></size></align>
 
<align="center"><size=18><color=#4866FD>Kontakt</color></size></align>
<align="center"><size=16><color=#FFFFFF>Bei Fragen, öffne ein Ticket auf unserem Discord</color></size></align>
<align="center"><size=16><color=#ff62ba>Dieser Server wird betrieben als auch aktiv entwickelt vom Lotus Network Team</color></size></align>
<align="center"><size=16><color=#cc9abd>Please refrain from speaking any other language than German or English on this server!</color></size></align>
 
<align="center"><size=18><color=#3B5AF6>Unser Discord</color></size></align>
<align="center"><size=16><b>---> <link="https://discord.gg/qrAdHa9Jbx"><color=#5AA3E2><u>Hier klicken</u></color></link> <---</b></size></align>
 
<align="left"><size=17><color=#58A2E2>Regelwerk:</color></size></align>
<size=10>
<color=#FFFF00>1.</color> Beleidigungen
   <color=#FFFF00>a.</color> Beleidigungen, Respektlosigkeit, Drohungen, Rassismus usw. sind verboten.
<color=#FFFF00>2.</color> Supportflucht
   <color=#FFFF00>a.</color> Ein Supportgespräch unangekündigt zu verlassen ist verboten.
   <color=#FFFF00>b.</color> Ein Supportgespräch in irgendeiner Art zu behindern ist verboten.
<color=#FFFF00>3.</color> Team-Trolling
   <color=#FFFF00>a.</color> Exzessives Team-Trolling ist verboten.
<color=#FFFF00>4.</color> Soundboard
   <color=#FFFF00>a.</color> Die Nutzung eines Soundboards außerhalb des Proximity-Sprachchats und der Intercom ist verboten.
   <color=#FFFF00>b.</color> Bei Beschwerden über ein Soundboard ist es zu deaktivieren.
<color=#FFFF00>5.</color> Report-Abuse
   <color=#FFFF00>a.</color> Das Ausnutzen der Reportfunktion ist verboten.
<color=#FFFF00>6.</color> Camping
   <color=#FFFF00>a.</color> Längeres Einsperren in einem Raum zur Gefahrenvermeidung ist verboten.
   <color=#FFFF00>b.</color> Längeres Verweilen vor einem Raum, in dem sich ein Spieler versteckt, ist verboten.
   <color=#FFFF00>c.</color> In SCP-914 ist es verboten, länger als 4 Minuten zu verweilen, wenn keine Karte aufgewertet wird.
   <color=#FFFF00>d.</color> Das Verweilen in einem nah gelegenen Raum zählt weiterhin als Camping.
<color=#FFFF00>7.</color> Rollenflucht
   <color=#FFFF00>a.</color> Selbstmord, egal welcher Art, ist verboten.
<color=#FFFF00>8.</color> Bug-Abusing
   <color=#FFFF00>a.</color> Das Ausnutzen von Bugs/Glitches ist verboten.
   <color=#FFFF00>b.</color> Das Hacken/Modifizieren des Clients ist verboten und wird gegebenenfalls Northwood gemeldet.
<color=#FFFF00>9.</color> Diebstahl
   <color=#FFFF00>a.</color> Das Stehlen von Items in SCP-914 ist verboten.
<color=#FFFF00>10.</color> Teaming
   <color=#FFFF00>a.</color> Teaming mit einer feindlichen Fraktion ist verboten.
   <color=#FFFF00>b.</color> Teaming darf nicht zu einer unnötigen Verlängerung der Runde führen.
   <color=#FFFF00>c.</color> Die Tutorial-Klasse ist von den Teaming-Regeln ausgenommen.
   <color=#FFFF00>d.</color> Das Erklären des Spiels an neue Spieler ist erlaubt, darf aber nicht ausgenutzt werden.
<color=#FFFF00>11.</color> Gefesselte Klassen
   <color=#FFFF00>a.</color> Wenn sich eine Klasse offensichtlich ergibt, muss sie gefesselt werden.
   <color=#FFFF00>b.</color> Das Vortäuschen der Kapitulation ist verboten.
   <color=#FFFF00>c.</color> Eine gefesselte Klasse darf nicht getötet werden, solange sie kooperiert.
   <color=#FFFF00>d.</color> Das Erteilen von Befehlen, die zum Tod einer gefesselten Einheit führen, ist verboten.
   <color=#FFFF00>e.</color> Das grundlose Töten von Klasse-D und Wissenschaftlern ist verboten.
   <color=#FFFF00>f.</color> Wenn eine Einheit sich nach der ersten Aufforderung nicht ergibt, müssen keine weiteren Kooperationsversuche unternommen werden.
   <color=#FFFF00>g.</color> Wenn eine Einheit eine Fraktion einmal attackiert hat, können ihre weiteren Kapitulationsversuche ignoriert werden.
<color=#FFFF00>12.</color> Bann-Umgehung
   <color=#FFFF00>a.</color> Das Umgehen eines Banns ist verboten.
<color=#FFFF00>13.</color> Rundenende
   <color=#FFFF00>a.</color> Das unnötige Herauszögern der Runde ist verboten.
   <color=#FFFF00>b.</color> Sollte ein Spieler sich ergeben haben, jedoch als letzter übrig sein, darf dieser erschossen werden, wenn bestätigt wurde, dass er der Letzte ist, um die Runde zu verkürzen.
   <color=#FFFF00>c.</color> Das Erklären des Spiels an neue Spieler darf die Runde nicht übermäßig in die Länge ziehen.

<align="center"><color=#FE2E2E>Es gilt das Hausrecht!</color></align>
<align="center"><color=#FE2E2E>Sollte ein Teammitglied eine Anweisung geben, so wird diese auch befolgt.</color></align>
<align="center"><color=#FE2E2E>Beschwerden gegen ein Teammitglied bitte via Ticket auf Discord.</color></align>
<align="center"><color=#FE2E2E>Unwissenheit schützt nicht vor Strafe!!</color></align>
</size>`;

        await this.renderContent(embeddedContent);
    }

    /**
     * Render content using the parser
     * @param {string} rawContent - Raw content to parse and render
     */
    async renderContent(rawContent) {
        try {
            // Hide loading indicator
            this.loadingElement.style.display = 'none';
            
            // Parse the content
            const parsedContent = this.parser.parse(rawContent);
            
            // Set the content
            this.contentElement.innerHTML = parsedContent;
            
            // Add scroll animations
            this.animateContent();
            
            // Make content visible
            this.contentElement.style.opacity = '1';
            
        } catch (error) {
            this.showError('Fehler beim Rendern des Contents: ' + error.message);
        }
    }

    /**
     * Add scroll-triggered animations to content
     */
    animateContent() {
        const lines = this.contentElement.querySelectorAll('.content-line');
        
        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('fade-in');
                    }, index * 50); // Staggered animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all content lines
        lines.forEach(line => {
            observer.observe(line);
        });
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.loadingElement.style.display = 'none';
        this.contentElement.innerHTML = `
            <div class="error-message" style="
                background: rgba(254, 46, 46, 0.2);
                border: 1px solid #FE2E2E;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                color: #FE2E2E;
                margin: 20px 0;
            ">
                <h3>⚠️ Fehler</h3>
                <p>${message}</p>
                <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                    Bitte überprüfe die Konsole für weitere Details.
                </p>
            </div>
        `;
        console.error('SLRender Error:', message);
    }

    /**
     * Reload content (useful for development)
     */
    async reload() {
        this.contentElement.innerHTML = '';
        this.contentElement.style.opacity = '0';
        this.loadingElement.style.display = 'flex';
        await this.loadContent();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SLRenderApp();
    app.init();
    
    // Make app globally available for debugging
    window.slRenderApp = app;
    
    // Add keyboard shortcut for reload (F5 or Ctrl+R)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            app.reload();
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SLRenderApp;
}