;
(function(exports) {
    'use strict';

    Math.clamp = function(value, floor, ceil){
    	return Math.min(ceil, Math.max(floor, value))
    }

    var collectionData = [{
        name: "Catalina",
        address: "123 Fake St",
        photo_url: "http://i.imgur.com/z2eifSm.jpg",
        rating: 10
    }, {
        name: "Tout Suite",
        address: "123 Fake St",
        photo_url: "http://i.imgur.com/z2eifSm.jpg",
        raiting: 10
    }];

    Backbone.CSRouter = Backbone.Router.extend({
        initialize: function() {
            this.container = document.querySelector('.container');
            this.collection = new Backbone.CoffeeShopList();

            this.homePage = z(Backbone.LandingView, {
                collection: this.collection
            });

            //incorporating collection
            // this.firstPage = z(Backbone.LandingView, {collection: this.collection});

            Backbone.history.start();
        },
        routes: {
            '*default': 'home'
                // '/login': 'login'
        },
        home: function() {
            var self = this;
            console.log('hi');
            // this.model = new Backbone.CoffeeShop(); // the model
            // this.firstPage = z(Backbone.LandingView, {model: this.model}); //might need to put into a promise if errors in the future

            this.collection.fetch().then(function(data) {
                console.log(data)
                React.render(self.homePage, self.container);
            })
        },
        login: function() {
            // 	this.loginPage = z(Backbone.LoginView, {model: this.props.model})
            // 	React.render(this.loginPage, this.container);
        }
    });

    Backbone.CoffeeShop = Backbone.Model.extend({
        url: function() {
            return "http://coffeesnob-api.herokuapp.com/api/shops/"
        },
        defaults: {
            name: "no name"
        }
    })

    Backbone.CoffeeShopComment = Backbone.Model.extend({
        url: function() {
            debugger;
            return "http://coffeesnob-api.herokuapp.com/api/shops/" + this.get("shop_id") + "/comments"
        },
        defaults: {
            message: "No Comment."
        }
    })

    Backbone.CoffeeShopList = Backbone.Collection.extend({
        model: Backbone.CoffeeShop,
        url: 'http://coffeesnob-api.herokuapp.com/api/shops'
    })

    Backbone.LandingView = React.createClass({
        componentWillMount: function() { //what happens when the object is attached to the dom similar to initialize
            var self = this;
            this.props.collection && this.props.collection.on("change reset add remove", function() {
                self.forceUpdate() //setup listener and then force update on collection change
            })
        },
        render: function() {
            var model = this.props.model;
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
                // z('div.map', model.get('shops')[0].id),
                z('div.main', [
                    z('div.spacer', ''),
                    this.props.collection.models[0].attributes.shops.map(function(i) {
                    	// debugger;
                    	var stars = new Array(Math.clamp(i.rating, 0, 5)).join(',').split(',').map(function(v, i){
	                    		return z('i.fa.fa-coffee', {key: Math.random()})
	                    	}),
                    		nonstars = (5 - stars.length) ? 
                    			new Array(5 - stars.length).join(',').split(',').map(function(v, i){
		                    		return z('i.fa.fa-coffee.empty-star', {key: Math.random()})
		                    	}) : [],
		                    rating = stars.concat(nonstars)

                        return z('div#' + i.id + ".shopCard", [
                            z('div#image' + i.id + ".imgBox", [
                                z('img.' + i.id + "[src="+i.photo.photo.medium.url+"]")
                            ]),
                            z('div#' + i.id + ".shopDeets", [
                                z('div.shopInfo', [
                                    z('div.shop_name', i.name),
                                    z('br', {key: 1}),
                                    z('div.rating', [
                                        z('span.stars', rating)
                                        //z('i.fa.fa-star', ")"), //will need to draw start based on rating
                                    ]),
                                    z('br', {key: 2}),
                                    z('a.website'+'[href='+i.website+']', i.website)
                                ]),
                                z('div.shopContact', [
                                    z('address', [i.address, z('br'), i.city+" "+i.state+" "+i.zip]),
                                    z('span.phoneNo', i.phone)
                                ])   
                            ]),
                            z('div.shopSummary',[
                                	z('i.fa.fa-comments.fa-lg'),
                                	z('div.summaryText',i.description)
                            ])
                        ])
                    })
                ])
            ])
        }
    });

    Backbone.LoginView = React.createClass({
        _test: function() {
            console.log(arguments)
        },
        render: function() {
            return z('div.login-wrapper', [
                z('div.form-wrapper', [
                    z('form.login-info', [
                        z('input:text@username'),
                        z('input:password@password'),
                        z('button', {
                            onSubmit: this._test
                        }, 'LOGIN')
                    ])
                ])
            ])
        }
    })

})(typeof module === 'object' ? module.exports : window)