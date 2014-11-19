sample_app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'client/views/sample.html',
			controller: ''
		}).
		// when('/users/:userName', {
		// 	templateUrl: 'client/views/todos.html',
		// 	controller: 'SampleController'
		// }).
		otherwise({
			redirectTo: '/'
		});
}]);