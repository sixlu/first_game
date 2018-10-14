function GameSence() {
    this.scene;
    this.camera;
    this.renderer;
    this.axes;
}
Object.assign(GameSence.prototype, {
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
        var curPoint = cirleOnOnePlaneByY();
        this.camera.position.x = -30;
        this.camera.position.y = 40;
        this.camera.position.z = 30;
        this.camera.lookAt(this.scene.position);
    },
    add: function (obj3D) {
        this.scene.add(obj3D);
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
    changeCamera: function () {
        var curPoint = cirleOnOnePlaneByY();
        console.warn("curPoint" + curPoint);
        this.camera.position.x = curPoint.x;
        this.camera.position.y = curPoint.y;
        this.camera.position.z = curPoint.z; //-30;//30;
        this.camera.lookAt(this.scene.position);
    },
    getRenderer: function () {
        return this.renderer;
    }
});
// var scene;
// var camera;
// var renderer;
// var axes;
var gameSence = new GameSence();
var planeGeometry;
var planeMaterial;
var plane;
var cubeGeometry;
var cubeMaterial;
var cube;
var sphereGeometry;
var sphereMaterial;
var sphere;
var angleByStep = 0.001;
var initAnagle = 0;
var step = 0;
var initPoint = { x: -30, y: 40, z: 30 };
var raduis = Math.sqrt(Math.pow(initPoint.x, 2) + Math.pow(initPoint.z, 2));
var bones;
var skeletonHelper;
var mesh;
var sizing;
var exclamationMarkMash;
var exclamationMarkMashRoations = [];
var beginTime = 0;
var jumpStartTime = 0;
var jumpping = false;
function cirleOnOnePlaneByY() {
    var curPoint = { x: Math.cos(angleByStep * step + initAnagle) * raduis, y: initPoint.y, z: Math.sin(angleByStep * step + initAnagle) * raduis };
    step++;
    return curPoint;
}
function pressByTime(aBeginTime, now, aLength, stepCount) {
    if (now >= aBeginTime) {
        var seconds = now - aBeginTime;
        var step = aLength / stepCount;
        var result = 0;
        if (seconds < stepCount) {
            result = (aLength - step * seconds);
        }
        else {
            result = aLength - step * (stepCount - 1);
        }
        //console.warn("seconds="+seconds+" step="+step);
        return result;
    }
    else {
        return aLength;
    }
}
function renderDivingTower(time) {
    //console.warn("mesh.skeleton.bones.length="+mesh.skeleton.bones.length)
    var tmpY = pressByTime(beginTime, time, sizing.segmentHeight, 3);
    //console.warn("pressByTime(beginTime,time,1)="+tmpY);
    for (var i = 0; i < mesh.skeleton.bones.length; i++) {
        // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        if (i != 0) {
            mesh.skeleton.bones[i].position.y = tmpY;
        }
    }
}
function initExclamationMarkRotations() {
    if (beginTime == 0) {
        exclamationMarkMashRoations = [];
        for (var i = 0; i < exclamationMarkMash.skeleton.bones.length; i++) {
            exclamationMarkMashRoations.push(exclamationMarkMash.skeleton.bones[i].rotation);
        }
    }
}
function recoverExclamationMarkRotations() {
    for (var i = 0; i < exclamationMarkMash.skeleton.bones.length; i++) {
        exclamationMarkMash.skeleton.bones[i].rotation = exclamationMarkMashRoations[i];
    }
}
function pressByTimeInRadians(aBeginTime, now, MaxAngle, stepCount) {
    if (now >= aBeginTime) {
        var MaxRadians = 0.0174533 * MaxAngle;
        var stepRadians = MaxRadians / stepCount;
        var seconds = now - aBeginTime;
        if (seconds < stepCount) {
            return stepRadians * seconds;
        }
        else {
            return MaxRadians;
        }
    }
    else {
        return 0;
    }
}
function exclamationMarkJumpBegin() {
    jumpStartTime = Date.now();
    jumpping = true;
}
function renderExclamationMarkJump() {
    /*
    var timer = Date.now() - jumpStartTime;
    if(timer>=20000){
        jumpping =false;
    }
    */
    if (exclamationMarkMash.position.x >= 20) {
        jumpping = false;
    }
    var step = 1;
    exclamationMarkMash.position.x = exclamationMarkMash.position.x + step; //     Math.abs( Math.sin( timer * 0.002 ) ) * 15;
    //y=-0.1x^2+2x
    exclamationMarkMash.position.y = (-0.1) * Math.pow(exclamationMarkMash.position.x, 2) + 2 * exclamationMarkMash.position.x;
    //exclamationMarkMash.rotation.x = timer * 0.0003;
    //exclamationMarkMash.rotation.z = timer * 0.0002;
    //renderer.render(scene, camera);
    gameSence.render();
}
function renderExclamationMark(time) {
    var tmpY = pressByTimeInRadians(beginTime, time, 45, 3);
    //console.warn("renderExclamationMark tmpY="+tmpY)
    for (var i = 0; i < exclamationMarkMash.skeleton.bones.length; i++) {
        if (i != 0) {
            exclamationMarkMash.skeleton.bones[i].rotation.z = tmpY; //Math.abs(Math.sin( tmpY ) / exclamationMarkMash.skeleton.bones.length);
            //console.warn("exclamationMarkMash.skeleton.bones["+i+"].rotation.z="+exclamationMarkMash.skeleton.bones[ i ].rotation.z);
            //exclamationMarkMash.skeleton.bones[ i ].position.y = tmpY;
            //mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
            // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        }
    }
}
function render() {
    //alert("你好，我是一个警告框！");
    //changeCamera();
    var time = Date.now() * 0.001;
    renderDivingTower(time);
    renderExclamationMark(time);
    //renderer.render(scene, camera);
    gameSence.render();
}
function onDocumentMouseDown(event) {
    event.preventDefault();
    initExclamationMarkRotations();
    beginTime = Date.now() * 0.001;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseMove(e) {
    //console.warn("onDocumentMousemove");
    render();
}
function onDocumentMouseUp(event) {
    beginTime = 0;
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    //console.warn("onDocumentMouseUp mesh.skeleton.bones.length="+mesh.skeleton.bones.length)
    var tmpY = pressByTime(0, 0, sizing.segmentHeight, 3);
    //console.warn("onDocumentMouseUp tmpY="+tmpY)
    for (var i = 0; i < mesh.skeleton.bones.length; i++) {
        // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        if (i != 0) {
            mesh.skeleton.bones[i].position.y = tmpY;
        }
    }
    //console.warn("onDocumentMouseUp exclamationMarkMash.skeleton.bones.length="+exclamationMarkMash.skeleton.bones.length)
    //recoverExclamationMarkRotations();
    for (var i = 0; i < exclamationMarkMash.skeleton.bones.length; i++) {
        // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
        if (i != 0) {
            exclamationMarkMash.skeleton.bones[i].rotation.z = 0;
        }
    }
    exclamationMarkJumpBegin();
    // renderer.render(scene, camera);
    // renderer.render(scene, camera);
    // renderer.render(scene, camera);
    gameSence.render();
}
function createExclamationMark() {
    //var geometry = new THREE.CylinderGeometry( 1,1, 5, 8,4,false);
    var segmentHeight = 1;
    var segmentCount = 4;
    var height = segmentHeight * segmentCount;
    var halfHeight = height * 0.5;
    var exclamationMarkSizing = {
        segmentHeight: segmentHeight,
        segmentCount: segmentCount,
        height: height,
        halfHeight: halfHeight
    };
    var geometry = new THREE.CylinderGeometry(0.5, // radiusTop
    1, // radiusBottom
    exclamationMarkSizing.height, // height
    8, // radiusSegments
    exclamationMarkSizing.segmentCount * 3, // heightSegments
    true // openEnded
    );
    var material = //new THREE.MeshBasicMaterial( {color: 0xffff00} );
     new THREE.MeshPhongMaterial({
        skinning: true,
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: false
    });
    var cylinder = new THREE.Mesh(geometry, material);
    //cylinder.position.set(10,10,20)
    var em_sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8); //new THREE.SphereGeometry(4, 20, 20);//
    var em_sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true });
    var em_sphere = new THREE.Mesh(em_sphereGeometry, em_sphereMaterial);
    em_sphere.translateY(4);
    var singleGeometry = new THREE.Geometry();
    cylinder.updateMatrix();
    singleGeometry.merge(cylinder.geometry, cylinder.matrix, 0);
    em_sphere.updateMatrix();
    singleGeometry.merge(em_sphere.geometry, em_sphere.matrix, 1);
    console.warn("geometry.vertices.length=" + geometry.vertices.length);
    console.warn("singleGeometry.vertices.length=" + singleGeometry.vertices.length);
    console.warn("singleGeometry.skinIndices.length=" + singleGeometry.skinIndices.length);
    //try
    exclamationMarkSizing.height = exclamationMarkSizing.height + 8;
    exclamationMarkSizing.halfHeight = exclamationMarkSizing.height * 0.5;
    exclamationMarkSizing.segmentHeight = exclamationMarkSizing.height / exclamationMarkSizing.segmentCount;
    //try end
    for (var i = 0; i < singleGeometry.vertices.length; i++) {
        var vertex = singleGeometry.vertices[i];
        var y = (vertex.y + exclamationMarkSizing.halfHeight);
        var skinIndex = Math.floor(y / exclamationMarkSizing.segmentHeight);
        var skinWeight = (y % exclamationMarkSizing.segmentHeight) / exclamationMarkSizing.segmentHeight;
        singleGeometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
        singleGeometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
    }
    exclamationMarkMash = new THREE.SkinnedMesh(singleGeometry, material); //new THREE.SkinnedMesh(geometry, material);//
    exclamationMarkMash.position.set(0, sizing.height, 0);
    var bones = createBones(exclamationMarkSizing);
    var skeleton = new THREE.Skeleton(bones);
    exclamationMarkMash.add(bones[0]);
    exclamationMarkMash.bind(skeleton);
    var skeletonHelper = new THREE.SkeletonHelper(exclamationMarkMash);
    skeletonHelper.material.linewidth = 2;
    gameSence.add(skeletonHelper);
    //exclamationMarkMash.scale.multiplyScalar( 1 );
    gameSence.add(exclamationMarkMash);
}
function createGeometry(sizing) {
    var geometry = new THREE.CylinderGeometry(5, // radiusTop
    5, // radiusBottom
    sizing.height, // height
    8, // radiusSegments
    sizing.segmentCount * 3, // heightSegments
    false // openEnded
    );
    for (var i = 0; i < geometry.vertices.length; i++) {
        var vertex = geometry.vertices[i];
        var y = (vertex.y + sizing.halfHeight);
        var skinIndex = Math.floor(y / sizing.segmentHeight);
        var skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;
        geometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
        geometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
    }
    return geometry;
}
function createBones(sizing) {
    var bones = [];
    var prevBone = new THREE.Bone();
    bones.push(prevBone);
    prevBone.position.y = -sizing.halfHeight;
    for (var i = 0; i < sizing.segmentCount; i++) {
        var bone = new THREE.Bone();
        bone.position.y = sizing.segmentHeight;
        bones.push(bone);
        prevBone.add(bone);
        prevBone = bone;
    }
    return bones;
}
function createMesh(geometry, bones) {
    var material = //new THREE.MeshBasicMaterial( {color: 0xffff00} );
     new THREE.MeshPhongMaterial({
        skinning: true,
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true
    });
    // var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    // var material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );
    var mesh = new THREE.SkinnedMesh(geometry, material);
    var skeleton = new THREE.Skeleton(bones);
    mesh.add(bones[0]);
    mesh.bind(skeleton);
    skeletonHelper = new THREE.SkeletonHelper(mesh);
    skeletonHelper.material.linewidth = 2;
    gameSence.add(skeletonHelper);
    return mesh;
}
function initBones() {
    var segmentHeight = 1;
    var segmentCount = 4;
    var height = segmentHeight * segmentCount;
    var halfHeight = height * 0.5;
    sizing = {
        segmentHeight: segmentHeight,
        segmentCount: segmentCount,
        height: height,
        halfHeight: halfHeight
    };
    var geometry = createGeometry(sizing);
    var bones = createBones(sizing);
    mesh = createMesh(geometry, bones);
    mesh.scale.multiplyScalar(1);
    gameSence.add(mesh);
}
function init() {
    gameSence = new GameSence();
    gameSence.init();
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x000000 );
    // // create a camera, which defines where we're looking at.
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // // create a render and set the size
    // renderer = new THREE.WebGLRenderer();
    // //renderer.setClearColorHex();
    // renderer.setClearColor(new THREE.Color(0xEEEEEE));
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // // show axes in the screen
    // axes = new THREE.AxisHelper(50,50,50);
    // scene.add(axes);
    /*
    // create the ground plane
    planeGeometry = new THREE.PlaneGeometry(60, 20);
    planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    // add the plane to the scene
    scene.add(plane);
    */
    //create bone 
    initBones();
    // create a cube
    cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    for (var i = 0; i < cubeGeometry.faces.length; i += 2) {
        var hex = Math.random() * 0xffffff;
        cubeGeometry.faces[i].color.setHex(hex);
        cubeGeometry.faces[i + 1].color.setHex(hex);
    }
    cubeMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 }); //new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = -10;
    // add the cube to the scene
    //scene.add(cube);
    gameSence.add(cube);
    /*
    // create a sphere
    sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    // add the sphere to the scene
    scene.add(sphere);
    */
    // position and point the camera to the center of the scene
    // var curPoint = cirleOnOnePlaneByY();
    // camera.position.x = -30;
    // camera.position.y = 40;
    // camera.position.z = 30;
    // camera.lookAt(scene.position);
    //addLights
    gameSence.addLights();
    //add claimation mark
    createExclamationMark();
    // add the output of the renderer to the html element
    //document.getElementById("WebGL-output").appendChild(renderer.domElement);
    document.getElementById("WebGL-output").appendChild(gameSence.getRenderer().domElement);
    // render the scene
    //renderer.render(scene, camera);
    gameSence.render();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.document.oncontextmenu = function () { return false; };
}
function animate() {
    requestAnimationFrame(animate);
    //render();
    if (jumpping) {
        renderExclamationMarkJump();
    }
}
window.onload = init;
animate();
//# sourceMappingURL=HelloLaybox_bak.js.map