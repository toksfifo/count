count_app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'client/views/sample.html', // todo remove sample.html
			controller: ''
		}).
		when('/cards', {
			templateUrl: 'client/views/cards.html',
			controller: 'CardCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);