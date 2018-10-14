var gameSence;
/*
var planeGeometry;
var planeMaterial;
var plane;
var cubeGeometry;
var cubeMaterial;
var cube;
var sphereGeometry;
var sphereMaterial;
var sphere;
*/
//var beginTime =0;
// function render(){
//     //alert("你好，我是一个警告框！");
//     //changeCamera();
//     var time = Date.now() * 0.001;
//     // divingTower.onPressing(beginTime,time);
//     // exclamationMark.onPressing(beginTime,time);
// 	//renderer.render(scene, camera);
//     gameSence.render();
// }
function onDocumentMouseDown(event) {
    event.preventDefault();
    //exclamationMark.initExclamationMarkRotations();
    //beginTime = Date.now() * 0.001;
    gameSence.onBeginJump();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseMove(e) {
    //console.warn("onDocumentMousemove");
    gameSence.chargePower();
}
function onDocumentMouseUp(event) {
    //beginTime =0;
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    // divingTower.onRelease();
    // exclamationMark.onRelease();
    // exclamationMark.exclamationMarkJumpBegin();
    gameSence.onEndJump();
    gameSence.render();
    gameSence.render();
    gameSence.render();
}
function init() {
    gameSence = new GameSence();
    gameSence.init();
    /*
    // create a cube
    cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    for ( var i = 0; i < cubeGeometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        cubeGeometry.faces[ i ].color.setHex( hex );
        cubeGeometry.faces[ i + 1 ].color.setHex( hex );

    }
    cubeMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );//new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = -10;
    // add the cube to the scene
    //scene.add(cube);
    gameSence.add(cube);
    */
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
    // add the output of the renderer to the html element
    //document.getElementById("WebGL-output").appendChild(renderer.domElement);
    document.getElementById("WebGL-output").appendChild(gameSence.getRenderer().domElement);
    // render the scene
    //renderer.render(scene, camera);
    gameSence.render();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.document.oncontextmenu = function () { return false; };
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    gameSence.renderExclamationMarkJump();
}
window.onload = init;
//# sourceMappingURL=HelloLayabox.js.map