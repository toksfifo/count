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
count_app.controller('CardCtrl', ['$scope', '$firebase', '$interval', function($scope, $firebase, $interval) {
	var ten_cards = [10, 'j', 'q', 'k'];

	var full_deck = [new Card(2,'c'),new Card(2,'d'), new Card(2,'h'), new Card(2,'s'), new Card(3,'c'), new Card(3,'d'), new Card(3,'h'), new Card(3,'s'), new Card(4,'c'), new Card(4,'d'), new Card(4,'h'), new Card(4,'s'), new Card(5,'c'), new Card(5,'d'), new Card(5,'h'), new Card(5,'s'), new Card(6,'c'), new Card(6,'d'), new Card(6,'h'), new Card(6,'s'), new Card(7,'c'), new Card(7,'d'), new Card(7,'h'), new Card(7,'s'), new Card(8,'c'), new Card(8,'d'), new Card(8,'h'), new Card(8,'s'), new Card(9,'c'), new Card(9,'d'), new Card(9,'h'), new Card(9,'s'), new Card(10,'c'), new Card(10,'d'), new Card(10,'h'), new Card(10,'s'), new Card('j','c'), new Card('j','d'), new Card('j','h'), new Card('j','s'), new Card('q','c'), new Card('q','d'), new Card('q','h'), new Card('q','s'), new Card('k','c'), new Card('k','d'), new Card('k','h'), new Card('k','s'), new Card('a','c'), new Card('a','d'), new Card('a','h'), new Card('a','s')];

	var random_int = function(min, max) { // inclusive min and inclusive max
		return Math.floor(Math.random() * (max-min+1)) + min;
	}

	var get_split_from_freq = function(freq, number_of_decks, number_of_cards_per_time) {
		var split = [];
		if (freq == 'never') {
			split = [];
		}
		else if (freq == 'randomly') { // todo
			var number_of_splits = number_of_decks*4;
			var total_iterations = Math.floor(number_of_decks*52/number_of_cards_per_time);
			for (var i=0; i<number_of_splits; i++) {
				split.push(random_int(1, total_iterations));
			}
		}
		else if (freq == 'once at middle') {
			split = [Math.floor((number_of_decks*52/2)/number_of_cards_per_time)];
		}
		return split;
	};

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

	$scope.deck;
	$scope.cards;
	$scope.current_deal = [];
	$scope.split_array;
	var start_deal;
	var iterations;

	$scope.freq_options = ['randomly', 'never', 'once at middle'];

	$scope.create_deck = function(number_of_decks) {
		$scope.deck = new Deck(number_of_decks);
		$scope.cards = $scope.deck.cards;
	};

	$scope.create_shuffled_deck = function(number_of_decks) {
		$scope.deck = new Deck(number_of_decks);
		$scope.cards = $scope.deck.shuffle();
	};

	$scope.deal = function(number_of_cards) {
		for (var i=0; i<number_of_cards; i++) {
			if ($scope.cards.length) {
				$scope.current_deal.push($scope.cards.shift());
			}
		}
		return $scope.current_deal;
		// todo focus on count_guess
	};

	$scope.deal_continuous = function(number_of_cards_per_time, time_per_cards, number_of_decks, count_freq) {
		$scope.current_deal = [];
		$scope.split_array = get_split_from_freq(count_freq, number_of_decks, number_of_cards_per_time);
		// console.log($scope.split_array);
		$scope.create_shuffled_deck(number_of_decks);
		$scope.deal(number_of_cards_per_time);
		iterations = 1;
		$scope.continue_deal(number_of_cards_per_time, time_per_cards, $scope.split_array);
	};

	$scope.continue_deal = function(number_of_cards_per_time, time_per_cards, split_array) {
		start_deal = $interval(function() {
			iterations++;
			// console.log(iterations);
			$scope.deal(number_of_cards_per_time);
			$scope.remove_shown_cards(number_of_cards_per_time);
			if (split_array.indexOf(iterations) > -1) {
				$scope.pause_deal();
			}
			if ($scope.current_deal.length == 0) {
				$scope.pause_deal();
			}
		}, time_per_cards*1000);
	};

	$scope.pause_deal = function() {
		$interval.cancel(start_deal);
	};

	$scope.remove_shown_cards = function(number_of_cards_to_remove) {
		for (var i=0; i<number_of_cards_to_remove; i++) {
			$scope.current_deal.shift();
		}
	};

	$scope.verify_count = function(guess) {
		if (guess == -$scope.get_count($scope.cards)) { // important comparison, since guess is a string
			$scope.count_right = true;
			// todo try to set timeout here
			// $timeout(function() {$scope.count_right = false;}, 1000);
			$scope.count_wrong = false;
			$scope.continue_deal($scope.number_of_cards_per_time, $scope.time_per_cards, $scope.split_array);
		}
		else {
			$scope.count_right = false;
			$scope.count_wrong = true;
			$scope.continue_deal($scope.number_of_cards_per_time, $scope.time_per_cards, $scope.split_array);
		}
	};

	$scope.count_right = false;
	$scope.count_wrong = false;

	$scope.get_count = function(cards) {
		var count = 0;
		for (var i=0; i<cards.length; i++) {
			count += $scope.convert_bj_value_to_count(cards[i].bj_value);
		}
		return count;
	};

	$scope.convert_bj_value_to_count = function(bj_value) {
		// todo === 1
		if (bj_value === 10 || bj_value === 1) return -1;
		else if (bj_value <= 6) return 1;
		else return 0;
	};


}]);














