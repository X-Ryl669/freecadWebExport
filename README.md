# freecadWebExport
A example tutorial to export from FreeCAD assembly to a web page

This tutorial explains how to export your model and/or assembly from FreeCAD (or any CAD program generating a STEP file) to a useful web page.
This only use free software and does not depend on numerous dependencies.

Currently, the steps listed below require an external (free) software (not open sourced) but since FreeCAD is based on the same underlying 
library (Open CASCADE), this requirement can be probably removed in the future.

# Demo
Please go [here for a demo](https://x-ryl669.github.io/freecadWebExport)

# Pros

1. The resulting archive allows to browse your model in 3D in your browser without any software to install
2. The model is split in as many body you had in your FreeCAD assembly so you have a 1:1 match between the model and your FreeCAD document
3. The model can keep the original body's name (or make its own if missing)
4. Ability to fly to a specific body by clicking on its name
5. Ability to toggle body visibility by clicking on the `eye` icon
6. The original materials and colors from your FreeCAD document are kept and not modified. It's possible to replace materials and colors by generic contrasting colors to improve visibility too. 
 
# Cons
~~Currently, it's not a single document file (but it can be, with some work) so you need to serve the output folder/archive via a webserver.~~
Check the singleFile branch for a version of the code with a single file (usable for distribution without a webserver)

# Usage for single file
In case you want to generate a single HTML file containing both your model and the **player** code, you'll need to do the following steps:
```
cat top.html > your_file.html
cat your_model.gltf >> your_file.html
cat end.html >> your_file.html
```
The other files in this branch are used to generate the `top.html` file containing the player. 

# Remark for any FreeCAD developer
Basically, the single file export is a string replacement for the data in the template html code. You can simply use the generated `index.html` and replace the part between `<script id="data" type="application/json">` and subsequent `</script>` with the generated GLTF json file from FreeCAD 
and you can distribute the output HTML file.

Obviously, you can also update the HTML & style to fit your need, you'll need to run "make" in the main directory to rebuild the player and stylesheet.


# Update 11/22/2020
FreeCAD's repository now has support for exporting GLTF file directly so there is no more need for CAD Assistant, just select "GLTF" in the export format. 
Hooray! 
