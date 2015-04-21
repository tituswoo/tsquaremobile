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
            data.map(function (item) {
                var daysFromNow = item.daysFromNow;
                if (daysFromNow >= 7) {
                    item['badgeClass'] = 'badge badge-balanced';
                }
                else if (daysFromNow >= 3) {
                    item['badgeClass'] = 'badge badge-energized';
                }
                else if (daysFromNow >= 0) {
                    item['badgeClass'] = 'badge badge-assertive';
                }
                else {
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
        // TODO: change to get real data
        TSquare.getDebugRawData().then(function (data) {
            console.log(data);

            $scope.data = data;

            // If the user has valid data?
            $scope.not_logged_in = ($scope.data.length === 0);
        });
    }]);
