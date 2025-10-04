/**
 * SLRender App - Main application logic
 * Handles loading content, editing, and rendering with the parser
 */

class SLRenderApp {
    constructor() {
        this.parser = new SLParser();
        this.storage = new StorageManager();
        this.contentElement = document.getElementById('content');
        this.loadingElement = document.getElementById('loading');
        this.editorWrapper = document.getElementById('editorWrapper');
        this.contentEditor = document.getElementById('contentEditor');
        this.livePreview = document.getElementById('livePreview');
        this.fileInput = document.getElementById('fileInput');
        
        this.isEditorMode = false;
        this.autoSaveTimer = null;
        this.settings = this.storage.loadSettings();
        
        this.initializeEventListeners();
        this.animationDelay = 100;
    }

    /**
     * Initialize event listeners for UI controls
     */
    initializeEventListeners() {
        // Control buttons
        document.getElementById('toggleEditor').addEventListener('click', () => this.toggleEditor());
        document.getElementById('saveContent').addEventListener('click', () => this.saveContent());
        document.getElementById('exportContent').addEventListener('click', () => this.exportContent());
        document.getElementById('importContent').addEventListener('click', () => this.importContent());
        document.getElementById('resetContent').addEventListener('click', () => this.resetContent());
        
        // Editor buttons
        document.getElementById('previewContent').addEventListener('click', () => this.updatePreview());
        document.getElementById('insertTemplate').addEventListener('click', () => this.insertTemplate());
        
        // Editor events
        this.contentEditor.addEventListener('input', () => this.onEditorInput());
        this.contentEditor.addEventListener('keydown', (e) => this.onEditorKeydown(e));
        
        // File input
        this.fileInput.addEventListener('change', (e) => this.onFileSelected(e));
        
        // Storage events
        window.addEventListener('slrender:contentSaved', (e) => this.onContentSaved(e));
        window.addEventListener('slrender:contentImported', (e) => this.onContentImported(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
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
     * Load content - first from localStorage, then fallback to embedded
     */
    async loadContent() {
        try {
            // Try to load from localStorage first
            const storedContent = this.storage.loadContent();
            
            if (storedContent) {
                await this.renderContent(storedContent);
                this.contentEditor.value = storedContent;
                this.showMessage('Content aus LocalStorage geladen', 'success');
            } else {
                // Fallback to embedded content
                await this.loadEmbeddedContent();
            }
        } catch (error) {
            console.warn('Failed to load stored content, using embedded content:', error);
            await this.loadEmbeddedContent();
        }
    }

    /**
     * Load embedded content as fallback
     */
    async loadEmbeddedContent() {
        const embeddedContent = this.getEmbeddedContent();
        await this.renderContent(embeddedContent);
        this.contentEditor.value = embeddedContent;
        
        // Auto-save embedded content for future use
        this.storage.saveContent(embeddedContent);
    }

    /**
     * Get embedded content (same as before)
     */
    getEmbeddedContent() {
        return `<align="center"><size=36><color=#FF66CC>L</color><color=#E356D6>o</color><color=#C646E0>t</color><color=#AA36EA>u</color><color=#8E26F4>s</color><color=#7116FF>N</color><color=#5A11CC>e</color><color=#440C99>t</color><color=#2D0866>w</color><color=#170433>o</color><color=#0A0219>r</color><color=#000000>k</color></size></align>
 
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
    }

    /**
     * Toggle editor mode
     */
    toggleEditor() {
        this.isEditorMode = !this.isEditorMode;
        const toggleBtn = document.getElementById('toggleEditor');
        const saveBtn = document.getElementById('saveContent');
        
        if (this.isEditorMode) {
            this.editorWrapper.style.display = 'block';
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<span class="btn-icon">👁️</span><span class="btn-text">Vorschau</span>';
            saveBtn.style.display = 'flex';
            
            // Update live preview
            this.updatePreview();
        } else {
            this.editorWrapper.style.display = 'none';
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<span class="btn-icon">✏️</span><span class="btn-text">Editor</span>';
            saveBtn.style.display = 'none';
            
            // Update main content
            this.renderContent(this.contentEditor.value);
        }
    }

    /**
     * Save content to localStorage
     */
    saveContent() {
        const content = this.contentEditor.value;
        const success = this.storage.saveContent(content);
        
        if (success) {
            this.showMessage('Content erfolgreich gespeichert!', 'success');
            this.renderContent(content);
        } else {
            this.showMessage('Fehler beim Speichern!', 'error');
        }
    }

    /**
     * Export content as file
     */
    exportContent() {
        const content = this.contentEditor.value || this.storage.loadContent() || this.getEmbeddedContent();
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `content_${timestamp}.txt`;
        
        const success = this.storage.exportContent(content, filename);
        if (success) {
            this.showMessage(`Content als ${filename} exportiert!`, 'success');
        } else {
            this.showMessage('Fehler beim Export!', 'error');
        }
    }

    /**
     * Import content from file
     */
    importContent() {
        this.fileInput.click();
    }

    /**
     * Reset content to default template
     */
    resetContent() {
        if (confirm('Möchtest du den Content wirklich zurücksetzen? Alle Änderungen gehen verloren!')) {
            const template = this.storage.getDefaultTemplate();
            this.contentEditor.value = template;
            this.updatePreview();
            this.showMessage('Content zurückgesetzt!', 'info');
        }
    }

    /**
     * Insert template at cursor position
     */
    insertTemplate() {
        const template = this.storage.getDefaultTemplate();
        const editor = this.contentEditor;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        
        const before = editor.value.substring(0, start);
        const after = editor.value.substring(end);
        
        editor.value = before + template + after;
        editor.focus();
        editor.setSelectionRange(start + template.length, start + template.length);
        
        this.updatePreview();
    }

    /**
     * Update live preview
     */
    updatePreview() {
        if (this.settings.livePreview && this.isEditorMode) {
            const content = this.contentEditor.value;
            const parsedContent = this.parser.parse(content);
            this.livePreview.innerHTML = parsedContent;
            this.animateContent(this.livePreview);
        }
    }

    /**
     * Handle editor input (auto-save and live preview)
     */
    onEditorInput() {
        // Live preview update
        if (this.settings.livePreview) {
            clearTimeout(this.previewTimer);
            this.previewTimer = setTimeout(() => this.updatePreview(), 300);
        }
        
        // Auto-save
        if (this.settings.autoSave) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = setTimeout(() => {
                this.storage.saveContent(this.contentEditor.value);
            }, 2000);
        }
    }

    /**
     * Handle editor keyboard shortcuts
     */
    onEditorKeydown(e) {
        // Tab indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = e.target.value;
            
            e.target.value = value.substring(0, start) + '   ' + value.substring(end);
            e.target.setSelectionRange(start + 3, start + 3);
        }
        
        // Ctrl+S for save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveContent();
        }
    }

    /**
     * Handle file selection for import
     */
    async onFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const content = await this.storage.importContent(file);
            this.contentEditor.value = content;
            this.updatePreview();
            this.showMessage(`Datei ${file.name} erfolgreich importiert!`, 'success');
        } catch (error) {
            this.showMessage(`Import-Fehler: ${error.message}`, 'error');
        } finally {
            e.target.value = ''; // Reset file input
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Toggle editor with F2
        if (e.key === 'F2') {
            e.preventDefault();
            this.toggleEditor();
        }
        
        // Save with Ctrl+S (when not in editor)
        if (e.ctrlKey && e.key === 's' && !this.isEditorMode) {
            e.preventDefault();
            this.saveContent();
        }
        
        // Export with Ctrl+E
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            this.exportContent();
        }
    }

    /**
     * Handle content saved event
     */
    onContentSaved(e) {
        console.log('Content saved:', e.detail);
    }

    /**
     * Handle content imported event
     */
    onContentImported(e) {
        console.log('Content imported:', e.detail);
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.innerHTML = `
            <span class="message-icon">${this.getMessageIcon(type)}</span>
            <span class="message-text">${message}</span>
        `;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(10px)',
            animation: 'slideInRight 0.3s ease'
        });
        
        // Set background based on type
        const backgrounds = {
            success: 'rgba(40, 167, 69, 0.9)',
            error: 'rgba(220, 53, 69, 0.9)',
            warning: 'rgba(255, 193, 7, 0.9)',
            info: 'rgba(23, 162, 184, 0.9)'
        };
        messageEl.style.background = backgrounds[type] || backgrounds.info;
        
        document.body.appendChild(messageEl);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, 3000);
    }

    /**
     * Get icon for message type
     */
    getMessageIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
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
            this.animateContent(this.contentElement);
            
            // Make content visible
            this.contentElement.style.opacity = '1';
            
        } catch (error) {
            this.showError('Fehler beim Rendern des Contents: ' + error.message);
        }
    }

    /**
     * Add scroll-triggered animations to content
     * @param {Element} container - Container element to animate
     */
    animateContent(container = this.contentElement) {
        const lines = container.querySelectorAll('.content-line');
        
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