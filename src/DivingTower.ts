
/**
 * 
 * DivingTower class
 */
function DivingTower(gameSence,segmentHeight,segmentCount,pos,color){
     this.sizing;
     this.bones;
     this.skeletonHelper;
     this.mesh;
     this.gameSence = gameSence;
     this.color = color;
     //this.pos = pos;

     this.initBones(segmentHeight,segmentCount,pos);
}

DivingTower.prototype = Object.assign(DivingTower.prototype,{

    setPosition:function(pos){
        this.mesh.position.x = pos.x;
        this.mesh.position.y = pos.y;
        this.mesh.position.z = pos.z;
        //this.pos = pos;
    },
    getPosition:function(){
        return this.mesh.position;
    },

    getSizing:function(){
        console.warn("sizing height="+this.sizing.height);
        return this.sizing;
    },

    createBones:function( sizing ) {

				var bones = [];

				var prevBone = new THREE.Bone();
				bones.push( prevBone );
				prevBone.position.y = - sizing.halfHeight;

				for ( var i = 0; i < sizing.segmentCount; i ++ ) {

					var bone = new THREE.Bone();
					bone.position.y = sizing.segmentHeight;
					bones.push( bone );
					prevBone.add( bone );
					prevBone = bone;

				}

				return bones;
    },

    createGeometry: function  ( sizing ) {

				var geometry = new THREE.CylinderGeometry(
					5,                       // radiusTop
					5,                       // radiusBottom
					sizing.height,           // height
					8,                       // radiusSegments
					sizing.segmentCount * 3, // heightSegments
					false                     // openEnded
				);

				for ( var i = 0; i < geometry.vertices.length; i ++ ) {

					var vertex = geometry.vertices[ i ];
					var y = ( vertex.y + sizing.halfHeight );

					var skinIndex = Math.floor( y / sizing.segmentHeight );
					var skinWeight = ( y % sizing.segmentHeight ) / sizing.segmentHeight;

					geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
					geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );

				}

				return geometry;

    },



    createMesh: function  ( geometry, bones ) {

				var material = //new THREE.MeshBasicMaterial( {color: 0xffff00} );
                new THREE.MeshPhongMaterial( { 
					skinning : true,
					color: this.color,//0x156289,
					emissive: 0x072534,
					side: THREE.DoubleSide,
					flatShading: true
				} );
                
                // var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
                // var material = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );



				var mesh = new THREE.SkinnedMesh( geometry,	material );
				var skeleton = new THREE.Skeleton( bones );

				mesh.add( bones[ 0 ] );

				mesh.bind( skeleton );

				this.skeletonHelper = new THREE.SkeletonHelper( mesh );
				this.skeletonHelper.material.linewidth = 2;
				this.gameSence.add( this.skeletonHelper );

				return mesh;

    },

    initBones: function  (segmentHeight,segmentCount,pos) {

				// var segmentHeight = 1;
				// var segmentCount = 4;
				var height = segmentHeight * segmentCount;
				var halfHeight = height * 0.5;

			    this.sizing = {
					segmentHeight : segmentHeight,
					segmentCount : segmentCount,
					height : height,
					halfHeight : halfHeight
				};

				this.geometry = this.createGeometry( this.sizing );
				this.bones = this.createBones( this.sizing );
				this.mesh = this.createMesh( this.geometry, this.bones );
                this.setPosition(pos);
                

				this.mesh.scale.multiplyScalar( 1 );
				this.gameSence.add( this.mesh );

	},




    pressByTime: function(aBeginTime,now,aLength,stepCount){

        if(now>=aBeginTime){
            var seconds = now - aBeginTime;
            var step = aLength /stepCount;
            var result =0;
            if(seconds<stepCount){
            result =(aLength-step * seconds);
            }else{
            result = aLength- step * (stepCount-1)
            }
            
            //console.warn("seconds="+seconds+" step="+step);
            return result;
        }else{
            return aLength;
        }

    },

    //获取高度的停止值
    getTopY:function(){
       return  this.sizing.height;
    },


    //renderDivingTower
    onPressing:function(beginTime,time){

        //console.warn("mesh.skeleton.bones.length="+mesh.skeleton.bones.length)
        var tmpY =  this.pressByTime(beginTime,time,this.sizing.segmentHeight,3);
        //console.warn("pressByTime(beginTime,time,1)="+tmpY);
        for ( var i = 0; i < this.mesh.skeleton.bones.length; i ++ ) {

                // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                if(i!=0){
                    
                    this.mesh.skeleton.bones[ i ].position.y =tmpY;
                }
                
        }   
    },

    onRelease:function(){

        var tmpY =  this.pressByTime(0,0,this.sizing.segmentHeight,3);
        //console.warn("onDocumentMouseUp tmpY="+tmpY)
        for ( var i = 0; i < this.mesh.skeleton.bones.length; i ++ ) {

                // mesh.skeleton.bones[ i ].rotation.x = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                // mesh.skeleton.bones[ i ].rotation.y = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                // mesh.skeleton.bones[ i ].rotation.z = Math.sin( time ) * 2 / mesh.skeleton.bones.length;
                if(i!=0){
                    
                    this.mesh.skeleton.bones[ i ].position.y =tmpY;
                }
                
        }

    }
    


});

