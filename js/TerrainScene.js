define([
    'js/Terrain',
    'three'
],function(
    Terrain,
    THREE
){
    'use strict';

    var cameraDistance = 1000;

    function windowSize(){
        return {
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    }

    function scene(){
        var s = new THREE.Scene();
        
        // s.fog = new THREE.FogExp2(0xff0000, 0.0001);

        return s;
    }

    function renderer(){
        var glRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        
        glRenderer.shadowMapEnabled = true;
        glRenderer.shadowMapType = THREE.PCFSoftShadowMap;

        return glRenderer;
    }

    function camera(w, h){
        var wSize = windowSize();
        var cam = new THREE.PerspectiveCamera(40, wSize.width / wSize.height, 1, 20000);
        
        cam.position.set(0, 500, 800);
        cam.target = new THREE.Vector3(0, 0, 0);
        cam.lookAt(cam.target);

        return cam;
    }

    function sceneLighting(){
        var spotlight = new THREE.SpotLight(0xffaaaa, 1);

        spotlight.position.set(700, 700, 700);
        spotlight.target.position.set(0, 0, 0);
        spotlight.castShadow = true;
        spotlight.shadowDarkness = 0.5;

        return spotlight;
    }

    function rotateCamera(cam, ticks){
        var targetPosition = new THREE.Vector3(
            Math.sin(ticks*0.01) * cameraDistance/2,
            0,
            Math.cos(ticks*0.01) * cameraDistance/2
        );

        cam.position.x = Math.PI - Math.sin(ticks*0.005) * cameraDistance;
        cam.position.y = (Math.sin(ticks*0.005) * cameraDistance/3) + cameraDistance*(2/3);
        cam.position.z = Math.PI - Math.cos(ticks*0.005) * cameraDistance;

        cam.target = targetPosition;
        cam.lookAt(cam.target);
    }

    function TerrainScene(){
        var colours = [
            {fill: 0xcc0000, wireframe: 0xff3333},
            {fill: 0xcccc00, wireframe: 0xffff33}
        ];
        var terrain;

        this.scene = scene();
        this.renderer = renderer();
        this.camera = camera();
        this.scene.add(sceneLighting());

        for(var i in colours){
            terrain = new Terrain({colours: colours[i]});
            this.scene.add(terrain.getObject());
        }

        this.resize();
        this.animate();
    }

    TerrainScene.prototype.resize = function resize(){
        var wSize = windowSize();
        this.renderer.setSize(wSize.width, wSize.height);
    };

    TerrainScene.prototype.appendTo = function appendTo(node){
        node.appendChild(this.renderer.domElement);
    };

    TerrainScene.prototype.render = function render(){
        this.renderer.render(this.scene, this.camera);
    };

    TerrainScene.prototype.animate = function(){
        var cam = this.camera;
        var s = this.scene;
        var numTicks = 0;

        function tick(){
            requestAnimationFrame(tick);
            numTicks++;
            rotateCamera(cam, numTicks);
        }
        tick();
    };

    return TerrainScene;

});
