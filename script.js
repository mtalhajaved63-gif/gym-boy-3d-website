// Three.js Scene Setup
let scene, camera, renderer;
let currentModel = null;
let autoRotate = false;
let models = {};

// Initialize Scene
function initScene() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);

    // Camera setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lighting
    setupLighting();

    // Create models
    createModels();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Set up controls
    setupControls();

    // Start animation loop
    animate();
}

function setupLighting() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point Light
    const pointLight = new THREE.PointLight(0x667eea, 0.5);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function createModels() {
    // Character Model (Simple Gym Boy)
    models.character = createCharacter();
    models.character.userData.info = "Gym Boy - Ready to train! 💪";

    // Dumbbell Model
    models.dumbbell = createDumbbell();
    models.dumbbell.userData.info = "Dumbbell - Essential workout equipment";

    // Barbell Model
    models.barbell = createBarbell();
    models.barbell.userData.info = "Barbell - Heavy lifting training";

    // Treadmill Model
    models.treadmill = createTreadmill();
    models.treadmill.userData.info = "Treadmill - Cardio conditioning";

    // Add first model to scene
    scene.add(models.character);
    currentModel = models.character;
}

function createCharacter() {
    const group = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffab91 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.8;
    group.add(head);

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff7043 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    group.add(body);

    // Left Arm
    const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffab91 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 0.8, 0);
    group.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 0.8, 0);
    group.add(rightArm);

    // Left Leg
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.5, 0);
    group.add(leftLeg);

    // Right Leg
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.5, 0);
    group.add(rightLeg);

    group.castShadow = true;
    group.receiveShadow = true;
    return group;
}

function createDumbbell() {
    const group = new THREE.Group();

    // Left weight
    const weightGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const metalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffc107,
        shininess: 100 
    });
    const leftWeight = new THREE.Mesh(weightGeometry, metalMaterial);
    leftWeight.position.x = -0.8;
    group.add(leftWeight);

    // Right weight
    const rightWeight = new THREE.Mesh(weightGeometry, metalMaterial);
    rightWeight.position.x = 0.8;
    group.add(rightWeight);

    // Handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    group.add(handle);

    group.castShadow = true;
    group.receiveShadow = true;
    return group;
}

function createBarbell() {
    const group = new THREE.Group();

    // Left plate
    const plateGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const redMaterial = new THREE.MeshPhongMaterial({ color: 0xf44336 });
    const leftPlate = new THREE.Mesh(plateGeometry, redMaterial);
    leftPlate.position.x = -1.5;
    group.add(leftPlate);

    // Right plate
    const rightPlate = new THREE.Mesh(plateGeometry, redMaterial);
    rightPlate.position.x = 1.5;
    group.add(rightPlate);

    // Bar
    const barGeometry = new THREE.CylinderGeometry(0.08, 0.08, 4, 16);
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x212121 });
    const bar = new THREE.Mesh(barGeometry, blackMaterial);
    group.add(bar);

    group.castShadow = true;
    group.receiveShadow = true;
    return group;
}

function createTreadmill() {
    const group = new THREE.Group();

    // Frame
    const frameGeometry = new THREE.BoxGeometry(3, 0.5, 1.5);
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x212121 });
    const frame = new THREE.Mesh(frameGeometry, blackMaterial);
    frame.position.y = 0.5;
    group.add(frame);

    // Belt
    const beltGeometry = new THREE.BoxGeometry(2.5, 0.05, 1);
    const greyMaterial = new THREE.MeshPhongMaterial({ color: 0x616161 });
    const belt = new THREE.Mesh(beltGeometry, greyMaterial);
    belt.position.y = 1;
    group.add(belt);

    // Handles
    const handleGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x424242 });
    
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-1.5, 1.5, 0);
    group.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(1.5, 1.5, 0);
    group.add(rightHandle);

    // Display
    const displayGeometry = new THREE.BoxGeometry(1, 0.3, 0.1);
    const displayMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.set(0, 1.8, -0.7);
    group.add(display);

    group.castShadow = true;
    group.receiveShadow = true;
    return group;
}

function setupControls() {
    // Model selection
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modelName = e.target.dataset.model;
            switchModel(modelName);
            
            // Update active button
            document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Button controls
    document.getElementById('rotateBtn').addEventListener('click', () => {
        autoRotate = !autoRotate;
        document.getElementById('rotateBtn').textContent = autoRotate ? '⏸ Stop Rotate' : '▶ Auto Rotate';
    });

    document.getElementById('zoomInBtn').addEventListener('click', () => {
        camera.position.z -= 1;
    });

    document.getElementById('zoomOutBtn').addEventListener('click', () => {
        camera.position.z += 1;
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        camera.position.z = 5;
        if (currentModel) {
            currentModel.rotation.set(0, 0, 0);
        }
    });

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging && currentModel) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            currentModel.rotation.y += deltaX * 0.01;
            currentModel.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.005;
    });

    // Set first model as active
    document.querySelector('.model-btn').classList.add('active');
}

function switchModel(modelName) {
    if (currentModel) {
        scene.remove(currentModel);
    }

    currentModel = models[modelName];
    scene.add(currentModel);
    currentModel.rotation.set(0, 0, 0);

    // Update info
    document.getElementById('model-info').textContent = currentModel.userData.info;
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    if (autoRotate && currentModel) {
        currentModel.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Start the application
window.addEventListener('load', initScene);
