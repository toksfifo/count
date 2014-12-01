count_app.directive('card', function() {
	return {
		restrict: 'A',
		// scope: {
		// 	data: '='
		// },
		templateUrl: 'client/views/card.html',
		// transclude: true,
		// controller: function($scope) {
		// 	console.log('card directive in action');
		// }
	};
});

count_app.directive('scrollToItem', function() {                                         
    return {                                                                                 
        restrict: 'A',                                                                       
        scope: {                                                                             
            scrollTo: "@"                                                                    
        },                                                                                   
        link: function(scope, $elm, attr) {                                                   
            $elm.on('click', function() {                                                    
                $('html,body').animate({scrollTop: $(scope.scrollTo).offset().top }, 800);
            });                                                                              
        }                                                                                    
    };
});     