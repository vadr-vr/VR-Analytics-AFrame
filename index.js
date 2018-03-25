import vadrCore from 'vadr-core-vr';
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
        dataCollector.init();
        dataCollector.setScene(currentScene.object3D);

        vadrCore.setDataConfig.performance(true, 1000);
        vadrCore.setDataConfig.orientation(true, 300);
        vadrCore.setDataConfig.gaze(true, 300);

        currentScene.addEventListener('camera-set-active', (event) => {
            
            dataCollector.setCamera(event.detail.cameraEl);
            
        });

        currentScene.addEventListener('enter-vr', () => {

            vadrCore.playState.headsetApplied();

        });
        currentScene.addEventListener('exit-vr', () => {

            vadrCore.playState.headsetRemoved();

        });

        document.addEventListener('visibilitychange', this.handeVisibilityChange.bind(this));
    
        vadrCore.initVadRAnalytics();
        vadrCore.scene.addScene(this.data.sceneId);


    },

    handeVisibilityChange: function(){

        if (document.visibilityState == 'visible'){
            
            this.play();
    
        }else{
    
            this.pause();
    
        }
    
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

        document.removeEventListener('visibilityChange', this.handeVisibilityChange);
        vadrCore.destroy();

    }
});

export default {
    setCamera: dataCollector.setCamera,
    setLongitudeZeroOffset: dataCollector.setLongitudeZeroOffset,
    user: vadrCore.user,
    setSessionInfo: vadrCore.setSessionInfo,
    setDataConfig: vadrCore.setDataConfig,
    media: vadrCore.media,
    scene: vadrCore.scene,
    registerEvent: vadrCore.registerEvent,
    playState: vadrCore.playState,
    enums: vadrCore.enums,
    setLogLevel: vadrCore.setLogLevel
};