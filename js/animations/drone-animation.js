class DroneAnimation {
    constructor() {
        // Wait for initial theme to be applied
        setTimeout(() => {
            this.addLoadingOverlay();
            this.initializeAnimation();
        }, 100);
    }

    initializeAnimation() {
        this.canvas = document.getElementById('drone-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true 
        });
        
        this.phase = 0;
        this.centerX = 0;
        this.amplitude = 2;
        this.frequency = 0.02;
        this.isInitialized = false;
        
        this.init();
    }

    addLoadingOverlay() {
        // Create loading overlay
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'drone-loading-overlay';
        document.querySelector('.hero-section').appendChild(this.loadingOverlay);
    }

    removeLoadingOverlay() {
        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
            this.loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
            }, 500); // Match the fade-out duration
        }
    }

    async init() {
        try {
            await this.setupRenderer();
            await this.createDrone();
            this.setupLights();
            this.setupCamera();
            this.setupEventListeners();
            this.isInitialized = true;
            this.removeLoadingOverlay();
            this.animate();
        } catch (error) {
            console.error('Error initializing drone animation:', error);
            this.removeLoadingOverlay();
        }
    }

    async setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Add loaded class to canvas after setup
        this.canvas.classList.add('loaded');
    }

    createDrone() {
        // Create drone body
        const droneGeometry = new THREE.BoxGeometry(1, 0.2, 1);
        // Get the current theme color immediately
        const currentColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim() || '#333333';
        
        this.droneMaterial = new THREE.MeshPhongMaterial({ 
            color: currentColor,
            shininess: 100
        });
        this.drone = new THREE.Mesh(droneGeometry, this.droneMaterial);

        // Add rotors
        this.rotors = [];
        const rotorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
        const rotorPositions = [
            { x: -0.6, z: -0.6 },
            { x: -0.6, z: 0.6 },
            { x: 0.6, z: -0.6 },
            { x: 0.6, z: 0.6 }
        ];

        rotorPositions.forEach(pos => {
            const rotor = new THREE.Mesh(rotorGeometry, this.droneMaterial);
            rotor.position.set(pos.x, 0.1, pos.z);
            this.drone.add(rotor);
            this.rotors.push(rotor);
        });

        this.scene.add(this.drone);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    setupCamera() {
        this.camera.position.z = 5;
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
        });

        // Update drone color when theme changes - with immediate color update
        this.observer = new MutationObserver(() => {
            const newColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim() || '#333333';
            if (this.droneMaterial) {
                this.droneMaterial.color.setStyle(newColor);
                this.droneMaterial.needsUpdate = true;
            }
        });

        this.observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'class']
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Drone movement
        this.phase += this.frequency;
        this.drone.position.x = this.centerX + Math.sin(this.phase) * this.amplitude;
        this.drone.position.y = Math.sin(this.phase * 2) * 0.2;
        this.drone.rotation.z = Math.sin(this.phase) * 0.1;

        // Rotor rotation
        this.rotors.forEach(rotor => {
            rotor.rotation.y += 0.3;
        });

        this.renderer.render(this.scene, this.camera);
    }
} 