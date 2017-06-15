(function($angular) {
var directiveLibraryModule = angular.module('directiveLibrary', ['uiMicrokernel']);

	directiveLibraryModule.directive('tagInput', function() {
	  return {
		restrict: 'E',
		template: '<div class="container"><input id="tag1" data-default="what" /></div>',
		link: function(){
		 
			$('#tag1').tagsInput({});
		
		} //end of link
	  };
	});

	
	directiveLibraryModule.directive('customSelector',["$rootScope","$objectstore", function($rootScope,$objectstore) {
	  return {
		restrict: 'E',
		template: '<div class="input-group {{osSize}}"><input type="text" id="box" class="form-control" ng-model="item[osLabel]" disabled style="background-color:#FFF;cursor:default;border-right:none;"><a aria-expanded="false" href="#" class="btn dropdown-toggle input-group-addon" data-toggle="dropdown" style="background: #fff url(img/arrow.png) right no-repeat; border-left:none;"></a> <ul class="dropdown-menu pull-right" style="width:100%;left:0px;cursor:pointer"> <li ng-repeat="data in dataArray"><a ng-click="hrefpress(data)">{{data[osLabel]}}</a></li> </ul></div> ',
		scope:{
			osNamespsace:'@',
			osClass:'@',
			osLabel: '@',
			filter:'=',
			ngModel:"="
		},
		link: function(scope,element){
		 
			scope.item;
			scope.dropdownpixels;
		 
		 scope.$watch("item", function(){
			scope.ngModel = scope.item;
		 });
		 
		 scope.dataArray = {};
		 
		 	var client = $objectstore.getClient(scope.osNamespace,scope.osClass);
			
			client.onGetMany(function(data){
				if (data)
					if(data.length >0)
					scope.dataArray = data;
					console.log(scope.dataArray);
			});	

			if (scope.filter)
				client.getByFiltering(scope.filter);
			else
				client.getByFiltering("*");
					
			
			scope.hrefpress = function(data)
			{
				scope.item = data;
			}

		} //end of link
	  };
	}]);

	directiveLibraryModule.directive('editSelector',["$rootScope","$objectstore", function($rootScope,$objectstore) {
	   return {
		restrict: 'E',
		template: "<div class='input-group {{osSize}}'><input type='text' id='box' class='form-control' placeholder='{{placeholder}}' ng-model='item[osLabel]' ng-keypress='myFunct($event)' style='height:34px; border-right:none; '><a aria-expanded='false' href='#' class='btn dropdown-toggle input-group-addon' data-toggle='dropdown' style='background: #fff url(img/arrow.png) right no-repeat; border-left:none;'></a> <ul class='dropdown-menu pull-right' style='width:100%;left:0px;cursor:pointer'> <li ng-repeat='data in dataArray'><a ng-click='hrefpress(data)'><text>{{data[osLabel]}}</text><img src='img/edit.png' style='float:right;height:20px;width:20px;' ng-click='edit(data)'></img></a></li><li class='divider'></li><li><a ng-click='addNew(osClass)'>Add {{osClass}}</a></li> </ul></div>",
		scope:{
			osNamespsace:'@',
			osClass:'@',
			osLabel: '@',
			placeholder: '@',
			filter:'=',
			ngModel:"="
		},
		link: function(scope,element){
		 
			scope.item;
			scope.selecteditemname;
		 
		  scope.$watch("item", function(){
			scope.ngModel = scope.item;
			
		 });
		 
		 scope.dataArray = {};
		 
		 	var client = $objectstore.getClient(scope.osNamespace,scope.osClass);

					
			client.onGetMany(function(data){
				if (data)
					if(data.length >0)
					scope.dataArray = data;
			});	

			if (scope.filter)
				client.getByFiltering(scope.filter);
			else
				client.getByFiltering("*");
			
			scope.myFunct = function(keyEvent) {
			
				  if (keyEvent.which === 13)
				  {
					var isThere = false;
					for (index = 0; index < scope.dataArray.length; ++index) {				
						if(scope.dataArray[index][scope.osLabel] === scope.selecteditemname)
						{
							isThere = true;
							//alert("Product there ");
						}
				   }
				   if(isThere == false)
					{
							alert("New "+ scope.osClass +" added: "+scope.item[scope.osLabel]);
					}
				}
			}
					
			
			scope.hrefpress = function(data)
			{
				scope.item = data;
				scope.selecteditemname = data[scope.osLabel];
			}
			
			scope.edit = function(data)
			{
				console.log(data);
			}
			
			scope.addNew= function(appType)
			{
				alert(appType);
			}
		} //end of link
	  };
	}]);
		
	directiveLibraryModule.directive('imageLoader',['$uploader', function($uploader) {
	  return {
		restrict: 'E',
		template: '<div class="content"><div id="drop-files" ondragover="return false"><image src="img/cloudimg.png"/><br/><text class="text" >Drag and drop your files to upload them</text><br/></div><div id="uploaded-holder"><div id="dropped-files"><div id="upload-button"><a href="#" class="upload">Upload product Image</a><a href="#" class="delete" style="font-size:10px">delete</a><span>0 Files</span></div></div><div id="extra-files"><div class="number">0</div><div id="file-list"><ul></ul></div></div></div><div id="loading"><div id="loading-bar"><div class="loading-color"> </div></div><div id="loading-content">Uploading file.jpg</div></div><!--div id="file-name-holder"><ul id="uploaded-files"><h1>Uploaded Files</h1></ul></div--></div>',
		link: function(scope,element){
		 
			var $scope = scope;
			// Makes sure the dataTransfer information is sent when we
			// Drop the item in the drop box.
			jQuery.event.props.push('dataTransfer');
			
			var z = -40;
			// The number of images to display
			var maxFiles = 5;
			var files;
			var filesArray = [];
			

			// Get all of the data URIs and put them in an array
			var dataArray = [];
			
			// Bind the drop event to the dropzone.
			$('#drop-files').bind('drop', function(e) {
					
				// Stop the default action, which is to redirect the page
				// To the dropped file
				
				 files = e.dataTransfer.files || e.dataTransfer.files;
				
				for	(indexx = 0; indexx < files.length; indexx++) {
						filesArray.push(files[indexx]);
						console.log(filesArray);
					}		
				
				// Show the upload holder
				$('#uploaded-holder').show();
				
				// For each file
				$.each(files, function(index, file) {
							//	console.log(file.name +" "+ index);
					// Some error messaging 
					if (!files[index].type.match('image.*')) {

							$('#drop-files').html('Please insert images only');
							filesArray.pop();
						return false;
					}
					
					// Check length of the total image elements
					
					if($('#dropped-files > .image').length < maxFiles) {
						// Change position of the upload button so it is centered
						var imageWidths = ((220 + (40 * $('#dropped-files > .image').length)) / 2) - 20;
						$('#upload-button').css({'left' : imageWidths+'px', 'display' : 'block'});
					}
					
					// Start a new instance of FileReader
					var fileReader = new FileReader();
						
						// When the filereader loads initiate a function
						fileReader.onload = (function(file) {
							//console.log(file);
							return function(e) { 
								
								// Push the data URI into an array
								dataArray.push({name : file.name, value : this.result});
								
								// Move each image 40 more pixels across
								z = z+40;
								var image = this.result;
								
								
								// Just some grammatical adjustments
								if(dataArray.length == 1) {
									$('#upload-button span').html("1 file to be uploaded");
								} else {
									$('#upload-button span').html(dataArray.length+" files to be uploaded");
								}
								// Place extra files in a list
								if($('#dropped-files > .image').length < maxFiles) { 
									// Place the image inside the dropzone
									$('#dropped-files').append('<div class="image" style="left: '+z+'px; background: url('+image+'); background-size: cover;"> </div>'); 
								}
								else {
									
									$('#extra-files .number').html('+'+($('#file-list li').length + 1));
									// Show the extra files dialogue
									$('#extra-files').show();
									
									// Start adding the file name to the file list
									$('#extra-files #file-list ul').append('<li>'+file.name+'</li>');
									
								}
							}; 
							
						})(files[index]);
						
					// For data URI purposes
					fileReader.readAsDataURL(file);
			
				});
				

			});
			
			function restartFiles() {
			
				// This is to set the loading bar back to its default state
				$('#loading-bar .loading-color').css({'width' : '0%'});
				$('#loading').css({'display' : 'none'});
				$('#loading-content').html(' ');
				// --------------------------------------------------------
				
				// We need to remove all the images and li elements as
				// appropriate. We'll also make the upload button disappear
				
				$('#upload-button').hide();
				$('#dropped-files > .image').remove();
				$('#extra-files #file-list li').remove();
				$('#extra-files').hide();
				$('#uploaded-holder').hide();
			
				// And finally, empty the array/set z to -40
				filesArray = [];
				z = -40;
				
				return false;
			}
			
			$('#upload-button .upload').click(function() {
				
				//$("#loading").show();
				var totalPercent = 100 / dataArray.length;		
				
					for	(indexx = 0; indexx < filesArray.length; indexx++) {
							console.log(filesArray[indexx].name);
							/*
							$uploader.upload("com.duosoftware.com", "testupload", filesArray[indexx]);
							$uploader.onSuccess(function(e,data){
								alert (" Successfully uploaded");
							});

							$uploader.onError(function(e,data){
								alert ("Upload Error");
							});
							*/
					}
					
			
				return false;
			});
			
			// Just some styling for the drop file container.
			$('#drop-files').bind('dragenter', function() {
				$(this).css({'box-shadow' : 'inset 0px 0px 20px rgba(0, 0, 0, 0.1)', 'border' : '4px dashed #bb2b2b'});
				return false;
			});
			
			$('#drop-files').bind('drop', function() {
				$(this).css({'box-shadow' : 'none', 'border' : '4px dashed rgba(0,0,0,0.2)'});
				return false;
			});
			
			// For the file list
			$('#extra-files .number').toggle(function() {
				$('#file-list').show();
			}, function() {
				$('#file-list').hide();
			});
			
			$('#dropped-files #upload-button .delete').click(restartFiles);
			
		
		} //end of link
	  };
	}]);


directiveLibraryModule.directive('datePicker', function() {
	  return {
		restrict: 'E',
		template: '<div class="{{osSize}}"> <div class="input-group"> <input id="date-picker-2" type="text" class="date-picker form-control"/> <label style="background-color:white" for="date-picker-2" class="input-group-addon btn"><span><img style="height:20px; width:20px; align:center;" src="img/calendar.png"></span> </label> </div> </div>',
		scope:{
			osSize: '@'
		},
		link: function(scope,element){
		 
			$(".date-picker").datepicker();

            $(".date-picker").on("change", function () {
                var id = $(this).attr("id");
                var val = $("label[for='" + id + "']").text();
                $("#msg").text(val + " changed");
            });

		} //end of link
	  };
	});
	
})(window.angular);