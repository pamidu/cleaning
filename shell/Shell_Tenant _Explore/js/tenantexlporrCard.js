angular
.module('mainApp', ['ngMaterial', 'uiMicrokernel', 'ngAnimate'])

.controller('AppCtrl', function ($scope ,$http ,$interval, $mdToast, $mdDialog ,$auth, $objectstore, $v6urls) 
{
  $scope.blur={};
  $scope.blur.url="img/duo.jpg";
  $scope.blur.defUr=$scope.iconUrl;
  $scope.blur.intensity="120";
  $scope.img={};
  $scope.img.defaultImg="img/duo.jpg";
  $scope.img.ProfImg=$scope.iconUrl;

  $scope.alert = '';
  $scope.ModifiedTenantData = [];
  $scope.ModifiedTenantOwernData=[];
  $scope.Status="";

  $scope.loading=false;
  $scope.nodata=false;

  $scope.btnshow=false;

  $scope.btnclick = function(){
    $scope.btnshow=!$scope.btnshow;
  };

  //Start scrollbar cntrl
  $scope.scrollbarConfig = {
    autoHideScrollbar: false,
    theme: 'minimal-dark',
    axis: 'y',
    advanced: {
      updateOnContentResize: true
    },
    scrollInertia: 300
  };
  //End scrollbar cntrl

  $scope.showAlert = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.body))
      .title('Alert(invite)')
      .content('This Tenant will be confirmed via your request from Email.') 
      .ariaLabel('Alert Dialog Demo')
      .ok('Got it!')
      .targetEvent(ev)
      );
  };

//Start toast ctrl
$scope.toastPosition = {
  bottom: true,
  top: false,
  left: false,
  right: true
};

$scope.getToastPosition = function() 
{
  return Object.keys($scope.toastPosition)
  .filter(function(pos) { return $scope.toastPosition[pos]; })
  .join(' ');
};

$scope.showSimpleToast = function(data) {
  console.log(data);
  $scope.tenant = data;
  $mdToast.show(
    $mdToast.simple()
    .content($scope.tenant.TenantID + ' Subscribed successfully!')
    .position($scope.getToastPosition())
    .hideDelay(3000)
    );
};
// End toast ctrl

// START array for content1Card.html
$scope.ModifiedTenantData = [];
$scope.enter = function(keyEvent,text)
{
  $scope.ModifiedTenantData = [];
  if (keyEvent.which === 13)
  {
    $scope.loading=true;
    $http.get($v6urls.auth + "/tenant/SearchTenants/"+text+"/50/1")
    .success(function(data)
    {
      $scope.tenant = getIntersectionOfArray(data,$scope.tenantOwern);
      console.log($scope.tenant);

//Start change status value cntl
$scope.statusIncludes = [];
for(var i = 0; i < $scope.tenant.length; i++)
{
  var statusVar = $scope.tenant[i].Private;
  var tempArr = $scope.tenant[i];

//console.log(tempArr);
if(statusVar === true){
  tempArr.Status = "Private";
  $scope.ModifiedTenantData.push(tempArr);
}else
{
  tempArr.Status = "Public";
  $scope.ModifiedTenantData.push(tempArr);
}
}
//End change status value cntl

//Start if it is not data
if($scope.tenant.length === 0) 
{
  $scope.nodata=true;
  $scope.loading=false;
}
else{
  $scope.nodata=false;
  $scope.loading=false;
}
//End if it is not data

})
    .error(function(data,status,config)
    {
      console.log(data);
    });

    if($scope.selectedItem === null)
    {
      $scope.selectedItem = query;  
      console.log($scope.results);
    }else{
//console.log($scope.selectedItem);
}
}

};
//END array for content1Card.html

// START array for content2Card.html 
var session = $auth.checkSession();

$http.get($v6urls.auth + "/tenant/GetTenants/" + $auth.getSecurityToken())
.success( function (data) 
{
  $scope.tenantOwern = data;
  console.log(data);
  $scope.statusIncludes = [];
  //$scope.nodata=false;
  for(var i = 0; i < $scope.tenantOwern.length; i++)
  {
    var statusVar = $scope.tenantOwern[i].Private;
    var tempArr = $scope.tenantOwern[i];

    if(statusVar === true)
    {
      tempArr.Status = "Private";
      $scope.ModifiedTenantOwernData.push(tempArr);
    }
    else
    {
      tempArr.Status = "Public";
      $scope.ModifiedTenantOwernData.push(tempArr);
    }
  }
});
//END array for content2card.html

//Checking the 2 array and duplicate one hidden inside enter() method 
getIntersectionOfArray = function(tenant,tenantOwern){
  globalArray = [];
  angular.forEach(tenant, function(value,index){
    var isFound = false;
    angular.forEach(tenantOwern, function(object,index1){
      if (isFound == false)
        if(value.TenantID==object.TenantID){
          isFound = true;
        }
      });

    if (!isFound){
      globalArray.push(value);
    }
  })
  return globalArray;
}

 //Start filter subscribe(Public) or unsubscribe(Private)
 $scope.private=function(data)
 {
  $scope.Status="Private";
  console.log($scope.Status);
  $scope.$emit('iso-method', {name:'shuffle', params:null});
};

$scope.public=function(data)
{
  $scope.Status="Public";
  $scope.$emit('iso-method', {name:'shuffle', params:null});
};

$scope.all=function(data)
{
  $scope.Status="";
  $scope.$emit('iso-method', {name:'shuffle', params:null});
};
  //End filter subscribe(Public) or unsubscribe(Private)

//tabs details 
$scope.tabs=[{ title: 'Explore', url: 'content1Card.html'}, {title:'Manage',url: 'content2Card.html'}];
$scope.selectedIndex = 0;
$scope.showglobal=true;
$scope.showsubscribed=true;
$scope.nodata=false;

//Start tab selected cntrl
$scope.onTabChange = function()
{
  if($scope.selectedIndex === 0)
  {
    $scope.ctrl.searchText="";
    $scope.Status="";
    $scope.explore=true;
    $scope.ModifiedTenantData=null;
    $scope.showglobal=true;
    $scope.showsubscribed=true;
    $scope.loading=false;
    $scope.nodata=false;
    $scope.btnshow=false;
  }
  else{
    $scope.ctrl.searchText="";
    $scope.Status="";
    $scope.explore=false;
    $scope.showglobal=false;
    $scope.showsubscribed=false;
    $scope.loading=false;
    $scope.nodata=false;
    $scope.btnshow=false;
  }
};
//End tab selected

})//End Appctrl

//Strat Card background image blur directive
.directive('blur',function(){
  return{
    restrict:'E',
    replace:true,
    scope:{
      id:"@",
      blurSrc:"@",
      blurIntensity:"@"
    },
    template:'<canvas id="{{id}}">'
    +'</canvas>',
    link:function(scope,element,attrs){

      var canvas,context,canvasBackground,width,height;

      canvas=element[0];
      width=parseInt(canvas.parentNode.offsetWidth);
      height=parseInt(canvas.parentNode.offsetHeight);
      canvas.width=width;
      canvas.height=height;
      context=canvas.getContext('2d');
      canvasBackground = new Image();
      canvasBackground.src = scope.blurSrc;

      var drawBlur=function(){
        context.drawImage(canvasBackground, 0, 0, width, height);
        stackBlurCanvasRGBA(attrs.id, 0, 0, width, height, scope.blurIntensity);
      }

      canvasBackground.onload=function(){
        drawBlur();
      }
    }
  }

});//End Card background image blur directive





