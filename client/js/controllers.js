sample_app.controller('SampleCtrl', ['$scope', '$firebase', function($scope, $firebase) {
	
	// object
	var obj_ref = new Firebase('https://vivid-heat-8566.firebaseio.com');
	var sync = $firebase(obj_ref);
	var syncObject = sync.$asObject();
	syncObject.$bindTo($scope, 'data');


	// array
	var array_ref = new Firebase('https://vivid-heat-8566.firebaseio.com/list');
	var array_sync = $firebase(array_ref);
	$scope.messages = array_sync.$asArray();
	$scope.addMessage = function(text) {
		$scope.messages.$add(
			{text: text}
		);
	}

	

}]);