angular.module('starter.controllers', ['starter.services'])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, TSquare) {
        // Perform login through Eric's API in InAppBrowser and store TSquare data
        $scope.login = function () {
            var win = window.open('https://tuchanka.nimbus.cip.gatech.edu/ClassTime/public/courses/all?deviceKey=12345', '_blank');
            win.executeScript(
                {code: 'var a=document.querySelector("pre"),interval=setInterval(function(){a.innerHTML&&(clearInterval(interval),localStorage.setItem("TSquareData",a.innerHTML))},300);'});
            win.addEventListener("loadstop", function () {
                win.addEventListener("loadstart", function () {
                    win.addEventListener("loadstop", function () {
                        var loop = setTimeout(function () {
                            win.executeScript(
                                {code: 'localStorage.getItem("TSquareData")'},
                                function (values) {
                                    var data = values[0];
                                    if (data) {
                                        TSquare.setRawData(JSON.parse(data));
                                        win.close();
                                    }
                                }
                            );
                        }, 20);
                        win.removeEventListener("loadstart");
                    });
                });
            });
        };
    })
    .controller('AnnouncementCtrl', ['$scope', '$stateParams', '$ionicModal', 'TSquare', function ($scope, $stateParams, $ionicModal, TSquare) {
        // Retrieve specific announcement data
        TSquare.getSpecificAnnouncement($stateParams.uuid).then(function (data) {
            $scope.announcement = data;
            $scope.postDate = moment.unix($scope.announcement.postDate).format("MM/DD/YYYY");
        }).catch(function (err) {
            console.log(err);
        });
        // Retrieve all classes' data
        TSquare.getCourses().then(function (data) {
            $scope.courses = data;
        });
        // Switch scope to the calendar modal
        $ionicModal.fromTemplateUrl('templates/addToCalendar.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        // Hide calendar after adding event
        $scope.addEvent = function () {
            $scope.modal.hide();
        };
        // Close the calendar modal
        $scope.close = function () {
            $scope.modal.hide();
        };
        // Open up the calendar modal
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
            $scope.orderPredicate = '-postDate';
        }).catch(function (err) {
            console.log(err);
        });

    }])
    .controller('AssignmentCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getSpecificAssignment($stateParams.uuid).then(function (data) {
            $scope.assignment = data;
            $scope.dueDate = moment.unix($scope.assignment.dueDate).format("MM/DD/YYYY");
        }).catch(function (err) {
            console.log(err);
        });
    }])
    .controller('AssignmentsCtrl', ['$scope', '$stateParams', 'TSquare', function ($scope, $stateParams, TSquare) {
        TSquare.getAssignments($stateParams.uuid).then(function (data) {
            $scope.assignments = data;
            $scope.orderPredicate = '-dueDate';
        }).catch(function (err) {
            console.log(err);
        });

    }])
    .controller('ClassesCtrl', ['$scope', 'TSquare', function ($scope, TSquare) {
        TSquare.getClasses().then(function (data) {
            $scope.classes = data;
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
    }])
    .controller('DashboardCtrl', ['$scope', 'TSquare', function ($scope, TSquare) {
        TSquare.getRawData().then(function (d) {
            TSquare.getAllPendingAssignments().then(function (data) {
                $scope.logged_in = (Object.keys(data.pending_assignments).length !== 0);
                $scope.have_pending_assignments = data.have_pending_assignments;
                $scope.data = data.pending_assignments;
                $scope.orderPredicate = '-dueDate';
            })
        });
    }]);
