;(function(exports){

	'use strict';

	Backbone.CoffeeSnobRouter = Backbone.Router.extend({
		initialize: function() {
			this.container = document.querySelector('.container');

			Backbone.history.start()
		},
		routes: {
			':id': 'shop',
			'*default': 'home'
		},
		home: function() {
			console.log('Home Route');
			var self = this;

			this.collection = new Backbone.CoffeeShopCollection();
			this.view = z(Backbone.HomeView, {collection: this.collection});
			this.collection.fetch().then(function(d) {
				React.render(self.view, self.container);
			});
		},
		shop: function(id) {
			var self = this;
			this.collection = new Backbone.CommentListCollection();
			this.collection.id = id;
			this.view = z(Backbone.CommentsView, {collection: this.collection});
			this.collection.fetch().then(function(d) {
				console.log(self.collection)
				console.log(d)
				React.render(self.view, self.container)
			})
		}
	});

	Backbone.CoffeeShopModel = Backbone.Model.extend({
		// url: function() {
		// 	return 'http://coffeesnob-api.herokuapp.com/api/shops'  //shop.id
		// }
	});

	Backbone.CommentModel = Backbone.Model.extend({
  //       url: function() {
		// 	return 'http://coffeesnob-api.herokuapp.com/api/shops/' + this.collection.id + '/comments'
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

	Backbone.CommentListCollection = Backbone.Collection.extend({
		model: Backbone.CommentModel,
		url: function() {
			return 'http://coffeesnob-api.herokuapp.com/api/shops/' + this.id + '/comments'
		},
		parse: function(data) {
			return data.comments
		}
	});

	Backbone.HeaderComponent = React.createClass({
		displayName: 'HeaderComponent',
		render: function() {
			return z('div.HeaderComponent', [
				z('div.nav', [
					z('ul', [
						z('a[href=#]', [
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

	Backbone.ShopComponent = React.createClass({
		displayName: 'ShopComponent',
		render: function() {
			var aShop = this.props.data;
			return z('a[href=#'+aShop.get('id')+']', aShop.get('name'))
		}
	});

	Backbone.CommentComponent = React.createClass({
		displayName: 'CommentComponent',
		render: function() {
			var aComment = this.props.d;
			return z('div.comment'+aComment.get('id'), aComment.get('message'))
		}
	});

	Backbone.HomeView = React.createClass({
		displayName: 'HomeView',
		render: function() {
			var shops = this.props.collection.models;
			console.log(shops);
			return z('div.homeview-wrapper', [
				z(Backbone.HeaderComponent),
 				z('div.ShopsCollectionComponent', 
 					shops.map(function(data, index, arr) {
 						console.log(data);
 						return z(Backbone.ShopComponent, {key: index, data: data});
 					})
 				)
				// z(Backbone.ShopsCollectionComponent, {shops: this.props.collection.models})
			])
		}
	});

	Backbone.CommentsView = React.createClass({
		displayName: 'CommentsView',
		componentWillMount: function() {
            var self = this
            this.props.collection && this.props.collection.on("change reset add remove", function(){
                self.forceUpdate()
            })
        },
		_addComment: function(e) {
			e.preventDefault();
			// debugger;
			console.log(this.props.collection)
			var msg = {
				message: this.refs.newMessage.getDOMNode().value
			}
			// var adding = new Backbone.CommentModel(msg)
			this.props.collection.create(msg)
			var form = document.querySelector('.addComment');
			form.reset();
		},
		render: function() {
			var comments = this.props.collection.models;
			return z('div.comments-wrapper', [
				z(Backbone.HeaderComponent),
				z('form.addComment', {onSubmit: this._addComment}, [
					z('input:text@newMessage'),
					z('button', 'submit!')
				]),
				z('div.allComments',
					comments.map(function(d, i, a) {
						console.log(d);
						return z(Backbone.CommentComponent, {key: i, d: d})
					})
				)
			])
		}
	});
	
	
})(typeof module === 'object' ? module.exports: window);