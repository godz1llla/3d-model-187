/**
 * 3D Model Viewer using Three.js
 * Loads and displays GLB models with interactive controls
 */

class ModelViewer3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = {
            mouseX: 0,
            mouseY: 0,
            targetX: 0,
            targetY: 0,
            isMouseDown: false
        };
        this.cameraDistance = 5;
        this.zoomMin = 2;
        this.zoomMax = 10;

        // Wait for Three.js to load
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            return;
        }

        this.init();
    }

    /**
     * Initialize Three.js scene
     */
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background

        // Camera
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        directionalLight1.castShadow = true;
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-5, -5, -5);
        this.scene.add(directionalLight2);

        // Setup controls
        this.setupControls();

        // Setup fullscreen
        this.setupFullscreen();

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();
    }

    /**
     * Setup mouse controls
     */
    setupControls() {
        const canvas = this.renderer.domElement;

        // Mouse move
        canvas.addEventListener('mousemove', (e) => {
            if (this.controls.isMouseDown) {
                const rect = canvas.getBoundingClientRect();
                this.controls.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                this.controls.mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            }
        });

        // Mouse down
        canvas.addEventListener('mousedown', () => {
            this.controls.isMouseDown = true;
            canvas.style.cursor = 'grabbing';
        });

        // Mouse up
        canvas.addEventListener('mouseup', () => {
            this.controls.isMouseDown = false;
            canvas.style.cursor = 'grab';
        });

        // Mouse leave
        canvas.addEventListener('mouseleave', () => {
            this.controls.isMouseDown = false;
            canvas.style.cursor = 'grab';
        });

        // Wheel zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomSpeed = 0.1;
            const delta = e.deltaY * zoomSpeed;
            this.camera.position.z += delta * 0.01;
            this.camera.position.z = Math.max(this.zoomMin, Math.min(this.zoomMax, this.camera.position.z));
        });

        canvas.style.cursor = 'grab';
    }

    /**
     * Setup fullscreen functionality
     */
    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen().then(() => {
                this.container.classList.add('fullscreen');
                this.onWindowResize();
            }).catch(err => {
                console.error('Error entering fullscreen:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                this.container.classList.remove('fullscreen');
                this.onWindowResize();
            });
        }
    }

    /**
     * Load GLB model
     */
    async loadModel(modelFileName) {
        // Clear existing model
        if (this.model) {
            this.scene.remove(this.model);
            this.model = null;
        }

        if (!modelFileName) {
            console.error('No model file name provided');
            return;
        }

        try {
            // Check if GLTFLoader is available (GLTFLoader.js exports as THREE.GLTFLoader)
            let LoaderClass = null;
            if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
                LoaderClass = THREE.GLTFLoader;
            } else if (typeof GLTFLoader !== 'undefined') {
                LoaderClass = GLTFLoader;
            } else {
                console.error('GLTFLoader is not loaded. THREE:', typeof THREE, 'THREE.GLTFLoader:', typeof THREE !== 'undefined' ? typeof THREE.GLTFLoader : 'THREE undefined');
                this.container.innerHTML = '<p style="padding: 20px; text-align: center; color: #E74C3C;">3D модельдерді жүктеу қолжетімсіз. GLTFLoader жүктелмеген. Консольді тексеріңіз (F12).</p>';
                return;
            }

            const loader = new LoaderClass();
            // Encode filename but preserve slashes for subdirectories
            const modelPath = 'models/' + modelFileName.split('/').map(part => encodeURIComponent(part)).join('/');
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    modelPath,
                    resolve,
                    (progress) => {
                        if (progress.total > 0) {
                            console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
                        }
                    },
                    (err) => reject(err instanceof Error ? err : new Error(err && err.message ? err.message : 'Файл жүктелмеді'))
                );
            });

            this.model = gltf.scene;
            this.scene.add(this.model);

            // Compute bounding box in world space (model may have nested transforms)
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Center: move model so its bounding box center is at origin
            this.model.position.x = -center.x;
            this.model.position.y = -center.y;
            this.model.position.z = -center.z;

            // Recompute box after centering (in case of nested transforms)
            box.setFromObject(this.model);
            const size2 = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size2.x, size2.y, size2.z, 0.001);
            let scale = 2 / maxDim;
            scale = Math.max(0.01, Math.min(1000, scale));
            this.model.scale.setScalar(scale);

            // Fit camera to model: use bounding sphere and set distance so model fits in view
            const sphere = box.getBoundingSphere(new THREE.Sphere());
            const radius = sphere.radius;
            const distance = Math.max(radius * 2.5, 2);
            this.cameraDistance = distance;
            this.zoomMin = Math.max(0.5, distance / 4);
            this.zoomMax = Math.max(10, distance * 2);
            this.camera.position.set(0, 0, distance);
            this.camera.lookAt(0, 0, 0);
            this.camera.near = Math.max(0.01, distance / 100);
            this.camera.far = Math.max(1000, distance * 10);
            this.camera.updateProjectionMatrix();

        } catch (error) {
            console.error('Error loading model:', error);
            const msg = (error && error.message) ? error.message : 'Файл табылмады немесе жүктеу сәтсіз аяқталды.';
            this.container.innerHTML = '<div style="padding: 20px; text-align: center; color: #E74C3C;"><p style="margin-bottom: 10px;">3D модельді жүктеу қатесі</p><p style="font-size: 0.9rem; color: #7F8C8D;">' + msg + '</p><p style="font-size: 0.8rem; margin-top: 10px; color: #7F8C8D;">Файл: models/' + (modelFileName || '') + '</p></div>';
        }
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth rotation (auto-rotate)
        if (this.model && !this.controls.isMouseDown) {
            this.model.rotation.y += 0.005;
        }

        // Mouse-controlled rotation
        if (this.controls.isMouseDown && this.model) {
            this.controls.targetX = this.controls.mouseX * Math.PI;
            this.controls.targetY = this.controls.mouseY * Math.PI;

            this.model.rotation.y += (this.controls.targetX - this.model.rotation.y) * 0.1;
            this.model.rotation.x += (this.controls.targetY - this.model.rotation.x) * 0.1;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize viewer when DOM is ready and Three.js is loaded
function initViewer() {
    const container = document.getElementById('modelViewer');
    if (!container || typeof THREE === 'undefined') {
        return false;
    }

    // Wait for GLTFLoader to load (check multiple ways)
    let attempts = 0;
    const maxAttempts = 100; // 5 seconds max wait

    const checkLoader = setInterval(() => {
        attempts++;
        const loaderAvailable = (typeof THREE !== 'undefined' && THREE.GLTFLoader);

        if (loaderAvailable) {
            clearInterval(checkLoader);
            if (!window.modelViewer) {
                window.modelViewer = new ModelViewer3D('modelViewer');
            }
            return true;
        }

        if (attempts >= maxAttempts) {
            clearInterval(checkLoader);
            console.warn('GLTFLoader not loaded after timeout, initializing viewer anyway');
            if (!window.modelViewer) {
                window.modelViewer = new ModelViewer3D('modelViewer');
            }
            return false;
        }
    }, 50);

    return false;
}

// Wait for DOM and Three.js
function initWhenReady() {
    if (typeof THREE === 'undefined') {
        setTimeout(initWhenReady, 100);
        return;
    }

    // Wait a bit more for GLTFLoader
    setTimeout(() => {
        initViewer();
    }, 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
    initWhenReady();
}
