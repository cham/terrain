require(['requireConfig'], function(){
    'use strict';

    require(['js/TerrainScene'], function(TerrainScene){

        var terrainScene = new TerrainScene();

        terrainScene.appendTo(document.body);

        window.onresize = function(){
            terrainScene.resize();
        };

        function tick(){
            requestAnimationFrame(tick);
            terrainScene.render();
        }
        tick();
    });

});
