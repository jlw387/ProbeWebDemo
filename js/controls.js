import * as THREE from "three";


// Frustum Control Functions

function initProjectionDropdown(probeScene, viewManager, cameraViewIndex) {
    const projectionDropdown = document.getElementById("projectionDropdown");
    const perspectiveFrustumControls = document.getElementById("perspectiveFrustumControls");
    const orthoFrustumControls = document.getElementById("orthoFrustumControls");

    const cameraViewRect = viewManager.getViewArea(cameraViewIndex);

    const aspect = cameraViewRect.width / cameraViewRect.height;
    const near = probeScene.getNearPlane();
    const far = probeScene.getFarPlane();

    let updateProjectionDropdown = (event) => {
        probeScene.setProjectionMode(projectionDropdown.value);

        let camera;

        if(projectionDropdown.value == "perspective") {
            // Swap camera for "Camera View"
            const fov = probeScene.getFOV();
            camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

            // Adjust HTML element visibility
            perspectiveFrustumControls.className = "";
            orthoFrustumControls.className = "hidden";
        }
        else if(projectionDropdown.value == "ortho") {
            // Swap camera for "Camera View"
            const halfVerticalSideLength = probeScene.getOrthoSideLength() / 2;
            const halfHorizontalSideLength = halfVerticalSideLength * aspect;
            camera = new THREE.OrthographicCamera(-halfHorizontalSideLength, 
                                                    halfHorizontalSideLength,
                                                    halfVerticalSideLength, 
                                                    -halfVerticalSideLength,
                                                    near, far);

            // Adjust HTML element visibility
            perspectiveFrustumControls.className = "hidden";
            orthoFrustumControls.className = "";
        }

        camera.lookAt(new THREE.Vector3(0,0,1));
        viewManager.setViewCamera(cameraViewIndex, camera);
    }

    projectionDropdown.addEventListener("change", updateProjectionDropdown);
}

function initFOVSlider(probeScene, viewManager, cameraViewIndex) {
    const fovNumber = document.getElementById("fovEntry");
    const fovSlider = document.getElementById("fovSlider");

    let updateFOV = (event) => {
        // Sync HTML elements
        if(event.srcElement.className == "standard-slider")
            fovNumber.value = fovSlider.value;
        else 
            fovSlider.value = fovNumber.value;
        
        // Update scene camera
        probeScene.setFOV(fovNumber.value); 
        
        // Update "Camera View" camera
        viewManager.getViewCamera(cameraViewIndex).fov = fovNumber.value;
    }

    fovNumber.addEventListener("change", updateFOV);
    fovSlider.addEventListener("input", updateFOV);
}

function initOrthoSideLength(probeScene, viewManager, cameraViewIndex) {
    const orthoSideNumber = document.getElementById("orthoSideEntry");
    const orthoSideSlider = document.getElementById("orthoSideSlider");

    let updateOrthoSideLength = (event) => {
        // Sync HTML elements
        if(event.srcElement.className == "standard-slider")
            orthoSideNumber.value = orthoSideSlider.value;
        else 
            orthoSideSlider.value = orthoSideNumber.value;
        
        // Update scene camera
        probeScene.setOrthoSideLength(orthoSideNumber.value); 

        // Update "Camera View" camera
        const camera = viewManager.getViewCamera(cameraViewIndex);
        const halfLength = orthoSideNumber.value / 2;
        const aspect = viewManager.getViewAspect(cameraViewIndex);

        camera.top = halfLength;
        camera.bottom = -halfLength;
        camera.left = -halfLength * aspect;
        camera.right = halfLength * aspect;  
    }

    orthoSideNumber.addEventListener("change", updateOrthoSideLength);
    orthoSideSlider.addEventListener("input", updateOrthoSideLength);
}

function initNearPlaneEntry(probeScene, viewManager, cameraViewIndex) {
    const nearNumber = document.getElementById("nearEntry");

    let updateNearPlane = (event) => {
        probeScene.setNearPlane(nearNumber.value);
        viewManager.getViewCamera(cameraViewIndex).near = nearNumber.value;
    }

    nearNumber.addEventListener("change", updateNearPlane)
}

function initFarPlaneEntry(probeScene) {
    const farNumber = document.getElementById("farEntry");

    let updateFarPlane = (event) => {
        probeScene.setFarPlane(farNumber.value);
        viewManager.getViewCamera(cameraViewIndex).far = farNumber.value;
    }

    farNumber.addEventListener("change", updateFarPlane)
}


// Transformation Functions
function initTransformResetButton(probeScene) {
    const transformResetButton = document.getElementById("transformResetButton");
    
    transformResetButton.addEventListener("click", () => {
        probeScene.resetObjectTransform();
    });

    console.log("Reset Clicked!");
}

function initTransformWidgetButtons(probeScene, viewManager) {
    const translateButton = document.getElementById("translateButton");
    const rotateButton = document.getElementById("rotateButton");
    const scaleButton = document.getElementById("scaleButton");

    let setGumballModeToTranslate = (event) => {
        translateButton.className = "submenu-button-clicked";
        rotateButton.className = "submenu-button";
        scaleButton.className = "submenu-button";

        probeScene.setGumballMode("translate");
    }

    let setGumballModeToRotate = (event) => {
        translateButton.className = "submenu-button";
        rotateButton.className = "submenu-button-clicked";
        scaleButton.className = "submenu-button";

        probeScene.setGumballMode("rotate");
    }

    let setGumballModeToScale = (event) => {
        translateButton.className = "submenu-button";
        rotateButton.className = "submenu-button";
        scaleButton.className = "submenu-button-clicked";

        probeScene.setGumballMode("scale");
    }

    translateButton.addEventListener("click", setGumballModeToTranslate);
    rotateButton.addEventListener("click", setGumballModeToRotate);
    scaleButton.addEventListener("click", setGumballModeToScale);
}

// Shading Functions

function initShadingModeDropdown(probeScene) {
    const shadingDropdown = document.getElementById("shadingDropdown");
    const shadingColorMenu = document.getElementById("colorPickObjMenu")

    shadingDropdown.addEventListener("change", () => { 
        probeScene.setShadingMode(shadingDropdown.value); 
        if(shadingDropdown.value == "normal") {
            shadingColorMenu.className = "hidden";
        }
        else {
            shadingColorMenu.className = "subsubmenu-item";
        }
    });
}

function initMaterialDoubleSidedCheckbox(probeScene) {
    const doubleSidedCheckbox = document.getElementById("shadingDoubleSidedCheckbox");

    doubleSidedCheckbox.addEventListener("change", () => {
        probeScene.setShadingDoubleSided(doubleSidedCheckbox.checked);
    });
}

function initShadingColorSelect(probeScene) {
    const shadingColor = document.getElementById("colorpickObjColor");
    
    shadingColor.addEventListener("input", (event) => { 
        probeScene.setObjectColor(event.target.value); 
    });
}


// UI Settings Functions

function initShowAxesCheckbox(probeScene) {
    const showAxesCheckbox = document.getElementById("showAxesCheckbox");

    showAxesCheckbox.addEventListener("change", () => {
        probeScene.setShowAxes(showAxesCheckbox.checked);
    });
}

function initNearFarPlaneOpacitySlider(probeScene) {
    const opacityNumber = document.getElementById("nearFarPlaneOpacityEntry");
    const opacitySlider = document.getElementById("nearFarPlaneOpacitySlider");

    let updateOpacity = (event) => {
        // Sync HTML elements
        if(event.srcElement.className == "standard-slider")
            opacityNumber.value = opacitySlider.value;
        else 
            opacitySlider.value = opacityNumber.value;
        
        // Update scene camera
        probeScene.setNearFarOpacity(opacityNumber.value); 
    }

    opacityNumber.addEventListener("change", updateOpacity);
    opacitySlider.addEventListener("input", updateOpacity);
}


// Overall Controls Initialization

export function initControls(probeScene, viewManager, cameraViewIndex) {
    
    // Frustum Controls
    initProjectionDropdown(probeScene, viewManager, cameraViewIndex);
    initFOVSlider(probeScene, viewManager, cameraViewIndex);
    initOrthoSideLength(probeScene, viewManager, cameraViewIndex);
    initNearPlaneEntry(probeScene, viewManager, cameraViewIndex);
    initFarPlaneEntry(probeScene, viewManager, cameraViewIndex);

    // Transform Controls
    initTransformResetButton(probeScene);
    initTransformWidgetButtons(probeScene, viewManager);

    // Shading Controls
    initShadingModeDropdown(probeScene);
    initMaterialDoubleSidedCheckbox(probeScene);
    initShadingColorSelect(probeScene);

    // UI Settings
    initShowAxesCheckbox(probeScene);
    initNearFarPlaneOpacitySlider(probeScene);
    
}