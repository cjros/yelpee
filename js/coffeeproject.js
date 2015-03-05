;
(function(exports) {
    'use strict';

    Backbone.CSRouter = Backbone.Router.extend({
        initialize: function() {
            this.container = document.querySelector('.container');

            Backbone.history.start();
        },
        routes: {
            ':id': 'shopper',
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
        shopper: function(id){
            // debugger;
            var self = this;
            this.commentsCollection = new Backbone.CoffeeShopCommentList({ shop_id: id});
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
            //CHRIS' CODE FROM THE LAST PULL, this one line below is what i 'updated'
            return "http://coffeesnob-api.herokuapp.com/api/shops/" + this.shop_id + "/comments/"
            ///END OF CHRIS' SECTION

            ////////////////@Michael's CODE FROM LAST PULL
        	//debugger;
            //return "http://coffeesnob-api.herokuapp.com/api/shops/" + this.get("shop_id") + "/comments"
            //},
            //defaults: {
            //message: "No Comment."
            ////////////////END OF SECTION

        }
    });
    /* comments collection */
    Backbone.CoffeeShopCommentList = Backbone.Collection.extend({
        model: Backbone.CoffeeShopComment,
        url: function() {
            return 'http://coffeesnob-api.herokuapp.com/api/shops/' + this.shop_id + '/comments/'
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
            console.log(this.props.collection.models)
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
                        console.log(i.name);
                        	return z('a[href=#'+i.id+']', [
                                z('li#' + i.id+".shops", [
                        		z('img.'+i.id+'[src=./images/catalina-coffee.jpg]'),
                        		z('div.info-container', [
                        			z('div.shop_name', i.name),
                        			z('div.rating', [
                        				z('span.stars', "4"),
                        				z('i.fa.fa-star')
                        			]),
                        			z('pre.address', 'Address:\n2201 Washington Ave\nHouston, TX 77007\nUnited States')
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
            this.props.collection && this.props.collection.on("change reset add remove sync", function() {
                self.forceUpdate() //setup listener and then force update on collection change
            })
        },
        componentWillUnmount: function() {
            this.props.collection && this.props.collection.off("change reset add remove")
        },
        _addComment: function(e){
            e.preventDefault();
            debugger;
            var comment = this.refs.addComment.getDOMNode().value;
            //the one line below this comment shouldn't be needed; was used for testing hardcode data;
            //routing should be taking
            //care of the shop_id when a shop model is clicked for comments with
            //the corresponding id in the first place...
            var shopId = this.props.collection.models[0].attributes.comments[0].shop_id
            var data = {
                shop_id: shopId,
                message: comment
            }
            var newComment = new Backbone.CoffeeShopComment(data)
            var self = this;
            newComment.save().then(function(){
                //WHY ISNT THIS SHIT RE-RENDERING?
                //comment actually gets added but dev tools shows an error
                //must manually refresh for the comment to even show

                //EDIT: SHIT ISNT EVEN POSTING ANYMORE
                self.props.collection.fetch()
            })
        },
        render: function() {
            console.log(this.props.collection)
            return z('div.wrapper', [
                z('div.main', [
                    z('div.shop-details', 'INFO goes here'),
                    z('div.map', 'a map should be here'),
                    z('form.comment-box', {onSubmit: this._addComment}, [
                        z('input:text@addComment[placeholder=add a new comment]'),
                        z('button', 'submit!')
                    ]),
                    z('ol', [
                    this.props.collection.models[0].attributes.comments.map(function(i) {
                        console.log(i);
                            return z('li#' + i.id, [
                                z('div.info-container', [
                                    z('div.shop_name', i.message)
                                ])
                            ])
                        
                    })])]
                )
            ])
        }
    });


})(typeof module === 'object' ? module.exports : window)
