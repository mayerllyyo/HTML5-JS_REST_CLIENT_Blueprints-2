const apiModule = apimock; //apiclient o apimock

const BlueprintApi = (function (){

    let selectedAuthor = null;
    let blueprints = [];
    let authorsCache = [];
    let currentBlueprint = null;
    let isNewBlueprint = false;

    function getAll(callback, errorCb){
        if(apiModule === apimock){
            const mockAuthors = ["johnconnor", "maryweyland", "SantiagoHurtado", "MayerllySuarez"];
            callback(mockAuthors);
        } else {
            apiclient.getAllAuthors(callback, errorCb);
        }
    }

    function loadAuthors(){
        if(authorsCache.length){
            renderAuthors(authorsCache);
            return;
        }
        getAll(data=>{
            authorsCache = data.sort();
            renderAuthors(authorsCache);
        }, console.error);
    }

    function renderAuthors(list){
        const dl = document.getElementById("authorsList");
        dl.innerHTML = "";
        list.forEach(a=>{
            const opt=document.createElement("option");
            opt.value=a;
            dl.appendChild(opt);
        });
    }

    function getByAuthor(author, callback, errorCb){
        apiModule.getBlueprintsByAuthor(author, (data)=>{
            // Para apimock
            if(!data) {
                blueprints = [];
                callback && callback([]);
                return;
            }
            blueprints = data.map(bp=>({name:bp.name, points:bp.points.length}));
            callback && callback(data);
        });
    }

    function updateBlueprintsTable(){
        if(!selectedAuthor){ alert("Seleccione un autor"); return; }

        getByAuthor(selectedAuthor, (data)=>{
            const tbody = $("#blueprintTable tbody");
            tbody.empty();

            if (!data || data.length === 0) {
                tbody.append('<tr><td colspan="3">No se encontraron planos para este autor.</td></tr>');
                blueprints = [];
            } else {
                blueprints = data.map(bp=>({name:bp.name, points:bp.points.length}));

                blueprints.forEach(bp=>{
                    tbody.append(`
                      <tr>
                        <td>${bp.name}</td>
                        <td class="text-center">${bp.points}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-success open-btn" data-bp="${bp.name}">
                                <span class="glyphicon glyphicon-eye-open"></span> Open
                            </button>
                        </td>
                      </tr>
                    `);
                });

                $(".open-btn").off('click').on("click", function() {
                    const blueprintName = $(this).data("bp");
                    BlueprintApi.drawLineSegments(blueprintName);
                });
            }
            updateTotalPoints()
        });
    }

    function updateTotalPoints(){
        $("#totalPoints").text(blueprints.reduce((sum, bp) => sum + bp.points, 0));
    }

    function consultAuthor(){
        const author = $("#author").val();
        if(!author) return;
        selectedAuthor = author;
        $("#author-name").text(author);
        updateBlueprintsTable();
    }

    function drawLineSegments(blueprintName){
        if(!selectedAuthor){
            alert("Seleccione un autor");
            return;
        }
        apiModule.getBlueprintsByNameAndAuthor(selectedAuthor, blueprintName, (blueprint) => {
            if(!blueprint){
                alert("Blueprint not found");
                return;
            }

            currentBlueprint = blueprint; // Guardar blueprint actual
            renderCanvas();
        });
    }

    function renderCanvas(){
        if(!currentBlueprint) return;

        const canvas = $("#myCanvas")[0];
        const ctx = canvas.getContext("2d");

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Actualizar nombre del plano
        $("#blueprint-name").text(currentBlueprint.name);
        
        // Habilitar el botón de borrado cuando hay un blueprint seleccionado
        $("#btn-delete").prop("disabled", false);

        // Dibujar puntos y líneas
        if(currentBlueprint.points && currentBlueprint.points.length > 0){
            ctx.beginPath();
            ctx.strokeStyle = "#2E7D32";
            ctx.lineWidth = 2;
            ctx.fillStyle = "#FF5722";

            // Dibujar líneas
            ctx.beginPath();
            ctx.moveTo(currentBlueprint.points[0].x, currentBlueprint.points[0].y);

            for(let i = 1; i < currentBlueprint.points.length; i++){
                ctx.lineTo(currentBlueprint.points[i].x, currentBlueprint.points[i].y);
            }
            ctx.stroke();

            // Dibujar puntos
            currentBlueprint.points.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
                ctx.fill();
                });
            }
    }

    function clearCanvas() {
        const canvas = $("#myCanvas")[0];
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $("#blueprint-name").text("");
        
        // Deshabilitar el botón de borrado cuando no hay blueprint seleccionado
        $("#btn-delete").prop("disabled", true);
        
        // Resetear el blueprint actual
        currentBlueprint = null;
    }

    function initCanvasEvents(){
        const canvas = $("#myCanvas")[0];

        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", handleCanvasClick);
        } else {
            // Fallback para navegadores que no soportan PointerEvent
            canvas.addEventListener("mousedown", handleCanvasClick);
            canvas.addEventListener("touchstart", handleCanvasClick);
        }
    }

    function handleCanvasClick(event) {
        if (!currentBlueprint) return;

        const canvas = $("#myCanvas")[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const isTouch = event.type.includes("touch");

        const x = Math.round(((isTouch ? event.touches[0].clientX : event.clientX) - rect.left) * scaleX);
        const y = Math.round(((isTouch ? event.touches[0].clientY : event.clientY) - rect.top) * scaleY);

        currentBlueprint.points.push({x, y});
        renderCanvas();
        updateBlueprintPointsInTable();
    }

    function updateBlueprintPointsInTable(){
        if(!currentBlueprint) return;

        // Buscar y actualizar el blueprint en el array
        const index = blueprints.findIndex(bp => bp.name === currentBlueprint.name);
        if(index !== -1){
            blueprints[index].points = currentBlueprint.points.length;
        }

        const rows = $("#blueprintTable tbody tr");
        rows.each(function(){
            const cells = $(this).find("td");
            if(cells.length > 0 && cells.eq(0).text() === currentBlueprint.name){
                cells.eq(1).text(currentBlueprint.points.length);
            }
        });

        updateTotalPoints();
    }

    function saveUpdateBlueprint(){
        if (!currentBlueprint) return alert("No hay blueprint seleccionado");
        if (!selectedAuthor) return alert("No hay autor seleccionado");

        try {
            if (isNewBlueprint) {
                const blueprint = {
                    author: selectedAuthor,
                    name: currentBlueprint.name,
                    points: currentBlueprint.points
                };
                
                if (apiModule === apimock) {
                    apimock.createBlueprintSync(selectedAuthor, currentBlueprint.name, currentBlueprint.points);
                    isNewBlueprint = false;
                    updateBlueprintsTable();
                    alert("Blueprint creado exitosamente (modo mock)");
                } else {
                    apiclient.createBlueprint(selectedAuthor, blueprint)
                        .then(() => apiclient.getBlueprintsByAuthorPromise(selectedAuthor))
                        .then(data => {
                            isNewBlueprint = false;
                            blueprints = data.map(bp => ({name: bp.name, points: bp.points.length}));
                            updateBlueprintTableFromData(data);
                            updateTotalPoints();
                            alert("Blueprint creado exitosamente");
                        })
                        .catch((error) => {
                            console.error("Error al crear el blueprint:", error);
                            alert("Error al crear el blueprint. Verifica la conexión al servidor y la URL del API.");
                        });
                }
            } else {
                apiclient.updateBlueprint(selectedAuthor, currentBlueprint.name, currentBlueprint)
                    .then(() => apiclient.getBlueprintsByAuthorPromise(selectedAuthor))
                    .then(data => {
                        blueprints = data.map(bp => ({name: bp.name, points: bp.points.length}));
                        updateBlueprintTableFromData(data);
                        updateTotalPoints();
                        alert("Blueprint guardado exitosamente");
                    })
                    .catch((error) => {
                        console.error("Error al guardar el blueprint:", error);
                        alert("Error al guardar el blueprint");
                    });
            }
        } catch (e) {
            console.error("Error crítico:", e);
            alert("Ocurrió un error al procesar la solicitud. Verifica la consola para más detalles.");
        }
    }

    function updateBlueprintTableFromData(data) {
        const tbody = $("#blueprintTable tbody").empty();
        blueprints.forEach(bp => tbody.append(`
              <tr>
                <td>${bp.name}</td>
                <td class="text-center">${bp.points}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-success open-btn" data-bp="${bp.name}">
                        <span class="glyphicon glyphicon-eye-open"></span> Open
                    </button>
                </td>
              </tr>
            `));

        $(".open-btn").off('click').on("click", function() {
            const blueprintName = $(this).data("bp");
            BlueprintApi.drawLineSegments(blueprintName);
        });
    }

    function createNewBlueprint() {
        if (!selectedAuthor) {
            return alert("Seleccione un autor primero");
        }

        clearCanvas();
        
        const blueprintName = prompt("Ingrese el nombre para el nuevo blueprint:");
        if (!blueprintName || blueprintName.trim() === '') return;
        
        currentBlueprint = {
            author: selectedAuthor,
            name: blueprintName,
            points: []
        };
        
        // Actualizar la interfaz
        $("#blueprint-name").text(blueprintName);
        
        // Marcar como nuevo blueprint para que el save actúe como create
        isNewBlueprint = true;
        
        // Habilitar el botón de borrado
        $("#btn-delete").prop("disabled", false);
        
        alert(`Nuevo blueprint "${blueprintName}" creado. Dibuje puntos y luego guarde para crear.`);
    }
    
    function deleteCurrentBlueprint() {
        if (!currentBlueprint || !selectedAuthor) {
            alert("No hay un blueprint seleccionado para borrar");
            return;
        }
        
        if (confirm(`¿Está seguro que desea eliminar el blueprint "${currentBlueprint.name}"?`)) {
            apiclient.deleteBlueprint(selectedAuthor, currentBlueprint.name)
                .then(() => {
                    clearCanvas();
                    
                    // Obtener la lista actualizada de blueprints
                    return apiclient.getBlueprintsByAuthorPromise(selectedAuthor);
                })
                .then(data => {
                    // Actualizar la tabla y el puntaje
                    blueprints = data.map(bp => ({name: bp.name, points: bp.points.length}));
                    updateBlueprintTableFromData(data);
                    updateTotalPoints();
                    alert("Blueprint eliminado exitosamente");
                })
                .catch(error => {
                    console.error("Error al eliminar el blueprint:", error);
                    alert("Error al eliminar el blueprint");
                });
        }
    }

    return {
        loadAuthors,
        consultAuthor,
        drawLineSegments,
        saveUpdateBlueprint,
        initCanvasEvents,
        createNewBlueprint,
        deleteCurrentBlueprint
    };
})();

$(function(){
    $("#author").on("focus", ()=>BlueprintApi.loadAuthors());
    $("#btn-consult").on("click", ()=>BlueprintApi.consultAuthor());
    $("#btn-save").on("click", ()=>BlueprintApi.saveUpdateBlueprint());
    $("#btn-create-blueprint").on("click", ()=>BlueprintApi.createNewBlueprint());
    $("#btn-delete").on("click", ()=>BlueprintApi.deleteCurrentBlueprint());

    BlueprintApi.initCanvasEvents();
});

