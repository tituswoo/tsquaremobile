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
    .controller('AnnouncementsCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        // just as a test
        TSquare.getAnnouncements($stateParams.uuid).then(function (data) {
            $scope.announcements = data;
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
    }]);
