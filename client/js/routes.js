count_app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'client/views/home.html',
			controller: ''
		}).
		when('/count', {
			templateUrl: 'client/views/count.html',
			controller: 'CardCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);