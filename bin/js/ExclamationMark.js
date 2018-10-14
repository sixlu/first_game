/*
ExclamationMark jump animation
*/
function ExclamationMarkJumpAnimation() {
}
/**
 *  ExclamationMark class
 */
function ExclamationMark(gameSence, position) {
    this.exclamationMarkMash;
    this.exclamationMarkMashRoations = [];
    this.gameSence = gameSence;
    this.createExclamationMark(position);
    this.jumpStartTime = 0;
    this.jumpping = false;
    this.translationDistance = 20; //沿params坐标轴方向平移多个刻度
    this.translationCount = 0; //沿params坐标轴方向平移多少次
}
ExclamationMark.prototype = Object.assign(ExclamationMark.prototype, {
    createBones: function (sizing) {
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
    },
    createExclamationMark: function (position) {
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
        this.exclamationMarkMash = new THREE.SkinnedMesh(singleGeometry, material); //new THREE.SkinnedMesh(geometry, material);//
        //this.exclamationMarkMash.position.set(0,sizing.height,0)
        this.exclamationMarkMash.position.x = position.x;
        this.exclamationMarkMash.position.y = position.y;
        this.exclamationMarkMash.position.z = position.z;
        var bones = this.createBones(exclamationMarkSizing);
        var skeleton = new THREE.Skeleton(bones);
        this.exclamationMarkMash.add(bones[0]);
        this.exclamationMarkMash.bind(skeleton);
        var skeletonHelper = new THREE.SkeletonHelper(this.exclamationMarkMash);
        skeletonHelper.material.linewidth = 2;
        this.gameSence.add(skeletonHelper);
        //exclamationMarkMash.scale.multiplyScalar( 1 );
        this.gameSence.add(this.exclamationMarkMash);
    },
    initExclamationMarkRotations: function (beginTime) {
        if (beginTime == 0) {
            this.exclamationMarkMashRoations = [];
            for (var i = 0; i < this.exclamationMarkMash.skeleton.bones.length; i++) {
                this.exclamationMarkMashRoations.push(this.exclamationMarkMash.skeleton.bones[i].rotation);
            }
        }
    },
    recoverExclamationMarkRotations: function recoverExclamationMarkRotations() {
        for (var i = 0; i < this.exclamationMarkMash.skeleton.bones.length; i++) {
            this.exclamationMarkMash.skeleton.bones[i].rotation = this.exclamationMarkMashRoations[i];
        }
    },
    pressByTimeInRadians: function (aBeginTime, now, MaxAngle, stepCount) {
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
    },
    computerTrack: function (paramA, //坐标系的参数
    k, //沿params坐标轴方向平移多个刻度
    n) {
        //y=-0.1x^2+2x
        //var ret= (-0.1)*Math.pow(paramA,2)+2*paramA;
        //y=-0.1x^2+(2-0.2kn)x+(2kn-0.1(kn)^2)
        var ret = (-0.1) * Math.pow(paramA, 2) + (2 - 0.2 * k * n) * paramA + (2 * k * n - 0.1 * Math.pow(k * n, 2));
        //console.warn("k="+k+" n="+n+" ret="+ret+" retkkkkk="+retkkkkk);
        return ret;
    },
    computerNextParamA: function (k, //沿params坐标轴方向平移多个刻度
    n) {
        /*
        //y=-0.1x^2+2x 在y=4时的求x
        //得到-0.1x^2+2x-4 = 0;
        var a = -0.1;
        var b = 2;
        var c = -4;
        
        */
        //y=-0.1x^2+(2-0.2kn)x+(2kn-0.1(kn)^2) 在y=4时求x
        //得到-0.1x^2+(2-0.2kn)x+(2kn-0.1(kn)^2-4)=0
        var a = -0.1;
        var b = (2 - 0.2 * k * n);
        //var c = (2*k*n-0.1*(k*n)^2-4)
        var c = (2 * k * n - 0.1 * Math.pow(k * n, 2) - 4);
        //公式法求一元二次方程
        var x1 = (-1 * b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var x2 = (-1 * b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        console.warn("k=" + k + " n=" + n + " x1=" + x1 + " x2=" + x2);
        if (x1 >= x2) {
            return x1;
        }
        else {
            return x2;
        }
    },
    exclamationMarkJumpBegin: function () {
        this.jumpStartTime = Date.now();
        this.jumpping = true;
    },
    renderExclamationMarkJump: function () {
        if (!this.jumpping)
            return;
        /*
        var timer = Date.now() - jumpStartTime;
        if(timer>=20000){
            jumpping =false;
        }
        */
        var nextDivingTower = this.gameSence.nextDivingTower();
        var nextDivingTowerTopY = nextDivingTower.getTopY();
        var nextParamA = this.computerNextParamA(this.translationDistance, this.translationCount);
        //console.warn("this.exclamationMarkMash.position.y["+this.exclamationMarkMash.position.y+"] nextDivingTowerTopY["+nextDivingTowerTopY+"]");
        console.warn("nextParamA=" + nextParamA);
        var step = 1;
        this.exclamationMarkMash.position.x = this.exclamationMarkMash.position.x + step; //     Math.abs( Math.sin( timer * 0.002 ) ) * 15;
        //y=-0.1x^2+2x
        //this.exclamationMarkMash.position.y= (-0.1)*Math.pow(this.exclamationMarkMash.position.x,2)+2*this.exclamationMarkMash.position.x
        this.exclamationMarkMash.position.y = this.computerTrack(this.exclamationMarkMash.position.x, this.translationDistance, this.translationCount);
        //exclamationMarkMash.rotation.x = timer * 0.0003;
        //exclamationMarkMash.rotation.z = timer * 0.0002;
        //renderer.render(scene, camera);
        this.gameSence.render();
        //if(this.exclamationMarkMash.position.y<nextDivingTowerTopY){
        //if(this.exclamationMarkMash.position.x>20){
        if (this.exclamationMarkMash.position.x > nextParamA - step) {
            this.jumpping = false;
            console.warn("this.translationCount ++");
            this.translationCount++;
        }
    },
    //renderExclamationMark
    onPressing: function (bgTime, time) {
        var tmpY = this.pressByTimeInRadians(bgTime, time, 45, 3);
        //console.warn("renderExclamationMark tmpY="+tmpY)
        for (var i = 0; i < this.exclamationMarkMash.skeleton.bones.length; i++) {
            if (i != 0) {
                this.exclamationMarkMash.skeleton.bones[i].rotation.z = tmpY; //Math.abs(Math.sin( tmpY ) / exclamationMarkMash.skeleton.bones.length);
                //console.warn("exclamationMarkMash.skeleton.bones["+i+"].rotation.z="+exclamationMarkMash.skeleton.bones[ i ].rotation.z);
                //exclamationMarkMash.skeleton.bones[ i ].position.y = tmpY;
                //mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
            }
        }
    },
    onRelease: function () {
        //console.warn("onDocumentMouseUp exclamationMarkMash.skeleton.bones.length="+exclamationMarkMash.skeleton.bones.length)
        //recoverExclamationMarkRotations();
        for (var i = 0; i < this.exclamationMarkMash.skeleton.bones.length; i++) {
            // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
            // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
            // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
            if (i != 0) {
                this.exclamationMarkMash.skeleton.bones[i].rotation.z = 0;
            }
        }
        this.exclamationMarkJumpBegin();
    },
});
//# sourceMappingURL=ExclamationMark.js.map