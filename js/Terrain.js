define([
    'three'
],
function(
    THREE
){
    'use strict';

    var meshSideLength = 80;

    function zeroFilledArray(length){
        return Array.apply(null, new Array(length)).map(Number.prototype.valueOf, 0);
    }

    function makePlane(colours){
        var geometry = new THREE.PlaneGeometry(3000, 3000, meshSideLength, meshSideLength);
        var material  = new THREE.MeshPhongMaterial({
            color: colours.fill,
            ambient: 0x000000
        });
        var wireframeMaterial  = new THREE.MeshPhongMaterial({
            color: colours.wireframe,
            wireframe: true
        });
        var mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, [
            material,
            wireframeMaterial
        ]);

        mesh.rotation.x = -Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    function getVertexAndNeighbours(vertices, index){
        var vArr = [];

        if(vertices[index-1]){
            vArr.push(vertices[index-1]);
        }
        if(vertices[index]){
            vArr.push(vertices[index]);
        }
        if(vertices[index+1]){
            vArr.push(vertices[index+1]);
        }

        return vArr;
    }

    function increaseVertexGroup(meshVertices, centerIndex, increase){
        var filteredVertices = [];

        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex));
        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex + meshSideLength));
        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex - meshSideLength));

        filteredVertices.forEach(function(vertex){
            vertex.z += increase;
        });
    }

    function randomiseVertices(mesh, accelMap){
        var friction = 0.95;
        mesh.geometry.vertices = mesh.geometry.vertices.map(function(vertex, i){
            accelMap[i] += (Math.random() * 0.1) - 0.05;
            accelMap[i] *= friction;

            increaseVertexGroup(mesh.geometry.vertices, i, accelMap[i]);

            if(vertex.z > 300){
                vertex.z = 300;
            }
            return vertex;
        });
        mesh.geometry.verticesNeedUpdate = true;
    }

    function Terrain(options){
        if(!options.colours){
            throw new Error('colours {fill,wireframe} is required');
        }
        this.plane = makePlane(options.colours);

        this.animate();
    }

    Terrain.prototype.getObject = function getObject(){
        return this.plane;
    };

    Terrain.prototype.animate = function(){
        var mesh = this.plane.children[0];
        var vertexAccel = zeroFilledArray(mesh.geometry.vertices.length);

        function tick(){
            requestAnimationFrame(tick);
            randomiseVertices(mesh, vertexAccel);
        }
        tick();
    };

    return Terrain;

});
