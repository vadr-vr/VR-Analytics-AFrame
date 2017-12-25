import vadrCore from '../vadrjscore/index.js';

/**
 * @module DataCollector
 * @description Platform specific implementation to calculate data
 */

let camera = null;
let scene = null;
let threeCamera = null;
let raycaster = new THREE.Raycaster();
raycaster.far = 300;
let cameraDirection = new THREE.Vector3();
let intersectPoint = new THREE.Vector3();

/**
 * Sets the new camera to collect data
 * @memberof VadrObjects
 * @param {object} newCamera three camera instance active currently
 */
const setCamera = (newCamera) => {

    camera = newCamera;
    threeCamera = camera.object3D

};

const setScene = (newScene) => {

    scene = newScene;

}

const getVectorString = (vector) => {

    return vector.x.toFixed(4) + ',' + vector.y.toFixed(4) + ',' + vector.z.toFixed(4);

};

const getPosition = () => {

    const position = camera.getAttribute('position');
    // inverting y coord to convert from left handed in AFrame to right handed in VadR
    return getVectorString(position, false);

};

const getAngle = () => {

    const getNormalizedX = (rotationX) => {

        while(rotationX > 360){

            rotationX -= 360;

        }

        if (rotationX < 180){

            return -rotationX;
        
        } else {

            return 360 - rotationX;

        }

    };

    const rotation = camera.getAttribute('rotation');
    return rotation.x.toFixed(4) + ',' + getNormalizedX(rotation.y).toFixed(4) + ',' + 
        rotation.z.toFixed(4);

};

const getGazePoint = () => {

    threeCamera.getWorldDirection(cameraDirection);
    raycaster.set(threeCamera.position, cameraDirection.multiplyScalar(-1));
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0){

        intersectPoint.set(intersects[0].point.x, intersects[0].point.y,
            intersects[0].point.z);

    } else{

        intersectPoint.set(cameraDirection.x, cameraDirection.y, cameraDirection.z);
        intersectPoint.multiplyScalar(raycaster.far);
        intersectPoint.add(threeCamera.position);

    }

    return getVectorString(intersectPoint, false);

};

/**
 * Registers the data calculator functions with vadrJsCore
 * @memberof DataCollector
 */
function setDataCallbacks(){

    vadrCore.dataCallbacks.setPositionCallback(getPosition);
    vadrCore.dataCallbacks.setGazeCallback(getGazePoint);
    vadrCore.dataCallbacks.setAngleCallback(getAngle);

}

export default {
    setCamera,
    setScene,
    setDataCallbacks,
    getGazePoint,
    getAngle,
    getPosition
}