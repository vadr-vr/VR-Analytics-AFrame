import vadrCore from 'vadr-core-vr';
/**
 * @module DataCollector
 * @description Platform specific implementation to calculate data
 */

let camera = null;
let scene = null;
let threeCamera = null;
let longitudeZeroOffset = 0;

// paramters used during value calculations
let raycaster = new THREE.Raycaster();
raycaster.far = 300;
let cameraPosition = new THREE.Vector3();
let cameraDirection = new THREE.Vector3();
let intersectPoint = new THREE.Vector3();
let rotationQuaternion = new THREE.Quaternion();
let rotationEuler = new THREE.Euler(0, 0, 0, 'YZX');

function init(){

    longitudeZeroOffset = 0;

}

/**
 * Sets the new camera to collect data
 * @memberof VadrObjects
 * @param {object} newCamera three camera instance active currently
 */
const setCamera = (newCamera) => {

    camera = newCamera;
    threeCamera = camera.object3D;
    
    setDataCallbacks();

};

const setLongitudeZeroOffset = (newOffset) => {

    longitudeZeroOffset = newOffset;

}

const setScene = (newScene) => {

    scene = newScene;

}

const _getVectorString = (vector) => {

    return vector.x.toFixed(4) + ',' + vector.y.toFixed(4) + ',' + vector.z.toFixed(4);

};

const getPosition = () => {

    if (camera == null){
        return null;
    }

    threeCamera.getWorldPosition(cameraPosition);
    return _getVectorString(cameraPosition);

};

const _getNormalizedLongitude = (longitude) => {

    while(longitude > 180){

        longitude -= 360;

    }

    while(longitude < -180){

        longitude += 360;

    }

    return longitude;

};

const _getNormalizedLatitude = (latitude) => {

    // under normal conditions latitude should remain between -180 to 180
    // therefore one correction is enough
    if (latitude < -90){

        latitude = -180 - latitude;

    }

    if (latitude > 90){

        latitude = 180 - latitude;

    }

    return latitude;

};

const _getShiftedLongitude = (longitude) => {

    // making movement from -z to +x as positive direction
    longitude *= -1;
    // shifting zero point from -z to +x, shifting zero point to offset provided
    longitude = longitude - 90 - longitudeZeroOffset;

    return _getNormalizedLongitude(longitude);

};

const getAngle = () => {

    if (camera == null){
        return null;
    }

    threeCamera.getWorldQuaternion(rotationQuaternion);
    rotationEuler.setFromQuaternion(rotationQuaternion);
    rotationEuler.x = THREE.Math.radToDeg(rotationEuler.x);
    rotationEuler.y = THREE.Math.radToDeg(rotationEuler.y);
    rotationEuler.z = THREE.Math.radToDeg(rotationEuler.z);
    rotationEuler.y = _getShiftedLongitude(rotationEuler.y);
    rotationEuler.x = _getNormalizedLatitude(rotationEuler.x);
    return _getVectorString(rotationEuler);

};

const getGazePoint = () => {

    if (camera == null){
        return null;
    }

    threeCamera.getWorldDirection(cameraDirection);
    threeCamera.getWorldPosition(cameraPosition);
    raycaster.set(cameraPosition, cameraDirection.multiplyScalar(-1));
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0){

        intersectPoint.set(intersects[0].point.x, intersects[0].point.y,
            intersects[0].point.z);

    } else{

        intersectPoint.set(cameraDirection.x, cameraDirection.y, cameraDirection.z);
        intersectPoint.multiplyScalar(raycaster.far);
        intersectPoint.add(cameraPosition);

    }

    return _getVectorString(intersectPoint, false);

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

function destroy(){

    camera = null;
    threeCamera = null;
    scene = null;

}

export default {
    init,
    setCamera,
    setLongitudeZeroOffset,
    setScene,
    getGazePoint,
    getAngle,
    getPosition
}