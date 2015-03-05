;
(function(exports) {
    'use strict';

    Backbone.CSRouter = Backbone.Router.extend({
        initialize: function() {
            this.container = document.querySelector('.container');

            Backbone.history.start();
        },
        routes: {
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
        shopper: function(shop_id){
            var self = this;
            this.commentsCollection = new Backbone.CoffeeShopCommentList();
            this.commentsCollection.shop_id = shop_id;
            this.detailPage = z(Backbone.DetailView, {collection: this.commentsCollection})

            this.commentsCollection.fetch().then(function(data){
                // debugger;
                React.render(self.detailPage, self.container)
            })
        }
    });

    Backbone.CoffeeShop = Backbone.Model.extend({
        // url: function() {
        //     return "http://coffeesnob-api.herokuapp.com/api/shops/" //+ 1
        // }
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
            return ' http://coffeesnob-api.herokuapp.com/api/shops/'+this.collection.shop_id+'/comments/'
        }
    });
    /* comments collection */
    Backbone.CoffeeShopCommentList = Backbone.Collection.extend({
        model: Backbone.CoffeeShopComment,
        url: function() {
            return 'http://coffeesnob-api.herokuapp.com/api/shops/'+this.shop_id+'/comments/'
        },
        parse: function(data){
            return data.comments;
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
                z('div.main', [z('ol', [
                    this.props.collection.models[0].attributes.shops.map(function(i) {
                        // console.log(i.name);
                        	return z('a[href=#'+i.id+']', [
                                z('li#' + i.id+".shops", [
                        		z('img.'+i.id+(i.photo.photo.medium.url ? '[src='+i.photo.photo.medium.url+']' : '[alt='+i.name+']')),
                        		z('div.info-container', [
                        			z('div.shop_name', i.name),
                        			z('div.rating', [
                        				z('span.stars', i.rating),
                        				z('i.fa.fa-star')
                        			]),
                                    z('div.hours', 'Business Hours:' + i.hours),
                                    z('div.website', i.website),
                                    z('div.shop-desc', i.description),
                        			z('pre.address', 'Address:\n'+ i.address + "\n" + i.city + "\n" + i.state + "\n" + i.zip)
                        		])
                        	])
                        ])
                    })])]
                )
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
        // componentWillUnmount: function() {
        //     this.props.collection && this.props.collection.off("change reset add remove")
        // },
        _addComment: function(e){
            e.preventDefault();
            // debugger;
            console.log(this.props)
            var comment = this.refs.addComment.getDOMNode().value;
            var data = {
                message: comment
            }

            var self = this;
            this.props.collection.create(data)
        


            // var newComment = new Backbone.CoffeeShopComment(data)

            // var self = this;
            // newComment.save().then(function(){
            //     //WHY ISNT THIS SHIT RE-RENDERING?
            //     //comment actually gets added but dev tools shows an error
            //     //must manually refresh for the comment to even show

            //     //EDIT: SHIT ISNT EVEN POSTING ANYMORE
            //     self.props.collection.fetch()
            // })
        },
        render: function() {
            return z('div.wrapper', [
                z('div.main', [
                    z('div.shop-details', 'INFO goes here'),
                    z('div.map', 'a map should be here'),
                    z('form.comment-box', {
                        onSubmit: this._addComment
                    }, [
                        z('input:text@addComment[placeholder=add a new comment]'),
                        z('button', 'submit!')
                    ]),
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

        }
    });


})(typeof module === 'object' ? module.exports : window)
