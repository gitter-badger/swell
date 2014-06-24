'use strict';
define(['app', 'challenge_show_view', 'challenge_activity_view', 'challenge_entity', 'activity_entity', 'resource_entity'], function(App, View, ActivityView) {
    App.module('Challenge.Show', function (Show, App, Backbone, Marionette, $) { // , _
        Show.Controller = {
            show: function(id) {
                var fetchingChallenge = App.request('challenge:entity', id);
                $.when(fetchingChallenge).done(function(challenge) {

                    Show.Controller.layout = new View.Layout({
                        challenge: challenge.get('desc')
                    });

                    // ---- Make awesome slider region: ----
                    var PageRegion = Backbone.Marionette.Region.extend({
                        el: '#show_page',
                    });
                    PageRegion.prototype.open = function(view) {
                        this.$el.hide();
                        this.$el.html(view.el);
                        this.$el.slideDown('slow');
                    };
                    Show.Controller.layout.pageRegion = new PageRegion();
                    App.mainRegion.show(Show.Controller.layout);
                    // ---- End awesome slider region ----

                    // make the custom menu for this challenge
                    var menu = new View.ChallengeMenu({

                    });
                    Show.Controller.layout.menuRegion.show(menu);

                    // NOTE: without a model, you do not need itemview on the watch string
                    menu.on('menu:clicked', function(item) {
                        // show the view selected by the menu
                        Show.Controller.layout.pageRegion.show(showViews[item]);
                    });


                    // make a list of all the views
                    var showViews = [];


                    // set back button
                    App.execute('set:back', {
                        route: 'domain/' + challenge.get('domain') + '/challenges',
                        page: 'Challenges'
                    });

                    $.when(App.request('activity:entity', challenge.get('activity'))).done(function(activity) {
                        // var type = activity.get('type');
                        // var ucType = type.charAt(0).toUpperCase() + type.slice(1);
                        if (activity.get('type') === 'sortable') {
                            showViews.activities = new ActivityView.Sortable({
                                model: activity,
                            });
                        } else {
                            showViews.activities = new ActivityView.Draggable({
                                model: activity,
                            });
                        }

                        Show.Controller.layout.pageRegion.show(showViews.activities);
                    });

                    // prepare resources
                    $.when(App.request('resource:entities', challenge.get('resources'))).done(function(resources) {
console.log(resources);
                        showViews.resources = new View.Resources({
                            resources: resources
                        });
                    });

                    showViews.stuff = new View.Stuff({
                    });

                });

            },

        };
    });
    return App.Challenge.Show.Controller;
});