	//@author hcadavid

	apimock=(function(){

		var mockdata=[];

		mockdata["johnconnor"]=	[{author:"johnconnor","points":[{"x":150,"y":120},{"x":215,"y":115}],"name":"house"},
			{author:"johnconnor","points":[{"x":340,"y":240},{"x":15,"y":215}],"name":"gear"}];
		mockdata["maryweyland"]=[{author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"house2"},
			{author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"gear2"}];
		mockdata["SantiagoHurtado"]= [{author:"SantiagoHurtado","points":[{"x":167,"y":200},{"x":105,"y":105}],"name":"MyHouse"},
			{author:"SantiagoHurtado","points":[{"x":167,"y":200},{"x":105,"y":105}],"name":"MyCar"}];
		mockdata["MayerllySuarez"]= [{author:"MayerllySuarez","points":[{"x":140,"y":140},{"x":204,"y":257}],"name":"MyBlueprint"},
			{author:"MayerllySuarez","points":[{"x":305,"y":324},{"x":411,"y":423}],"name":"MyDesign"}];



		return {
			getBlueprintsByAuthor:function(authname,callback){
				callback(
					mockdata[authname]
				);
			},

			 getBlueprintsByNameAndAuthor:function(authname,bpname,callback){

				callback(
					mockdata[authname].find(function(e){return e.name===bpname})
				);
			}
		}

	})();

	/*
	Example of use:
	var fun=function(list){
		console.info(list);
	}

	apimock.getBlueprintsByAuthor("johnconnor",fun);
	apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/