;
(function(exports) {
    'use strict';

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

    var Mapify = React.createClass({
        render: function() {
            return z()
        }
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
                z('div.main', [z('ol', [
                    this.props.collection.models[0].attributes.shops.map(function(i) {
                        console.log(i.name);
                        	return z('li#' + i.id+".shops", [
                        		z('img.'+i.id+'[src=./images/catalina-coffee.jpg]'),
                        		z('div.info-container', [
                        			z('div.shop_name', i.name),
                        			z('div.rating', [
                        				z('span.stars', "4"),
                        				z('i.fa.fa-star')
                        			]),
                        			z('pre.address', 'Address\n2201 Washington Ave\nHouston, TX 77007\nUnited States')
                        		])
                        	])
                        
                    })])]
                )
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
