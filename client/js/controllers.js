count_app.controller('SampleCtrl', ['$scope', '$firebase', function($scope, $firebase) {
	
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

// todo check if I need $firebase for card controller
count_app.controller('CardCtrl', ['$scope', '$firebase', function($scope, $firebase) {
	var ten_cards = [10, 'j', 'q', 'k'];

	var full_deck = [new Card(2,'c'),new Card(2,'d'), new Card(2,'h'), new Card(2,'s'), new Card(3,'c'), new Card(3,'d'), new Card(3,'h'), new Card(3,'s'), new Card(4,'c'), new Card(4,'d'), new Card(4,'h'), new Card(4,'s'), new Card(5,'c'), new Card(5,'d'), new Card(5,'h'), new Card(5,'s'), new Card(6,'c'), new Card(6,'d'), new Card(6,'h'), new Card(6,'s'), new Card(7,'c'), new Card(7,'d'), new Card(7,'h'), new Card(7,'s'), new Card(8,'c'), new Card(8,'d'), new Card(8,'h'), new Card(8,'s'), new Card(9,'c'), new Card(9,'d'), new Card(9,'h'), new Card(9,'s'), new Card(10,'c'), new Card(10,'d'), new Card(10,'h'), new Card(10,'s'), new Card('j','c'), new Card('j','d'), new Card('j','h'), new Card('j','s'), new Card('q','c'), new Card('q','d'), new Card('q','h'), new Card('q','s'), new Card('k','c'), new Card('k','d'), new Card('k','h'), new Card('k','s'), new Card('a','c'), new Card('a','d'), new Card('a','h'), new Card('a','s')];

	var random_int = function(min, max) { // inclusive min and inclusive max
		return Math.floor(Math.random() * (max-min+1)) + min;
	}

	function Card(value, suit) {
		// value is 1 of 2,3,4,5,6,7,8,9,10,'j','q','k','a'
		// suit is 1 of 'c','d','h','s'
		this.value = value;
		this.suit = suit;
		this.get_bj_value = function(value) {
			if (value === 'a') return 1 || 11 //todo value of ace
			else if (ten_cards.indexOf(value) > -1) return 10;
			else return value;
		};
		this.bj_value = this.get_bj_value(this.value);
	}

	function Deck(number_of_full_decks) {
		this.number = number_of_full_decks;
		this.get_cards = function() {
			new_deck = [];
			for (var i=0; i<this.number; i++) {
				new_deck = new_deck.concat(full_deck);
			}
			return new_deck;
		};
		this.cards = this.get_cards();
		this.shuffle = function() { // modern Fisher-Yates shuffle
			var to_shuffle = this.cards;
			for (var i=0; i<to_shuffle.length; i++) {
				// j is random int with i<=j<n
				var j = random_int(i, to_shuffle.length-1)
				// exchange a[j] and a[i]
				var temp = to_shuffle[i];
				to_shuffle[i] = to_shuffle[j];
				to_shuffle[j] = temp;
			}
			return to_shuffle;
		};
	}

	var deck = new Deck(1);
	$scope.cards = deck.shuffle();


}]);














