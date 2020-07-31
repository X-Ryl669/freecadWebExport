var gltfExplorer = function (menuId, files) {

    window.onload = function () {
        var div = document.getElementById(menuId);
        Ps.initialize(div);
    };

    if (files.length === 0) {
        return;
    }

    var file = files[0];

    new xeogl.AmbientLight({
        color: [.7, .9, 1.0],
        intensity: 0.5
    });
    new xeogl.DirLight({
        dir: [0.8, -0.6, -0.8],
        color: [1.0, 1.0, 1.0],
        intensity: 1.0,
        space: "view",
		shadow: new xeogl.Shadow({
                       resolution: [1000, 1000],
                       intensity: 0.7,
                       sampling: "stratified" // "stratified" | "poisson" | "basic"
                   })
		
    });

    new xeogl.DirLight({
        dir: [-0.8, -0.4, -0.4],
        color: [1.0, 1.0, 1.0],
        intensity: 1.0,
        space: "view",
		shadow: new xeogl.Shadow({
                       resolution: [1000, 1000],
                       intensity: 0.7,
                       sampling: "stratified" // "stratified" | "poisson" | "basic"
                   })
    });

    new xeogl.DirLight({
        dir: [0.2, -0.8, 0.8],
        color: [0.6, 0.6, 0.6],
        intensity: 1.0,
        space: "view",
		shadow: new xeogl.Shadow({
                       resolution: [1000, 1000],
                       intensity: 0.7,
                       sampling: "stratified" // "stratified" | "poisson" | "basic"
                   })
    });

    new xeogl.CubeTexture({
        src: [
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_PX.png",
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_NX.png",
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_PY.png",
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_NY.png",
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_PZ.png",
            "textures/reflect/Uffizi_Gallery/Uffizi_Gallery_Radiance_NZ.png"
        ]
    });

    new xeogl.CubeTexture({
        src: [
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_PX.png",
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_NX.png",
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_PY.png",
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_NY.png",
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_PZ.png",
            "textures/light/Uffizi_Gallery/Uffizi_Gallery_Irradiance_NZ.png"
        ]
    });

    var model = new xeogl.GLTFModel({
        id: "turbine",
        src: file.src,
  //      ghosted: file.ghosted,
        edgeThreshold: 20,
        lambertMaterials: false,
        objects: true,
		replaceColor: false,
        scale: [100, 100, 100],
		handleNode: (function() {
          var objectCount = 0;
		  var localObjCount = 0;
		  var previousName = "Body ";
          return function (nodeInfo, actions) {
		   if (nodeInfo.name !== undefined) {
		     previousName = nodeInfo.name;
			 var liNode = document.createElement("li");
			 if (this.model.nodeRoot === undefined) this.model.nodeRoot = {};
			 this.model.nodeRoot[previousName] = nodeInfo.children ? nodeInfo.children : [nodeInfo.mesh];
			 liNode.innerHTML = `<icon class='bodySelect checked' data-name='${previousName}'></icon><a href='javascript:void'>${previousName}</a>`;
			 document.querySelector(`#${menuId} ul`).insertBefore(liNode, null);
			 localObjCount = 0;
		   }
           if (nodeInfo.mesh !== undefined) { // Node has a mesh
              actions.createObject = {
                id: "Body " + objectCount
              };
			  this.model.nodeRoot[previousName][localObjCount++] = objectCount;
			  objectCount++;
           }
		   
           return true;
          };
		})()
    });

    //  model.scene.camera.gimbalLock = false;

    var cameraFlight = new xeogl.CameraFlightAnimation();

    window.selectObject = (function () {

        var lastObject;
		var lastVisible;

		function mixAABB(a, b) { return new Float32Array([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]),
														  Math.max(a[3], b[3]), Math.max(a[4], b[4]), Math.max(a[5], b[5])]); }
		
		
        return function (el) {
		
			var g = el === false;
			Object.keys(model.scene.objects).forEach((o,i) => { 
				if (i == 0) return; 
				var obj = model.scene.objects[o]; 
				obj.ghosted = !g; obj.highlighted = false; 
			});
			if (lastVisible !== undefined)
			{
				for (var i = 0; i < lastVisible.length; i++) {
					var object = model.scene.objects["Body " + lastVisible[i]];
					object.visible = false;
				}
				lastVisible = undefined;
			}
			if (el) {
				lastObject = model.nodeRoot[el.target.text];
				if (!el.target.parentNode.children[0].classList.contains("checked"))
					lastVisible = lastObject;
				else lastVisible = undefined;
				var aabb = new Float32Array([1e12, 1e12, 1e12, -1e12, -1e12, -1e12]); 
				for (var i = 0; i < lastObject.length; i++) {
					var object = model.scene.objects["Body " + lastObject[i]];
					object.ghosted = false;
					object.highlighted = true;
					object.visible = true;
					aabb = mixAABB(aabb, object.aabb);
				}
                cameraFlight.flyTo({
                    aabb: aabb,
                    fitFOV: 25,
                    duration: 1.0,
                    showAABB: false
                });
			}
        };
    })();
	
	window.bodyVisibilityChanged = function(el) {
		var objectIndexArray = model.nodeRoot[el.target.getAttribute("data-name")];
		for (var i = 0; i < objectIndexArray.length; i++) {
			model.scene.objects["Body " + objectIndexArray[i]].visible = !el.target.classList.contains('checked');
		}
		el.target.classList.toggle('checked');
	};

	var possibleColors = [
	[ 0.8, 0.8, 0.8 ],
	[ 0.9, 0.6, 0.6 ],
	[ 0.6, 0.9, 0.6 ],
	[ 0.6, 0.6, 0.9 ],
	[ 0.9, 0.2, 0.6 ],
	[ 0.8, 0.6, 0.2 ],
	[ 0.7, 0.7, 0.2 ],
	[ 0.2, 0.8, 0.8 ],
	[ 0.8, 0.2, 0.8 ],
	[ 0.8, 0.8, 0.2 ],
	[ 0.2, 0.8, 0.8 ],
	];
	
    model.on("loaded", function () {

        var html = [""];
        var i = 0;
        for (var objectId in model.objects) {
            if (model.objects.hasOwnProperty(objectId)) {
                var object = model.objects[objectId];
				i++;
				
				object.castShadow = true;
				object.receiveShadow = true;
				if (this.replaceColor) {
					object.material.baseColor = possibleColors[i % possibleColors.length];
				}
				object.material.metallic = 0.9;
				object.material.roughness = 0.1;
			
            }
        }
		i = 0;

		document.querySelectorAll('.bodySelect').forEach(obj => obj.addEventListener('click', bodyVisibilityChanged) );
		document.querySelectorAll('.bodySelect + a').forEach(obj => obj.addEventListener('click', selectObject) );

        cameraFlight.jumpTo({
            aabb: model.aabb,
            fit: true,
            fitFOV: 50
        });
    });

    var cameraControl = new xeogl.CameraControl();
};