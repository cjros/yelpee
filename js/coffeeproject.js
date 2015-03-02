;(function(exports){
	'use strict';

	Backbone.CoffeeProject = Backbone.Router.extend({
		initialize: function(){
			this.container = document.querySelector('.container');
			Backbone.history.start();
		},
		routes: {
			'*default': 'home'
		},
		home: function(){
			console.log('hi');
			this.model = new Backbone.GetInfo({}); // the model
			this.firstPage = z(Backbone.LandingView, {model: this.model});
			React.render(this.firstPage, this.container);
		}
	});

	Backbone.GetInfo = Backbone.Model.extend({
		defaults: {
			name: "chris",
			project: 'coffeesnob'
		}
	})

	Backbone.LandingView = React.createClass({
		render: function(){
			var model = this.props.model;
			console.log(model)
			return z('div.wrapper', [
						z('div.header'),
						z('div.map'),
						z('div.list')
					])
		}
	})
	
})(typeof module === 'object' ? module.exports: window)