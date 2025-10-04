/**
 * LocalStorage Manager - Handles content persistence
 * Provides safe storage and retrieval with fallbacks
 */

class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'slrender_content';
        this.BACKUP_KEY = 'slrender_content_backup';
        this.SETTINGS_KEY = 'slrender_settings';
        this.isStorageAvailable = this.checkStorageAvailability();
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} - True if localStorage is available
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
        }
    }

    /**
     * Save content to localStorage
     * @param {string} content - Content to save
     * @returns {boolean} - Success status
     */
    saveContent(content) {
        if (!this.isStorageAvailable) {
            console.warn('Storage not available, cannot save content');
            return false;
        }

        try {
            // Create backup of previous content
            const existingContent = this.loadContent();
            if (existingContent) {
                localStorage.setItem(this.BACKUP_KEY, existingContent);
            }

            // Save new content with timestamp
            const contentData = {
                content: content,
                timestamp: Date.now(),
                version: '1.0'
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contentData));
            
            // Dispatch custom event
            this.dispatchStorageEvent('contentSaved', { content, timestamp: contentData.timestamp });
            
            return true;
        } catch (e) {
            console.error('Failed to save content:', e);
            return false;
        }
    }

    /**
     * Load content from localStorage
     * @returns {string|null} - Loaded content or null
     */
    loadContent() {
        if (!this.isStorageAvailable) {
            return null;
        }

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                return null;
            }

            const contentData = JSON.parse(stored);
            
            // Handle legacy format (just string)
            if (typeof contentData === 'string') {
                return contentData;
            }

            // Handle new format (object)
            if (contentData && contentData.content) {
                return contentData.content;
            }

            return null;
        } catch (e) {
            console.error('Failed to load content:', e);
            return this.loadBackup();
        }
    }

    /**
     * Load backup content
     * @returns {string|null} - Backup content or null
     */
    loadBackup() {
        if (!this.isStorageAvailable) {
            return null;
        }

        try {
            return localStorage.getItem(this.BACKUP_KEY);
        } catch (e) {
            console.error('Failed to load backup:', e);
            return null;
        }
    }

    /**
     * Get content metadata
     * @returns {object|null} - Content metadata
     */
    getContentMetadata() {
        if (!this.isStorageAvailable) {
            return null;
        }

        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (!stored) {
                return null;
            }

            const contentData = JSON.parse(stored);
            
            if (contentData && typeof contentData === 'object') {
                return {
                    timestamp: contentData.timestamp || null,
                    version: contentData.version || 'unknown',
                    size: contentData.content ? contentData.content.length : 0
                };
            }

            return null;
        } catch (e) {
            console.error('Failed to get metadata:', e);
            return null;
        }
    }

    /**
     * Clear all stored content
     * @returns {boolean} - Success status
     */
    clearContent() {
        if (!this.isStorageAvailable) {
            return false;
        }

        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.BACKUP_KEY);
            
            this.dispatchStorageEvent('contentCleared');
            return true;
        } catch (e) {
            console.error('Failed to clear content:', e);
            return false;
        }
    }

    /**
     * Save user settings
     * @param {object} settings - Settings object
     * @returns {boolean} - Success status
     */
    saveSettings(settings) {
        if (!this.isStorageAvailable) {
            return false;
        }

        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    /**
     * Load user settings
     * @returns {object} - Settings object with defaults
     */
    loadSettings() {
        const defaultSettings = {
            autoSave: true,
            livePreview: true,
            theme: 'dark',
            editorFontSize: '0.9rem'
        };

        if (!this.isStorageAvailable) {
            return defaultSettings;
        }

        try {
            const stored = localStorage.getItem(this.SETTINGS_KEY);
            if (!stored) {
                return defaultSettings;
            }

            const settings = JSON.parse(stored);
            return { ...defaultSettings, ...settings };
        } catch (e) {
            console.error('Failed to load settings:', e);
            return defaultSettings;
        }
    }

    /**
     * Export content as downloadable file
     * @param {string} content - Content to export
     * @param {string} filename - Filename for download
     */
    exportContent(content, filename = 'content.txt') {
        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            this.dispatchStorageEvent('contentExported', { filename });
            return true;
        } catch (e) {
            console.error('Failed to export content:', e);
            return false;
        }
    }

    /**
     * Import content from file
     * @param {File} file - File to import
     * @returns {Promise<string>} - Promise resolving to file content
     */
    importContent(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
                reject(new Error('Only .txt files are supported'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    this.dispatchStorageEvent('contentImported', { filename: file.name });
                    resolve(content);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file, 'utf-8');
        });
    }

    /**
     * Get default template content
     * @returns {string} - Template content
     */
    getDefaultTemplate() {
        return `<align="center"><size=36><color=#FF66CC>Mein</color><color=#7116FF> Titel</color></size></align>

<align="center"><size=18><color=#4866FD>Untertitel</color></size></align>
<align="center"><size=16><color=#FFFFFF>Eine kurze Beschreibung</color></size></align>

<align="left"><size=17><color=#58A2E2>Inhalt:</color></size></align>
<size=16>
<color=#FFFF00>1.</color> Erster Punkt
<color=#FFFF00>2.</color> Zweiter Punkt
   <color=#FFFF00>a.</color> Unterpunkt
   <color=#FFFF00>b.</color> Noch ein Unterpunkt

<link="https://example.com"><color=#5AA3E2><u>Ein Link</u></color></link>

<b>Fetter Text</b> und <u>unterstrichener Text</u>

<align="center"><color=#FE2E2E>Wichtiger Hinweis!</color></align>
</size>`;
    }

    /**
     * Dispatch custom storage events
     * @param {string} eventType - Type of event
     * @param {object} detail - Event details
     */
    dispatchStorageEvent(eventType, detail = {}) {
        const event = new CustomEvent(`slrender:${eventType}`, {
            detail: detail
        });
        window.dispatchEvent(event);
    }

    /**
     * Get storage usage information
     * @returns {object} - Storage usage stats
     */
    getStorageInfo() {
        if (!this.isStorageAvailable) {
            return { available: false };
        }

        try {
            const content = localStorage.getItem(this.STORAGE_KEY);
            const backup = localStorage.getItem(this.BACKUP_KEY);
            const settings = localStorage.getItem(this.SETTINGS_KEY);

            return {
                available: true,
                contentSize: content ? content.length : 0,
                backupSize: backup ? backup.length : 0,
                settingsSize: settings ? settings.length : 0,
                totalSize: (content ? content.length : 0) + 
                          (backup ? backup.length : 0) + 
                          (settings ? settings.length : 0)
            };
        } catch (e) {
            return { available: false, error: e.message };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

// Make available globally
window.StorageManager = StorageManager;