var apiclient = (function(){

    const baseUrl = "/blueprintsApi/blueprints";

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
        }
    };

})();