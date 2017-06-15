angular
.module('mainApp', ['ngMaterial','ngAnimate'])

.controller('AppCtrl', function($scope ,$http, $interval, $mdToast, $mdDialog) 
{
  $scope.alert = '';
  $scope.ModifiedTenantData = [];
  $scope.ModifiedTenantOwernData=[];
  $scope.Status="";
  $scope.title1="Search Global Tenants";
  $scope.btnshow=false;
  //$scope.Grid=false;
  
  $scope.btnclick = function(){
    $scope.btnshow=!$scope.btnshow;
   // $scope.Grid=!$scope.Grid;
 };

 $scope.showAlert = function(ev) 
 {
  $mdDialog.show(
    $mdDialog.alert()
    .parent(angular.element(document.body))
    .title('Alert(invite)')
                  .content('This Tenant will be confirmed via your request from Email.')//this tenant will be sent email to you after confirm ur invite 
                  .ariaLabel('Alert Dialog Demo')
                  .ok('Got it!')
                  .targetEvent(ev)
                  );
};


$scope.scrollbarConfig = {
  autoHideScrollbar: false,
  theme: 'minimal-dark',
  axis: 'y',
  advanced: {
    updateOnContentResize: true
  },
  scrollInertia: 300
}

$scope.loading=false;
$scope.nodata=false;

              // Start toast ctrl
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

              $scope.showSimpleToast = function() {
                $mdToast.show(
                  $mdToast.simple()
                  .content('Tenant Subscribed successfully!')
                  .position($scope.getToastPosition())
                  .hideDelay(3000)
                  );
              };
              // End toast ctrl

              // START array for content1.html


              $scope.enter = function(keyEvent,text)
              {
                $scope.ModifiedTenantData = [];

                if (keyEvent.which === 13)
                {
                  //alert('enter');
                  $scope.loading=true;

                  $http.get("http://dw.duoweb.info:3048/tenant/SearchTenants/"+text+"/50/1")
                  .success(function(data)
                  {
                    $scope.tenant = data;
                    console.log(data);
                    $scope.statusIncludes = [];

                  //change status value 
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
                  

                  if($scope.tenant.length === 0) 
                  {
                    $scope.nodata=true;
                    $scope.loading=false;
                  }
                  else{
                    $scope.nodata=false;
                    $scope.loading=false;
                  }

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
  console.log($scope.selectedItem);
}
}



}


              //END array for content1.html

              // START array for content2.html 
              $scope.nodata=false;
              $http.get("http://dw.duoweb.info:3048/tenant/GetTenants/ef1e8ac5c899a78ccc3a581ef6bc3c9a")
              .success(function(data) 
              {
                $scope.tenantOwern = data;
                console.log(data);
                $scope.statusIncludes = [];
                $scope.nodata=false;

                for(var i = 0; i < $scope.tenantOwern.length; i++)
                {
                  var statusVar = $scope.tenantOwern[i].Private;
                  var tempArr = $scope.tenantOwern[i];

                  if(statusVar === true){
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
              //END array for content2.html 

              $scope.private=function(data)
              {
               $scope.Status="Private";
               $scope.$emit('iso-method', {name:'shuffle', params:null});
             }

             $scope.public=function(data)
             {
              $scope.Status="Public";
              $scope.$emit('iso-method', {name:'shuffle', params:null});
            }

            $scope.all=function(data)
            {
              $scope.Status="";
              $scope.$emit('iso-method', {name:'shuffle', params:null});
            }

              //tabs  
              $scope.tabs=[{ title: 'Explore', url: 'content1.html'}, {title:'Manage',url: 'content2.html'}];
              $scope.selectedIndex = 0;
              $scope.showglobal=true;
              $scope.showsubscribed=true;
              $scope.nodata=false;

                //Start tab selected
                $scope.onTabChange = function()
                {
                  if($scope.selectedIndex === 0){
                   $scope.ctrl.searchText="";
                   $scope.Status="";
                   $scope.title1="Search Global Tenants";
                   $scope.ModifiedTenantData=null;
                   $scope.showglobal=true;
                   $scope.showsubscribed=true;
                   $scope.loading=false;
                   $scope.nodata=false;
                   $scope.btnshow=false;
                  // $scope.Grid=false;
                }

                else{
                 $scope.ctrl.searchText="";
                 $scope.Status="";
                 $scope.title1="Search Subscribed Tenants";
                 $scope.showglobal=false;
                 $scope.showsubscribed=false;
                 $scope.loading=false;
                 $scope.nodata=false;
                 $scope.btnshow=false;
                   //$scope.Grid=false;
                 }
               };
              //End tab selected
            }); 






