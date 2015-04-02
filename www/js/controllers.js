angular.module('starter.controllers', ['starter.services'])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })
    .controller('AnnouncementCtrl', ['$scope', '$stateParams', '$ionicModal', 'TSquare', function ($scope, $stateParams, $ionicModal, TSquare) {
        TSquare.getSpecificAnnouncement($stateParams.uuid).then(function (data) {
            $scope.announcement = data;
            $scope.postDate = moment.unix($scope.announcement.postDate).format("MM/DD/YYYY");
        }).catch(function (err) {
            console.log(err);
        });

        TSquare.getCourses().then(function (data) {
            $scope.courses = data;
        });

        $ionicModal.fromTemplateUrl('templates/addToCalendar.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.addEvent = function () {
            $scope.modal.hide();
        };

        $scope.close = function () {
            $scope.modal.hide();
        };

        $scope.addToCalendar = function () {
            var date = chrono.parseDate($scope.announcement.details) || new Date();

            console.log($scope.announcement);
            $scope.event = {
                title: $scope.announcement.title,
                details: $scope.announcement.details,
                date: date,
                course: ''
            };
            $scope.modal.show();
        };
    }])
    .controller('AnnouncementsCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getAnnouncements($stateParams.uuid).then(function (data) {
            $scope.announcements = data;
            $scope.orderPredicate = '-lastUpdate';
        }).catch(function (err) {
            console.log(err);
        });

    }])
    .controller('AssignmentCtrl', ['$scope', '$stateParams','TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getSpecificAssignment($stateParams.uuid).then(function (data) {
            $scope.assignment = data;
            $scope.dueDate = moment.unix($scope.assignment.dueDate).format("MM/DD/YYYY");
        }).catch(function (err) {
            console.log(err);
        });
    }])
    .controller('AssignmentsCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getAssignments($stateParams.uuid).then(function (data) {
            data.map(function (item) {
                var daysFromNow = item.daysFromNow;
                if (daysFromNow >= 7) {
                    item['badgeClass'] = 'badge badge-balanced';
                }
                else if (daysFromNow >= 3)
                {
                    item['badgeClass'] = 'badge badge-energized';
                }
                else if (daysFromNow >= 0)
                {
                    item['badgeClass'] = 'badge badge-assertive';
                }
                else
                {
                    item['badgeClass'] = 'badge badge-stable';
                }
                return item;
            });
            $scope.assignments = data;
            $scope.orderPredicate = 'dueDate';
        }).catch(function (err) {
            console.log(err);
        });

    }])
    .controller('ClassesCtrl', ['$scope', 'TSquare', function ($scope, TSquare) {
        TSquare.getClasses().then(function (data) {
            $scope.classes= data;
        }).catch(function (err) {
            console.log(err);
        });
    }])
    .controller('ClassCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getClass($stateParams.uuid).then(function (data) {
            $scope.class = data;
        }).catch(function (err) {
            console.log(err);
        });
    }])
    .controller('AddToCalendarCtrl', ['$scope', '$stateParams', '$ionicPopover', 'TSquare', function ($scope, $stateParams, $ionicPopover, TSquare) {

    }]);
