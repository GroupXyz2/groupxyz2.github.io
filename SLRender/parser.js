/**
 * SLRender Parser - Parses custom markup syntax to HTML
 * Supports: <align>, <size>, <color>, <link>, <b>, <u> tags
 */

class SLParser {
    constructor() {
        this.colorHexPattern = /#[0-9A-Fa-f]{6}/g;
        this.alignPattern = /<align="?(center|left|right)"?>/g;
        this.sizePattern = /<size=(\d+)>/g;
        this.colorPattern = /<color=(#[0-9A-Fa-f]{6}|[a-zA-Z]+)>/g;
        this.linkPattern = /<link="([^"]+)">([^<]+)<\/link>/g;
        this.boldPattern = /<b>([^<]+)<\/b>/g;
        this.underlinePattern = /<u>([^<]+)<\/u>/g;
        this.closeTagPattern = /<\/(align|size|color)>/g;
    }

    /**
     * Parse the content string and convert to HTML
     * @param {string} content - Raw content with custom markup
     * @returns {string} - HTML formatted content
     */
    parse(content) {
        if (!content) return '';

        // Split content into lines
        const lines = content.split('\n');
        let result = '';
        let currentAlign = '';
        let currentSize = '';
        let openTags = [];

        for (let line of lines) {
            // Skip empty lines but preserve spacing
            if (line.trim() === '') {
                result += '<div class="content-line">&nbsp;</div>';
                continue;
            }

            let processedLine = line;
            let lineClasses = ['content-line'];
            let lineStyles = [];
            let isImportantNotice = false;

            // Check for important notices (red text)
            if (processedLine.includes('#FE2E2E')) {
                isImportantNotice = true;
            }

            // Parse alignment
            const alignMatch = processedLine.match(/<align="?(center|left|right)"?>/);
            if (alignMatch) {
                currentAlign = alignMatch[1];
                processedLine = processedLine.replace(this.alignPattern, '');
            }

            // Apply current alignment
            if (currentAlign) {
                lineClasses.push(`text-${currentAlign}`);
            }

            // Parse size
            const sizeMatch = processedLine.match(/<size=(\d+)>/);
            if (sizeMatch) {
                currentSize = sizeMatch[1];
                processedLine = processedLine.replace(this.sizePattern, '');
            }

            // Apply current size
            if (currentSize) {
                lineClasses.push(`size-${currentSize}`);
            }

            // Parse colors and apply them
            processedLine = this.parseColors(processedLine);

            // Parse links
            processedLine = this.parseLinks(processedLine);

            // Parse bold text
            processedLine = this.parseBold(processedLine);

            // Parse underlined text
            processedLine = this.parseUnderline(processedLine);

            // Remove closing tags
            processedLine = processedLine.replace(this.closeTagPattern, '');

            // Clean up any remaining angle brackets
            processedLine = processedLine.trim();

            // Wrap important notices
            if (isImportantNotice) {
                result += `<div class="important-notice ${lineClasses.join(' ')}">${processedLine}</div>`;
            } else {
                result += `<div class="${lineClasses.join(' ')}">${processedLine}</div>`;
            }
        }

        return result;
    }

    /**
     * Parse color tags and apply inline styles
     * @param {string} text - Text with color tags
     * @returns {string} - Text with color styles applied
     */
    parseColors(text) {
        return text.replace(/<color=(#[0-9A-Fa-f]{6}|[a-zA-Z]+)>([^<]*(?:<(?!\/color>)[^<]*)*)<\/color>/g, 
            (match, color, content) => {
                // Convert named colors to hex if needed
                const hexColor = this.getHexColor(color);
                return `<span style="color: ${hexColor};">${content}</span>`;
            }
        );
    }

    /**
     * Parse link tags and create clickable links
     * @param {string} text - Text with link tags
     * @returns {string} - Text with HTML links
     */
    parseLinks(text) {
        return text.replace(this.linkPattern, (match, url, linkText) => {
            return `<a href="${url}" class="content-link" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        });
    }

    /**
     * Parse bold tags
     * @param {string} text - Text with bold tags
     * @returns {string} - Text with bold formatting
     */
    parseBold(text) {
        return text.replace(this.boldPattern, '<strong class="bold">$1</strong>');
    }

    /**
     * Parse underline tags
     * @param {string} text - Text with underline tags
     * @returns {string} - Text with underline formatting
     */
    parseUnderline(text) {
        return text.replace(this.underlinePattern, '<span class="underline">$1</span>');
    }

    /**
     * Convert named colors to hex values
     * @param {string} color - Color name or hex value
     * @returns {string} - Hex color value
     */
    getHexColor(color) {
        const namedColors = {
            'white': '#FFFFFF',
            'black': '#000000',
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'yellow': '#FFFF00',
            'cyan': '#00FFFF',
            'magenta': '#FF00FF',
            'orange': '#FFA500',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'brown': '#A52A2A',
            'gray': '#808080',
            'grey': '#808080'
        };

        // If it's already a hex color, return as is
        if (color.startsWith('#')) {
            return color;
        }

        // Return named color or default to white
        return namedColors[color.toLowerCase()] || '#FFFFFF';
    }

    /**
     * Extract special formatting for rule numbers
     * @param {string} content - Content to check for rule formatting
     * @returns {string} - Formatted content
     */
    formatRules(content) {
        // This method can be expanded to handle specific rule formatting
        return content.replace(/^(\d+\.)/, '<span class="rule-number">$1</span>');
    }

    /**
     * Add fade-in animation classes to elements
     * @param {string} html - HTML content
     * @returns {string} - HTML with animation classes
     */
    addAnimations(html) {
        return html.replace(/<div class="content-line/g, '<div class="content-line fade-in');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SLParser;
}

// Make available globally
window.SLParser = SLParser;