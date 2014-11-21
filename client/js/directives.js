count_app.directive('card', function() {
	return {
		restrict: 'A',
		// scope: {
		// 	data: '='
		// },
		templateUrl: 'client/views/card.html',
		// transclude: true,
		controller: function($scope) {
			console.log('card directive in action');
		}
	};
});