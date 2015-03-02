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
						z('div.header', model.get('name')),
						z('div.map', model.get('project')),
						z('div.list', 'this is just going to be a filler to see if this div will show')
					])
		}
	})
	
})(typeof module === 'object' ? module.exports: window)