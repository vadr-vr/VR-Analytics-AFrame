import vadrCore from './vadrjscore/index.js';
import dataCollector from './js/collector';

vadrCore.config.setSdk('AFrame');

AFRAME.registerComponent('vadr-analytics', {
    schema: {
        appId: {type: 'string'},
        appToken: {type: 'string'},
        sceneId: {type: 'string'},
        testMode: {type: 'boolean', default: false},
        version: {type: 'string', default: '1.0.0'}
    },
    
    init: function () {

        vadrCore.config.setApplication(this.data.appId, this.data.appToken, 
            this.data.version);
        vadrCore.config.setTestMode(this.data.testMode);
        
        const currentScene = this.el.sceneEl;
        dataCollector.setScene(currentScene.object3D);
        window.currentScene = currentScene;

        vadrCore.setDataConfig.performance(true, 1000);
        vadrCore.setDataConfig.orientation(true, 300);
        vadrCore.setDataConfig.gaze(true, 300);

        currentScene.addEventListener('camera-set-active', (event) => {
            
            dataCollector.setCamera(event.detail.cameraEl);
            // recordDemoData();
            
        });

        currentScene.addEventListener('enter-vr', () => {

            vadrCore.playState.headsetApplied();

        });
        currentScene.addEventListener('exit-vr', () => {

            vadrCore.playState.headsetRemoved();

        });
            
        vadrCore.initVadRAnalytics();
        vadrCore.scene.addScene(this.data.sceneId);


    },

    play: function(){

        vadrCore.playState.appInFocus();

    },

    pause: function(){

        vadrCore.playState.appOutOfFocus();

    },

    update: function (data) {

    },

    tick: function(time, timeDelta){

        vadrCore.tick(time, timeDelta);

    },

    remove: function(){

        vadrCore.destroy();

    }
});

export default {
    setCamera: dataCollector.setCamera,
    registerEvent: vadrCore.registerEvent,
    media: vadrCore.media,
    scene: vadrCore.scene,
    user: vadrCore.user,
    setLogLevel: vadrCore.setLogLevel,
    playState: vadrCore.playState
};

let vadrDelay = function(t) {
    return new Promise(function(resolve) { 
        console.log('vadrDebug setting delay of ', t);
        setTimeout(resolve, t * 1000)
    });
}

function recordDemoData(){

    // let the scene plat for 75 seconds
    vadrDelay(15)
        .then(() => {

            // change scene to scene 2
            console.log('vadrDebug adding scene 2');
            vadrCore.scene.addScene('64');

            // let scene 2 play for 40 sec
            return vadrDelay(20);

        })
        .then(() => {

            console.log('vadrDebug adding scene 1 back');
            vadrCore.scene.closeScene();
            vadrCore.scene.addScene('63');

            // play scene for 20 sec, then add video media
            return vadrDelay(20);

        })
        .then(() => {

            console.log('vadrDebug starting video 1');
            vadrCore.media.addMedia('TestMedia1', 'Test Media Video 1', 1);

            // play video for 50 sec
            return vadrDelay(15);

        })
        .then(() => {

            // pause media
            console.log('vadrDebug pausing video 1');
            vadrCore.media.pauseMedia();

            //play after 5 sec
            return vadrDelay(5);

        })
        .then(() => {

            console.log('vadrDebug playing again video 1');
            vadrCore.media.playMedia();

            // play video for next 5 sec
            return vadrDelay(5);

        })
        .then(() => {

            // switch to photo
            console.log('vadrDebug starting photo 1');
            vadrCore.media.addMedia('TestMedia2', 'Test Media Photo 1', 2);
            
            // stay at photo for 25 min
            return vadrDelay(15);

        })
        .then(() => {

            // close photo 
            console.log('vadrDebug closing media');
            vadrCore.media.closeMedia();

            // stay at scene for 10 sec
            return vadrDelay(10);

        })
        .then(() => {

            vadrCore.scene.closeScene();
            console.log('vadrDebug closing all scenes');

        });

}