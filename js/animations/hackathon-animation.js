// Hackathon Animation
class HackathonAnimation {
    constructor() {
        this.canvas = document.getElementById('hackathon-canvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.elements = [];
        this.codeSnippets = [
            'function hackathon() {',
            'const project = new Idea();',
            'while(!success) {',
            'team.collaborate();',
            'code.innovate();',
            'if(breakthrough) {',
            '  celebrate();',
            '}',
            'return success;',
            '}'
        ];
        
        this.techIcons = [
            '⚛️', // React
            '🌐', // Web
            '🤖', // AI
            '📱', // Mobile
            '🔒', // Security
            '📊', // Data
            '🎮', // Game
            '💡', // Idea
            '🚀', // Launch
            '⚡'  // Fast
        ];

        // Define colors
        this.colors = {
            accent: '#6366f1', // Indigo color
            background: '#ffffff'
        };

        this.isMobile = window.innerWidth < 768;
        this.elementCounts = {
            code: this.isMobile ? 6 : 12,
            icon: this.isMobile ? 8 : 15,
            particle: this.isMobile ? 12 : 20
        };
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.handleResize());
        this.createElements();
        this.animate();
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        if (wasMobile !== this.isMobile) {
            this.elementCounts = {
                code: this.isMobile ? 6 : 12,
                icon: this.isMobile ? 8 : 15,
                particle: this.isMobile ? 12 : 20
            };
            this.elements = [];
            this.createElements();
        }
        
        this.resizeCanvas();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createElements() {
        // Create code snippets
        for (let i = 0; i < this.elementCounts.code; i++) {
            this.elements.push({
                type: 'code',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                text: this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)],
                rotation: Math.random() * Math.PI * 2,
                scale: this.isMobile ? 0.6 + Math.random() * 0.3 : 0.8 + Math.random() * 0.4,
                speed: this.isMobile ? 0.15 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3,
                opacity: 0.6 + Math.random() * 0.4
            });
        }

        // Create tech icons
        for (let i = 0; i < this.elementCounts.icon; i++) {
            this.elements.push({
                type: 'icon',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                icon: this.techIcons[Math.floor(Math.random() * this.techIcons.length)],
                rotation: Math.random() * Math.PI * 2,
                scale: this.isMobile ? 0.8 + Math.random() * 0.4 : 1 + Math.random() * 0.5,
                speed: this.isMobile ? 0.1 + Math.random() * 0.15 : 0.15 + Math.random() * 0.25,
                opacity: 0.7 + Math.random() * 0.3,
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Create particle effects
        for (let i = 0; i < this.elementCounts.particle; i++) {
            this.elements.push({
                type: 'particle',
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: this.isMobile ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
                speed: this.isMobile ? 0.08 + Math.random() * 0.15 : 0.1 + Math.random() * 0.2,
                opacity: 0.3 + Math.random() * 0.4,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    drawCodeSnippet(element) {
        this.ctx.save();
        this.ctx.translate(element.x, element.y);
        this.ctx.rotate(element.rotation);
        this.ctx.scale(element.scale, element.scale);
        
        this.ctx.font = this.isMobile ? '12px "Fira Code", monospace' : '14px "Fira Code", monospace';
        this.ctx.fillStyle = this.hexToRGBA(this.colors.accent, element.opacity);
        this.ctx.textAlign = 'left';
        this.ctx.fillText(element.text, 0, 0);
        
        this.ctx.restore();
    }

    drawTechIcon(element) {
        this.ctx.save();
        this.ctx.translate(element.x, element.y);
        this.ctx.rotate(element.rotation);
        this.ctx.scale(element.scale, element.scale);
        
        const pulseSize = 1 + Math.sin(element.pulse) * 0.2;
        const size = this.isMobile ? 15 : 20;
        
        // Draw glow effect
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * pulseSize);
        gradient.addColorStop(0, this.hexToRGBA(this.colors.accent, element.opacity * 0.3));
        gradient.addColorStop(0.5, this.hexToRGBA(this.colors.accent, element.opacity * 0.1));
        gradient.addColorStop(1, this.hexToRGBA(this.colors.accent, 0));
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * pulseSize, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw icon
        this.ctx.font = this.isMobile ? '20px Arial' : '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = this.hexToRGBA(this.colors.accent, element.opacity);
        this.ctx.fillText(element.icon, 0, 0);
        
        this.ctx.restore();
        
        element.pulse += 0.02;
    }

    drawParticle(element) {
        this.ctx.save();
        this.ctx.translate(element.x, element.y);
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, element.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRGBA(this.colors.accent, element.opacity);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateElements() {
        this.elements.forEach(element => {
            if (element.type === 'particle') {
                element.x += Math.cos(element.angle) * element.speed;
                element.y += Math.sin(element.angle) * element.speed;
                
                if (element.x < 0) element.x = this.canvas.width;
                if (element.x > this.canvas.width) element.x = 0;
                if (element.y < 0) element.y = this.canvas.height;
                if (element.y > this.canvas.height) element.y = 0;
            } else {
                element.x += Math.cos(element.rotation) * element.speed;
                element.y += Math.sin(element.rotation) * element.speed;
                
                const padding = this.isMobile ? 20 : 30;
                if (element.x < padding || element.x > this.canvas.width - padding) {
                    element.rotation = Math.PI - element.rotation;
                }
                if (element.y < padding || element.y > this.canvas.height - padding) {
                    element.rotation = -element.rotation;
                }
                
                element.x = Math.max(padding, Math.min(this.canvas.width - padding, element.x));
                element.y = Math.max(padding, Math.min(this.canvas.height - padding, element.y));
            }
        });
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.elements.forEach(element => {
            switch(element.type) {
                case 'code':
                    this.drawCodeSnippet(element);
                    break;
                case 'icon':
                    this.drawTechIcon(element);
                    break;
                case 'particle':
                    this.drawParticle(element);
                    break;
            }
        });
        
        this.updateElements();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HackathonAnimation();
}); 