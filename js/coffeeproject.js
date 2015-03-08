;
(function(exports) {
    'use strict';

    Math.clamp = function(value, floor, ceil) {
        return Math.min(ceil, Math.max(floor, value));
    }

    Backbone.CSRouter = Backbone.Router.extend({
        initialize: function() {
            this.container = document.querySelector('.container');

            Backbone.history.start();
        },
        routes: {
            'home': 'home',
            'about': 'about',
            'contact': 'contact',
            ':shop_id': 'shopper',
            '*default': 'home'
        },
        home: function() {
            console.log('home')
            var self = this;
            this.shopsCollection = new Backbone.CoffeeShopList();
            this.homePage = z(Backbone.LandingView, {
                collection: this.shopsCollection
            });

            this.shopsCollection.fetch().then(function(data) {
                React.render(self.homePage, self.container);
            })
        },
        about: function() {
            console.log("Rendering About Us");
        },
        contact: function() {
            console.log("Rendering Contact Page");
        },
        shopper: function(shop_id) {
            var self = this;
            this.commentsCollection = new Backbone.CoffeeShopCommentList();
            this.commentsCollection.shop_id = shop_id;

            this.shopInfo = new Backbone.CoffeeShop();
            this.shopInfo.shop_id = shop_id;

            this.detailPage = z(Backbone.DetailView, {
                collection: this.commentsCollection,
                shop: this.shopInfo
            });

            $.when(this.commentsCollection.fetch(), this.shopInfo.fetch()).then(function() {
                React.render(self.detailPage, self.container);
            })
        }
    });

    Backbone.CoffeeShop = Backbone.Model.extend({
            url: function() {
                // debugger;
                return "http://coffeesnob-api.herokuapp.com/api/shops/" + this.shop_id
            }
        })
        /* shops collection */
    Backbone.CoffeeShopList = Backbone.Collection.extend({
        model: Backbone.CoffeeShop,
        url: function() {
            return 'http://coffeesnob-api.herokuapp.com/api/shops'
        }
    });

    Backbone.CoffeeShopComment = Backbone.Model.extend({
        url: function() {
            return ' http://coffeesnob-api.herokuapp.com/api/shops/' + this.collection.shop_id + '/comments/'
        }
    });
    /* comments collection */
    Backbone.CoffeeShopCommentList = Backbone.Collection.extend({
        model: Backbone.CoffeeShopComment,
        url: function() {
            // debugger;
            return 'http://coffeesnob-api.herokuapp.com/api/shops/' + this.shop_id + '/comments/'
        },
        parse: function(data) {
            // debugger;
            return data.comments;
        }
    });

    Backbone.CoffeeShopVote = Backbone.Model.extend({
        url: function() {
            return 'http://coffeesnob-api.herokuapp.com/api/shops/' + this.get('shop_id') + '/votes';
        }
    });

    Backbone.HeaderComponent = React.createClass({
        displayName: 'HeaderComponent',
        render: function() {
            return z('div.header', [
                z('div.nav', [
                    z('ul', [
                        z('a[href=#home]', [
                            z('li.home', 'CoffeeSnob')
                        ]),
                        z('a[href=#about]', [
                            z('li.about', 'About')
                        ]),
                        z('a[href=#contact]', [
                            z('li.contact', 'Contact')
                        ])
                    ])
                ])
            ])
        }
    });

    Backbone.LandingView = React.createClass({
        getInitialState: function() {
            return {}
        },
        getDefaultProps: function() {
            return {
                collection: null
            };
        },
        componentWillMount: function() { //what happens when the object is attached to the dom similar to initialize
            var self = this;
            this.props.collection && this.props.collection.on("change reset add remove", function() {
                self.forceUpdate() //setup listener and then force update on collection change
            })
        },
        componentWillUnmount: function() {
            this.props.collection && this.props.collection.off("change reset add remove")
        },
        render: function() {
            console.log(this.props.collection)
            return z('div.wrapper', [
                z(Backbone.HeaderComponent),
                z('div.main', [
                    z('div.spacer', ''),
                    this.props.collection.models[0].attributes.shops.map(function(i) {
                        var stars = new Array(Math.clamp(i.average_rating, 0, 5)).join(',').split(',').map(function(v, i) {
                                return z('i.fa.fa-coffee', {
                                    key: Math.random()
                                })
                            }),
                            nonstars = (5 - stars.length) ?
                            new Array(5 - stars.length).join(',').split(',').map(function(v, i) {
                                return z('i.fa.fa-coffee.empty-star', {
                                    key: Math.random()
                                })
                            }) : [],
                            rating = stars.concat(nonstars)



                        return z('div#' + i.id + ".shopCard", [
                            z('div#image' + i.id + ".imgBox", [
                                z('a[href=#' + i.id + ']', [z('img.' + i.id + "[src=" + i.photo.photo.medium.url + "]")])
                            ]),
                            z('div#' + i.id + ".shopDeets", [
                                z('div.shopInfo', [
                                    z('a[href=#' + i.id + ']', [z('div.shop_name', i.name)]),
                                    z('br', {
                                        key: 1
                                    }),
                                    z('div.rating', [
                                        z('span.stars', rating)
                                        //z('i.fa.fa-star', ")"), //will need to draw start based on rating
                                    ]),
                                    z('br', {
                                        key: 2
                                    }),
                                    z('a.website' + '[href=' + i.website + ']', i.website)
                                ]),
                                z('div.shopContact', [
                                    z('address', [i.address, z('br'), i.city + " " + i.state + " " + i.zip]),
                                    z('span.phoneNo', i.phone)
                                ])
                            ]),
                            z('div.shopSummary', [
                                z('i.fa.fa-comments.fa-lg'),
                                z('div.summaryText', i.description)
                            ])
                        ])
                    })
                ])
            ])
        }
    });

    Backbone.DetailView = React.createClass({
        getInitialState: function() {
            return {}
        },
        getDefaultProps: function() {
            return {
                collection: null
            };
        },
        componentWillMount: function() { //what happens when the object is attached to the dom similar to initialize
            var self = this;
            this.props.collection && this.props.collection.on("change reset add remove", function() {
                self.forceUpdate() //setup listener and then force update on collection change
            })
        },
        componentWillUnmount: function() {
            this.props.collection && this.props.collection.off("change reset add remove")
        },
        _addComment: function(e) {
            e.preventDefault();
            // debugger;
            console.log(this.props)
            var comment = this.refs.addComment.getDOMNode().value;
            var data = {
                message: comment
            }

            var self = this;
            this.props.collection.create(data)

        },
        render: function() {

            var shop = this.props.shop.get('shop');
            var stars = new Array(Math.clamp(shop.average_rating, 0, 5)).join(',').split(',').map(function(v, i) {
                    return z('i.fa.fa-coffee', {
                        key: Math.random()
                    })
                }),
                nonstars = (5 - stars.length) ? new Array(5 - stars.length).join(',').split(',').map(function(v, i) {
                    return z('i.fa.fa-coffee.empty-star', {
                        key: Math.random()
                    })
                }) : [],
                rating = stars.concat(nonstars)

            //props has collection of models at this point
            //HOW DO SHOP DETAILS GET PASSED INTO HERE?
            return z('div.wrapper', [
                z(Backbone.HeaderComponent),

                z('div.main', [
                    z('div.spacer', ''),
                    z('div.details-box', [
                        z('div.shopCard', [
                            z('div#image' + shop.id + ".imgBox", [
                                z('img.' + shop.id + "[src=" + shop.photo.photo.medium.url + "]")
                            ]),
                            z('div#' + shop.id + ".shopDeets", [
                                z('div.shopInfo', [
                                    z('a', [z('div.shop_name', shop.name)]),
                                    z('br', {
                                        key: 1
                                    }),
                                    z('div.rating', [
                                        z('span.stars', rating)
                                        //z('i.fa.fa-star', ")"), //will need to draw start based on rating
                                    ]),
                                    z('br', {
                                        key: 2
                                    }),
                                    z('a.website' + '[href=' + shop.website + ']', shop.website)
                                ]),
                                z('div.shopContact', [
                                	z('img'),
                                    z('address', [shop.address, z('br'), shop.city + " " + shop.state + " " + shop.zip]),
                                    z('span.phoneNo', shop.phone)
                                ])
                            ]),
                            z('div.shopSummary', [
                                z('i.fa.fa-comments.fa-lg'),
                                z('div.summaryText', shop.description)
                            ])

                        ]),
                    ]),

                    z('form.comment-box', {
                        onSubmit: this._addComment
                    }, [
                        z('textarea.userComment@addComment[placeholder=add a new comment]'),
                        z('button', 'submit!'),
                        z('ol', [
                            this.props.collection.map(function(i) {
                                return z('li#' + i.id, [
                                    z('div.info-container', [
                                        z('div.shop_name', i.get('message'))
                                    ])
                                ])
                            })
                        ])
                    ])
                ])
            ])
        }
    });


})(typeof module === 'object' ? module.exports : window)
