# **Building a "Thick" Client with a REST API, HTML5, JavaScript, and CSS3 (Part II)**

## **Description**

This project extends the previous exercise by integrating client-side interaction with a REST API through a modular 
JavaScript architecture.
The goal is to allow users to create, edit, update, and delete blueprints dynamically using an HTML5 canvas and 
AJAX-based communication with the backend API.

## **Authors**
- **Santiago Hurtado Martínez** [SantiagoHM20](https://github.com/SantiagoHM20)
- **Mayerlly Suárez Correa** [mayerllyyo](https://github.com/mayerllyyo)

### **PDSW Workshop – Thick Client with REST API, HTML5, JavaScript, and CSS3 (Part II)**

![](img/mock2.png)


1. **Pointer Events and Canvas Interaction**

	Add an event handler to the canvas that captures clicks (mouse or touchscreen) using PointerEvent.
	The initialization of handlers must be modularized and not embedded directly in the HTML.

	We implemented addEventListener in the initCanvasEvents() function inside app.js.

	```javascript
	function initCanvasEvents(){
		const canvas = $("#myCanvas")[0];
	
		if (window.PointerEvent) {
			canvas.addEventListener("pointerdown", handleCanvasClick);
		} else {
			canvas.addEventListener("mousedown", handleCanvasClick);
			canvas.addEventListener("touchstart", handleCanvasClick);
		}
	}
	```
   This allows the user to add points on the canvas by clicking or touching, and each new point is immediately drawn.

2. **Save and Update Blueprints (PUT)**

	When clicking Save/Update, the system sends a PUT request to the REST API to update the blueprint, then performs a GET request to refresh all blueprints and recalculate total points.
All operations are handled with Promises to ensure correct execution order.

	We modified and implemented the following functions in app.js:
	```javascript
	function drawLineSegments(blueprintName){
		...
	}
	```
	- Stores the selected blueprint in currentBlueprint.
    - Delegates the drawing to the renderCanvas() function.

	```javascript
	function renderCanvas(){
		if(!currentBlueprint) return;
	
		const canvas = $("#myCanvas")[0];
		const ctx = canvas.getContext("2d");
	
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		$("#blueprint-name").text(currentBlueprint.name);
	
		if(currentBlueprint.points && currentBlueprint.points.length > 0){
			ctx.strokeStyle = "#2E7D32";
			ctx.lineWidth = 2;
			ctx.fillStyle = "#FF5722";
	
			ctx.beginPath();
			ctx.moveTo(currentBlueprint.points[0].x, currentBlueprint.points[0].y);
	
			for(let i = 1; i < currentBlueprint.points.length; i++){
				ctx.lineTo(currentBlueprint.points[i].x, currentBlueprint.points[i].y);
			}
			ctx.stroke();
	
			currentBlueprint.points.forEach((p) => {
				ctx.beginPath();
				ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
				ctx.fill();
			});
		}
	}
	```
	And for table updates:
	```javascript
	function updateBlueprintPointsInTable(){
		...
	}
	```
	- Updates the number of points in memory and in the HTML table.
	- Recalculates the user’s total points dynamically.

   Finally, updateBlueprintsTable() was refactored to use updateTotalPoints().
 
3. **Create New Blueprints (POST)**

	When clicking Save/Update, the application should:

   - Send a PUT request to update the blueprint on the API.
   - Perform a GET to refresh the author’s blueprints.
   - Recalculate the total number of points.
   All actions use Promises to guarantee proper execution order.

	In apiclient.js:
	
	```javascript
	updateBlueprint: function(authname, bpname, blueprint){
		return $.ajax({
			url: baseUrl + "/" + authname + "/" + bpname,
			type: 'PUT',
			data: JSON.stringify(blueprint),
			contentType: "application/json"
		});
	}
	
	getBlueprintsByAuthorPromise: function(authname){
		return $.ajax({
			url: baseUrl + "/" + authname,
			method: "GET",
			dataType: "json"
		});
	}
	```
	In app.js:
	```javascript
	function saveUpdateBlueprint(){
		if(!currentBlueprint || !selectedAuthor) return;
	
		apiclient.updateBlueprint(selectedAuthor, currentBlueprint.name, currentBlueprint)
			.then(() => apiclient.getBlueprintsByAuthorPromise(selectedAuthor))
			.then((data) => {
				blueprints = data.map(bp => ({name: bp.name, points: bp.points.length}));
				refreshBlueprintTable();
				updateTotalPoints();
				alert("Blueprint guardado exitosamente");
			})
			.catch((error) => {
				console.error("Error al guardar el blueprint:", error);
				alert("Error al guardar el blueprint");
			});
	}
	```


4. **Add the **“Create new blueprint”** button so that when it is pressed:

- The current canvas is cleared.  
- The user is prompted to enter the name of the new blueprint (you decide how to do this).  
- This option should modify how the **“save/update”** function works, since in this case, when it is pressed for the first time, it must (also using promises):

  - Make a **POST** request to the **/blueprints** resource to create the new blueprint.  
  - Make a **GET** request to the same resource to update the list of blueprints and the user’s score.


  5. **Add the **“DELETE”** button so that (also using promises):

- The canvas is cleared.  
- A **DELETE** request is made to the corresponding resource.  
- A **GET** request is made to retrieve the blueprints that are now available.

