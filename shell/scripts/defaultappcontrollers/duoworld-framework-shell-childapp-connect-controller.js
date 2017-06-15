(function(){

	var duoworldFrameworksShellLauncherConnectControl = function($scope, $location, $state,$http, $rootScope , $chat, $presence, $auth, $apps, $helpers, $mdSidenav){
		
		/*dont mess with this section !*/
			$scope.childApplicationClose = function(){
				$state.go('dock');
			};

			$scope.childApplicationMinimise = function(){
				$state.go('dock');
			};
		/*restricted space ends here*/

		/*----------------------- go crazy from here onwards ----------------------*/

		$scope.selectedUser = "Duo Connect";
		$scope.currentUser = "Log in";
   
		function buildToggler(navID) {
		  return function() {
			return $mdSidenav(navID).toggle()
			  .then(function () {
				$log.debug("toggle " + navID + " is done");
			  });
		  }
		}
		
		//TEMPORARY FORCE-LOGINS START
	    $scope.login1 = function(){
	   
			$auth.onLoginResult(function(){
				$scope.currentUser = $auth.getUserName();
				$presence.setOnline();
			});
	
			$auth.forceLogin("Dilshan","user1","123");
			chat();
	   	}
   
		$scope.login2 = function(){
			$auth.onLoginResult(function()
			{
				$scope.currentUser = $auth.getUserName();
				$presence.setOnline();
			});
		
			$auth.forceLogin("Hiflan","user2","1234");
		
			chat();
   
		}
	
		$scope.login3 = function(){
	   
			$auth.onLoginResult(function(){
				$scope.currentUser = $auth.getUserName();
				$presence.setOnline();
			});
		
			$auth.forceLogin("Supun","user1","1235");
			chat();
	   	}
   
	    $scope.login4 = function(){
			$auth.onLoginResult(function()
			{
				$scope.currentUser = $auth.getUserName();
				$presence.setOnline();
			});
		
			$auth.forceLogin("Eshwaran","user2","1236");
			chat();
		}
		//TEMPORARY FORCE-LOGINS FINISH
	
	
		var diableChat = true;
	    $scope.diableChatInput = function()
	    {	
			 return diableChat;
	    }
   
		function chat() {
	   
			//location.href = '#/chat';
			$scope.loginButton = false;
			$scope.currentMessage = "";

			$scope.allUsers = [];

			var messageId=0;
			
			
			$scope.selectUser = function(user){
			
				$scope.selectedUser = user.userName;
				diableChat = false;
				$scope.diableChatInput();
				
			}
			
			
			$scope.sendMessage = function(keyEvent){
				
				//Get user input for chat with enter key if the input is not empty
				if (keyEvent.which === 13)
					{
						if($scope.currentMessage)
						{
							$chat.send($scope.selectedUser, $scope.currentUser, $scope.currentMessage);
							//$scope.receivingMessages.push({mId: messageId++, message:$scope.currentMessage, sender: $scope.currentUser});
							$( "#chatContentLarge" ).append( "<img src='img/profilepic.png' width='40px' height='40px' style='border-radius:100px;float:right;margin-top:10px;margin-right:5px;'><md-card class='md-card-right' style='background:white;float:right'><md-card-content>"+$scope.currentMessage+"</md-card-content></md-card> <br/><br/><br/><br/>" );
							$scope.currentMessage = "";
						}
					}
			}

			$presence.onUserStateChanged(function(e,data){
				if (data.state == "online"){
					$scope.allUsers.push({userName:data.userName});
				} else{
					var removeIndex =-1;
					for (index in $scope.allUsers)
					if ($scope.allUsers[index].userName==data.userName){
						removeIndex = index;
						break;
					}

					if (removeIndex!=-1)
						$scope.allUsers.splice(removeIndex,1);
				}
			});

			$presence.onStateChanged(function(e,data){
				$presence.getOnlineUsers();
			});

			$chat.onMessage(function(e,data){
				//$scope.receivingMessages.push({mId: messageId++, message:data.message, sender:$scope.toUser});
				$( "#chatContentLarge" ).append("<div style='float:left'><img src='img/caller.jpg' width='40px' height='40px' style='border-radius:100px;margin-top:10px;margin-left:5px;'><md-card class='md-card-left' style='background:white;float:right'><md-card-content>"+data.message+"</md-card-content></md-card></div><br/><br/><br/><br/> ");
			});
			
			$presence.onOnlineUsersLoaded(function(e,data){
				var newUsers  = [];
				var cUser = $auth.getUserName();
				for (var uIndex in data.users)
					if (data.users[uIndex].userName != $scope.currentUser)
						newUsers.push(data.users[uIndex]);
						
				$scope.allUsers = newUsers;
			});
		
	    }
		
	
		
		var currentNumber;
		$scope.changeNumber = function (num) {
			
			if(currentNumber == null || currentNumber == "")
			{
				currentNumber = num;
				$scope.dialingNumber = currentNumber;
			}else
			{
				currentNumber = currentNumber+num;
				$scope.dialingNumber = currentNumber;
			}
			
		}

		$scope.backspace = function() {
			currentNumber = currentNumber.substring(0, currentNumber.length - 1);
			$scope.dialingNumber = currentNumber;
		}
		
	};

	duoworldFrameworksShellLauncherConnectControl.$inject = ['$scope', '$location', '$state', '$http','$rootScope' ,'$chat', '$presence', '$auth', '$apps', '$helpers', '$mdSidenav'];

	mambatiFrameworkShell.controller('duoworld-framework-shell-launcher-connect-ctrl', duoworldFrameworksShellLauncherConnectControl);
}());