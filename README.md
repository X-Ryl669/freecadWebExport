# freecadWebExport
A example tutorial to export from FreeCAD assembly to a web page

This tutorial explains how to export your model and/or assembly from FreeCAD (or any CAD program generating a STEP file) to a useful web page.
This only use free software and does not depend on numerous dependencies.

Currently, the steps listed below require an external (free) software (not open sourced) but since FreeCAD is based on the same underlying 
library (Open CASCADE), this requirement can be probably removed in the future.

# Demo
Please go [here for a demo](https://x-ryl669.github.io/freecadWebExport)
You'll find more information on [this post](https://blog.cyril.by/en/software/freecadwebexport) too

# Pros

1. The resulting archive allows to browse your model in 3D in your browser without any software to install
2. The model is split in as many body you had in your FreeCAD assembly so you have a 1:1 match between the model and your FreeCAD document
3. The model can keep the original body's name (or make its own if missing)
4. Ability to fly to a specific body by clicking on its name
5. Ability to toggle body visibility by clicking on the `eye` icon
6. The original materials and colors from your FreeCAD document are kept and not modified. It's possible to replace materials and colors by generic contrasting colors to improve visibility too. 
 
# Cons
~~Currently, it's not a single document file (but it can be, with some work) so you need to serve the output folder/archive via a webserver.~~
Check the **singleFile** branch for a version of the code with a single file (usable for distribution without a webserver)

# Process to create this:
So, here is how you should do to go from FreeCAD document to this:

1. In FreeCAD, select all the bodies you want to export and export them to a STEP file (for example: `Assembly.STEP`)
2. (In the future, FreeCAD might allow to export to GLTF format directly, so you'd skip step 3 by exporting a GTLF file directly)
3. If you don't have it, download [CAD Assistant](https://www.opencascade.com/content/cad-assistant) from OpenCascade and install it.
4. In **CAD Assistant**, open your STEP file and export to GLTF file (for example: `Assembly.gltf`)
5. Fetch the `gh-pages` branch of this repository in a folder `export`
6. Copy the `GTLF` file (and if generated, the `BIN` file) in the folder `export/` to `Assembly.{gltf,bin}`
7. Copy all files from folder `export` to your webserver's document root and voilà, it's up!

# Update 11/22/2020
FreeCAD's repository now has support for exporting GLTF file directly so there is no more need for CAD Assistant, just select "GLTF" in the export format. 
Hooray! 
