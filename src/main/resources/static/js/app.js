const apiModule = apiclient; //apiclient o apimock

const BlueprintApi = (function (){

    let selectedAuthor = null;
    let blueprints = [];
    let authorsCache = [];

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
            $("#totalPoints").text(blueprints.reduce((sum, bp) => sum + bp.points, 0));
        });
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

            const canvas = $("#myCanvas")[0];
            const ctx = canvas.getContext("2d");

            // Limpiar canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Actualizar nombre del plano
            $("#blueprint-name").text(blueprintName);

            // Dibujar puntos y líneas
            if(blueprint.points && blueprint.points.length > 0){
                ctx.beginPath();
                ctx.strokeStyle = "#2E7D32";
                ctx.lineWidth = 2;
                ctx.fillStyle = "#FF5722";

                // Dibujar líneas
                ctx.beginPath();
                ctx.moveTo(blueprint.points[0].x, blueprint.points[0].y);

                for(let i = 1; i < blueprint.points.length; i++){
                    ctx.lineTo(blueprint.points[i].x, blueprint.points[i].y);
                }
                ctx.stroke();

                // Dibujar puntos
                blueprint.points.forEach((p) => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        });
    }

    return {
        loadAuthors,
        consultAuthor,
        drawLineSegments
    };
})();

$(function(){
    $("#author").on("focus", ()=>BlueprintApi.loadAuthors());
    $("#btn-consult").on("click", ()=>BlueprintApi.consultAuthor());
});