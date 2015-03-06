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

			this.collection = new Backbone.CoffeeShopCollection();
			this.homeView = z(Backbone.HomeView, {collection: this.collection});
			this.collection.fetch().then(function(d) {
				// console.log(d)
				// console.log(self.collection)
				React.render(self.homeView, self.container);
			});
		}
	});

	Backbone.CoffeeShopModel = Backbone.Model.extend({
		// url: function() {
		// 	return 'http://coffeesnob-api.herokuapp.com/api/shops'  //shop.id
		// }
	});

	Backbone.CoffeeShopCollection = Backbone.Collection.extend({
		model: Backbone.CoffeeShopModel,
		url: function() {
			return 'http://coffeesnob-api.herokuapp.com/api/shops'
		},
		parse: function(data) {
			return data.shops;
		}
	});

	Backbone.HeaderComponent = React.createClass({
		displayName: 'HeaderComponent',
		render: function() {
			return z('div.HeaderComponent', [
				z('div.nav', [
					z('ul', [
						z('a[href=#home]', [
							z('li.home', 'Home')]),
						z('a[href=#about]', [
							z('li.about', 'About')]),
						z('a[href=#contact]', [
							z('li.contact', 'Contact')
						])
					])
				])
			])
		}
	});

	Backbone.ShopCollectionComponent = React.createClass({
		displayName: 'ShopCollectionComponent',
		render: function() {
			var aShop = this.props.models;
			return z('div.ShopColletionComponent', [
				aShop.map(function(d) {
					console.log(d.get('name'))
				})
			])
		}
	});

	Backbone.HomeView = React.createClass({
		render: function() {
			console.log(this)
			return z('div.wrapper', [
				z(Backbone.HeaderComponent),
				z(Backbone.ShopCollectionComponent, {models: this.props.collection.models})
			])
		}
	});

	

	
	
})(typeof module === 'object' ? module.exports: window);