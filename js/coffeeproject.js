;(function(exports){
	'use strict';

	var collectionData = [{
		name: "Catalina",
		address: "123 Fake St",
		photo_url: "http://i.imgur.com/z2eifSm.jpg",
		rating: 10
	},{
		name: "Tout Suite",
		address: "123 Fake St",
		photo_url: "http://i.imgur.com/z2eifSm.jpg",
		raiting: 10
	}];

	Backbone.CSRouter = Backbone.Router.extend({
		initialize: function(){
			this.container = document.querySelector('.container');
			// this.collection = new Backbone.CoffeeShopList();

			//incorporating collection
			// this.firstPage = z(Backbone.LandingView, {collection: this.collection});

			Backbone.history.start();
		},
		routes: {
			'*default': 'home',
			'/login': 'login'
		},
		home: function(){
			var self = this;
			console.log('hi');
			this.model = new Backbone.CoffeeShop( {shops_url: 'http://coffeesnob-api.herokuapp.com/api/shops'}); // the model
			this.firstPage = z(Backbone.LandingView, {model: this.model}); //might need to put into a promise if errors in the future

			this.model.fetch().then(function(data){
				console.log(data)
				React.render(self.firstPage, self.container);
			})
		},
		login: function(){
			this.loginPage = z(Backbone.LoginView, {model: this.props.model})
			React.render(this.loginPage, this.container);
		}
	});

	Backbone.CoffeeShopList = Backbone.Collection.extend({
        model: Backbone.CoffeeShop
        // url: 'http://coffeesnob-api.herokuapp.com/api/shops'
    })

	Backbone.CoffeeShop = Backbone.Model.extend({
		url: function(){
			
			return this.get('shops_url')

		},
		defaults: {
			name: "chris",
			project: 'coffeesnob'
		}
	})

	var Mapify = React.createClass({
		render: function(){
			return z()
		}
	})

	Backbone.LandingView = React.createClass({
		render: function(){
			var model = this.props.model;
			// debugger;
			console.log(model)
			return z('div.wrapper', [
						z('div.header', [
							z('div.nav', [
								z('ul', [
									z('li#snob', 'coffeeSnob'),
									z('li#home', 'Home'),
									z('li#about', 'About'),
									z('li#sign-in', 'Sign In'),
									z('li#register', 'Register')
								])
							])
						]),
						z('div.map', model.get('shops')[0].id),//need to get collection here
						z('div.list', 'this is just going to be a filler to see if this div will show')
					])
		}
	});

	Backbone.LoginView = React.createClass({
		render: function(){
			return z('div.login-wrapper', [
				z('div.form-wrapper', [
					z('form.login-info', [
						z('input:text@username'),
						z('input:password@password'),
						z('button', 'LOGIN')
					])
				])
			])
		}
	})
	
})(typeof module === 'object' ? module.exports: window)