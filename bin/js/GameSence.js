/**
* GameSence class
*/
function GameSence() {
    this.scene;
    this.camera;
    this.renderer;
    this.axes;
    this.divingTowers = [];
    this.exclamationMark;
    this.step = 20; //跳台出现位置的步长
    this.jumpBeginTime = 0; //跳跃动画开始的时刻
    this.standDivingTowerIndex = 1; //站立的跳台
    this.cameraPos = new THREE.Vector3(-30, 40, 30); //{x:-30,y:40,z:30};
    this.cameraLookAtPos = new THREE.Vector3(0, 0, 0);
}
GameSence.prototype = Object.assign(GameSence.prototype, {
    init: function () {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        // create a camera, which defines where we're looking at.
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // create a render and set the size
        this.renderer = new THREE.WebGLRenderer();
        //renderer.setClearColorHex();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // show axes in the screen
        this.axes = new THREE.AxisHelper(50, 50, 50);
        this.scene.add(this.axes);
        //addLights
        this.addLights();
        //create DivingTower 
        this.divingTowers.push(new DivingTower(gameSence, 1, 4, { x: -20, y: 0, z: 0 }, 0x156289));
        this.divingTowers.push(new DivingTower(gameSence, 1, 4, { x: 0, y: 0, z: 0 }, 0xE6E6FA));
        this.divingTowers.push(new DivingTower(gameSence, 1, 4, { x: 20, y: 0, z: 0 }, 0x00FF00));
        //add claimation mark
        this.exclamationMark = new ExclamationMark(gameSence, { x: 0, y: this.divingTowers[this.standDivingTowerIndex].getSizing().height, z: 0 });
        //createExclamationMark();
        var curPoint = this.cirleOnOnePlaneByY();
        // this.camera.position.x = -30;
        // this.camera.position.y = 40;
        // this.camera.position.z = 30;
        this.camera.position.x = this.cameraPos.x;
        this.camera.position.y = this.cameraPos.y;
        this.camera.position.z = this.cameraPos.z;
        //console.warn("this.scene.position[x:"+this.scene.position.x+",y:"+this.scene.position.y+",z:"+this.scene.position.z+"]");
        this.camera.lookAt(this.cameraLookAtPos);
    },
    cirleOnOnePlaneByY: function () {
        var angleByStep = 0.001;
        var initAnagle = 0;
        var step = 0;
        var initPoint = { x: -30, y: 40, z: 30 };
        var raduis = Math.sqrt(Math.pow(initPoint.x, 2) + Math.pow(initPoint.z, 2));
        var curPoint = { x: Math.cos(angleByStep * step + initAnagle) * raduis, y: initPoint.y, z: Math.sin(angleByStep * step + initAnagle) * raduis };
        step++;
        return curPoint;
    },
    renderExclamationMarkJump: function () {
        this.exclamationMark.renderExclamationMarkJump();
    },
    add: function (obj3D) {
        this.scene.add(obj3D);
    },
    //起跳前蓄力
    chargePower: function () {
        var time = Date.now() * 0.001;
        this.divingTowers[this.standDivingTowerIndex].onPressing(this.jumpBeginTime, time);
        this.exclamationMark.onPressing(this.jumpBeginTime, time);
        this.render();
    },
    render: function () {
        this.renderer.render(this.scene, this.camera);
    },
    addLights: function () {
        var lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);
        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);
        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    },
    changeCamera: function (offsetPos) {
        this.camera.position.x = this.camera.position.x + offsetPos.x;
        this.camera.position.y = this.camera.position.y + offsetPos.y;
        this.camera.position.z = this.camera.position.z + offsetPos.z; //-30;//30;
        this.cameraLookAtPos.x = this.cameraLookAtPos.x + offsetPos.x;
        this.cameraLookAtPos.y = this.cameraLookAtPos.y + offsetPos.y;
        this.cameraLookAtPos.z = this.cameraLookAtPos.z + offsetPos.z;
        this.camera.lookAt(this.cameraLookAtPos);
        // this.scene.position.x = this.scene.position.x + (-offsetPos.x);
        // this.scene.position.y = this.scene.position.y + (-offsetPos.y);
        // this.scene.position.z = this.scene.position.z + (-offsetPos.z);
    },
    //随机计算下一个跳台的位置
    randomNextPosition: function () {
        var randomI = 1; //Math.round(Math.random()*10);
        var toXOrZ = 1; //(randomI%2);
        var stepCount = randomI % 3;
        var stepCount = (stepCount == 0) ? 1 : (stepCount);
        if (toXOrZ) {
            return { x: stepCount * this.step, y: 0, z: 0 };
        }
        else {
            return { x: 0, y: 0, z: stepCount * this.step };
        }
    },
    jumpToNextFrame: function () {
        var offsetPos = this.randomNextPosition();
        console.warn("offsetPos[x:" + offsetPos.x + ",y:" + offsetPos.y + ",z:" + offsetPos.z + "]");
        //移动跳台
        var firstDivingTower = this.divingTowers.shift();
        var lastDivingTower = this.divingTowers[this.divingTowers.length - 1];
        var lastDivingTowerPos = lastDivingTower.getPosition();
        console.warn("lastDivingTowerPos[x:" + lastDivingTowerPos.x + ",y:" + lastDivingTowerPos.y + ",z:" + lastDivingTowerPos.z + "]");
        var fisrtDivingTowerPos = {
            x: lastDivingTowerPos.x + offsetPos.x,
            y: lastDivingTowerPos.y + offsetPos.y,
            z: lastDivingTowerPos.z + offsetPos.z
        };
        console.warn("fisrtDivingTowerPos[x:" + fisrtDivingTowerPos.x + ",y:" + fisrtDivingTowerPos.y + ",z:" + fisrtDivingTowerPos.z + "]");
        firstDivingTower.setPosition(fisrtDivingTowerPos);
        this.divingTowers.push(firstDivingTower);
        //移动摄像机
        this.changeCamera(offsetPos);
        this.render();
    },
    //获取下一个跳台
    nextDivingTower: function () {
        return this.divingTowers[this.standDivingTowerIndex + 1];
    },
    onBeginJump: function () {
        this.exclamationMark.initExclamationMarkRotations();
        this.jumpBeginTime = Date.now() * 0.001;
    },
    onEndJump: function () {
        this.jumpBeginTime = 0;
        this.divingTowers[this.standDivingTowerIndex].onRelease();
        this.exclamationMark.onRelease();
        this.exclamationMark.exclamationMarkJumpBegin();
        this.jumpToNextFrame();
    },
    /*
    onDocumentMouseDown: function ( event ) {

        event.preventDefault();

        this.exclamationMark.initExclamationMarkRotations();


        this.jumpBeginTime = Date.now() * 0.001;
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
    },
    onDocumentMouseMove: function (e){
        this.render();
    },
    onDocumentMouseUp: function ( event ) {
        this.jumpBeginTime =0;
        document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', this.onDocumentMouseUp, false );
        
        
        this.divingTowers[this.standDivingTowerIndex].onRelease();
        this.exclamationMark.onRelease();

        this.exclamationMark.exclamationMarkJumpBegin();
        

        this.render();
        this.render();
        this.render();

    },
    */
    getRenderer: function () {
        return this.renderer;
    }
});
//# sourceMappingURL=GameSence.js.map