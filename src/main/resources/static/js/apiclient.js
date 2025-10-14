var apiclient = (function(){


    const baseUrl = "/blueprintsApi/blueprints";
    

    const createBlueprint = (author, blueprint) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl,
                type: "POST",
                data: JSON.stringify({
                    author: author,
                    name: blueprint.name,
                    points: blueprint.points
                }),
                contentType: "application/json",
                success: function(data) {
                    resolve(data);
                },
                error: function(error) {
                    console.error("Error details:", error);
                    reject(error);
                }
            });
        });
    };

    const deleteBlueprint = (author, blueprintName) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: baseUrl + "/" + author + "/" + blueprintName,
                type: "DELETE",
                success: function() {
                    resolve();
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    };

    return {
        getBlueprintsByAuthor: function(authname, callback){
            $.ajax({
                url: baseUrl + "/" + authname,
                method: "GET",
                dataType: "json",
                success: function(data){
                    callback(data);
                },
                error: function(xhr, status, error){
                    console.error("Error getting blueprints by author:", error);
                    callback([]);
                }
            });
        },

        getBlueprintsByNameAndAuthor: function(authname, bpname, callback){
            $.ajax({
                url: baseUrl + "/" + authname + "/" + bpname,
                method: "GET",
                dataType: "json",
                success: function(data){
                    callback(data);
                },
                error: function(xhr, status, error){
                    console.error("Error getting blueprint by name and author:", error);
                    callback(null);
                }
            });
        },

        getAllAuthors: function(callback){
            $.ajax({
                url: baseUrl,
                method: "GET",
                dataType: "json",
                success: function(data){
                    // Extraer autores únicos de todos los blueprints
                    const authors = [...new Set(data.map(bp => bp.author))];
                    callback(authors);
                },
                error: function(xhr, status, error){
                    console.error("Error getting all authors:", error);
                    callback([]);
                }
            });
        },

        updateBlueprint: function(authname, bpname, blueprint){
            return $.ajax({
                url: baseUrl + "/" + authname + "/" + bpname,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            });
        },

        getBlueprintsByAuthorPromise: function(authname){
            return $.ajax({
                url: baseUrl + "/" + authname,
                method: "GET",
                dataType: "json"
            });
        },

        createBlueprint,
        deleteBlueprint

    };

})();
