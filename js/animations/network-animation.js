// Network Animation for Hackathon Circle
class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.icons = [
            '💻', '🔧', '⚡', '🚀', '💡', '🔮', '🎮', '🤖',
            '📱', '🌐', '🔍', '📊', '🔐', '📈', '🎯', '🌟'
        ];
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create nodes
        for (let i = 0; i < 20; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 30,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)],
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: 0.8
            });
        }

        // Create connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() < 0.3) {
                    this.connections.push({
                        from: i,
                        to: j,
                        opacity: 0.3
                    });
                }
            }
        }

        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawNode(node) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(var(--accent-rgb), ${node.opacity})`;
        this.ctx.fill();
        
        // Draw icon
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'rgba(var(--bg-rgb), 0.9)';
        this.ctx.fillText(node.icon, node.x, node.y);
    }

    drawConnection(connection) {
        const from = this.nodes[connection.from];
        const to = this.nodes[connection.to];
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = `rgba(var(--accent-rgb), ${connection.opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off walls
            if (node.x < node.radius || node.x > this.canvas.width - node.radius) {
                node.vx *= -1;
            }
            if (node.y < node.radius || node.y > this.canvas.height - node.radius) {
                node.vy *= -1;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => this.drawConnection(connection));
        
        // Draw and update nodes
        this.nodes.forEach(node => this.drawNode(node));
        this.updateNodes();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetworkAnimation();
}); 