// Ionic Starter App
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-datepicker'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.announcement', {
                url: "/announcement/:uuid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/announcement.html",
                        controller: 'AnnouncementCtrl'
                    }
                }
            })

            .state('app.announcements', {
                url: "/announcements/:uuid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/announcements.html",
                        controller: 'AnnouncementsCtrl'
                    }
                }
            })

            .state('app.allAnnouncements', {
                url: "/allAnnouncements",
                views: {
                    'menuContent': {
                        templateUrl: "templates/announcements.html",
                        controller: 'AnnouncementsCtrl'
                    }
                }
            })

            .state('app.assignment', {
                url: "/assignment/:uuid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/assignment.html",
                        controller: 'AssignmentCtrl'
                    }
                }
            })

            .state('app.assignments', {
                url: "/assignments/:uuid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/assignments.html",
                        controller: 'AssignmentsCtrl'
                    }
                }
            })

            .state('app.dashboard', {
                url: "/dashboard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/dashboard.html",
                        controller: 'DashboardCtrl'
                    }
                }
            })

            .state('app.classes', {
                url: "/classes",
                views: {
                    'menuContent': {
                        templateUrl: "templates/classes.html",
                        controller: 'ClassesCtrl'
                    }
                }
            })

            .state('app.class', {
                url: "/class/:uuid",
                views: {
                    'menuContent': {
                        templateUrl: "templates/class.html",
                        controller: "ClassCtrl"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/dashboard');
    });

