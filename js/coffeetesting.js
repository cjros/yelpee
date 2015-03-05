;(function(exports){

	'use strict';

	Backbone.CoffeeSnobRouter = Backbone.Router.extend({
		initialize: function() {
			this.container = document.querySelector('.container');

			Backbone.history.start()
		},
		routes: {
			'*default': 'home'
		},
		home: function() {
			console.log('Home Route');
			var self = this;

			this.collection = new Backbone.CoffeeShopCollection({});
			this.collection.fetch().then(function(data) {
				console.log(data)
				self.container.innerHTML = '<span.hi>' + data.name + '</span>'
			});
		},
		cycleShops: function() {
			
		}
	});

	Backbone.CoffeeShopModel = Backbone.Model.extend({
		url: function() {
			return 'http://coffeesnob-api.herokuapp.com/api/shops'  //shop.id
		}
	});

	Backbone.CoffeeShopCollection = Backbone.Collection.extend({
		url: function() {
			return 'http://coffeesnob-api.herokuapp.com/api/shops'
		}
	});

	// Backbone.Header = createClass({

	// });

	// Backbone.HomeView = createClass({

	// });
	
})(typeof module === 'object' ? module.exports: window);