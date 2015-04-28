angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', '$q', function ($http, $q) {

    var factory = {};
    var data = [];

    // After T-Square login, the JSON data is stored using this method
    factory.setRawData = function (newData) {
        data = newData;
    };

    // A getter method for the stored T-Square data
    factory.getRawData = function () {
        return $q(function (resolve, reject) {
            var interval = setInterval(function () {
                if (data.length != 0) {
                    clearInterval(interval);
                    resolve(data);
                }
            }, 500);
        });
    };

    // A debug method for fetching mock T-Square data
    factory.getDebugRawData = function () {
        return $q(function (resolve, reject) {
            $http.get('js/dsquared.json')
                .success(function (d) {
                    data = d;
                    resolve(d);
                })
                .error(function (data, status) {
                    reject(status);
                });
        });
    };

    // A getter method for classes
    factory.getClasses = function () {
        var classes = [];
        return $q(function (resolve, reject) {
            factory.getRawData().then(function (data) {
                data.map(function (c) {
                    classes.push(c.title);
                });
                resolve(data);
            }).catch(function (data, status) {
                reject(status);
            });
        });
    };

    // A getter method for individual class data
    factory.getClass = function (uuid) {
        var deferred = $q.defer();
        factory.getRawData().then(retrieve);
        function retrieve(data) {
            if (uuid != undefined) {
                data.map(function (c) {
                    if (c.uuid === uuid) {
                        deferred.resolve(c);
                    }
                });
            }
        }

        return deferred.promise;
    };

    // A getter method for individual announcement data
    factory.getSpecificAnnouncement = function (uuid) {
        var announcement = [];
        return $q(function (resolve, reject) {
            factory.getAnnouncements().then(function (data) {
                data.map(function (a) {
                    if (a.uuid == uuid) {
                        announcement = a;
                    }
                });
                resolve(announcement);
            }).catch(function (data, status) {
                reject(status);
            });
        });
    };

    // A getter method for announcements
    factory.getAnnouncements = function (uuid) {
        var deferred = $q.defer();
        factory.getRawData().then(retrieve);
        function retrieve(data) {
            if (uuid != undefined) {
                // return announcements from one class
                var announcements = [];
                data.map(function (c) {
                    if (c.uuid === uuid) {
                        announcements = c.announcements;
                        for (var j = 0; j < announcements.length; j++) {
                            var announceData = announcements[j];
                            announceData["classTitle"] = "";
                        }
                        deferred.resolve(announcements);
                    }
                });
            } else {
                // return announcements from all classes
                var allAnnouncements = [];
                data.map(function (item) {
                    var announcements = item.announcements;
                    for (var j = 0; j < announcements.length; j++) {
                        var announceData = announcements[j];
                        announceData["classTitle"] = item.title;
                        allAnnouncements.push(announcements[j]);
                    }
                });
                deferred.resolve(allAnnouncements);
            }
        }

        return deferred.promise;
    };

    // A getter method for individual assignment
    factory.getSpecificAssignment = function (uuid) {
        var assignment = [];
        return $q(function (resolve, reject) {
            factory.getAssignments().then(function (data) {
                data.map(function (a) {
                    if (a.uuid == uuid) {
                        assignment = a;
                    }
                });
                resolve(assignment);
            }).catch(function (data, status) {
                reject(status);
            });
        });
    };

    // A getter method for assignments from one class
    factory.getAssignments = function (uuid) {
        var deferred = $q.defer();
        factory.getRawData().then(retrieve);
        function retrieve(data) {
            if (uuid != undefined) {
                var assignments = [];
                data.map(function (c) {
                    if (c.uuid === uuid) {
                        assignments = c.assignments;
                        for (var j = 0; j < assignments.length; j++) {
                            assignments[j] = factory.processAssignment(assignments[j], c.title);
                        }
                        deferred.resolve(assignments);
                    }
                });
            } else {
                // return all assignments
                var allAssignments = [];
                data.map(function (c) {
                    var assignments = c.assignments;
                    for (var j = 0; j < assignments.length; j++) {
                        assignments[j] = factory.processAssignment(assignments[j], c.title);
                    }
                    allAssignments = allAssignments.concat(assignments);
                });
                deferred.resolve(allAssignments)
            }
        }

        return deferred.promise;
    };

    // A getter method for upcoming assignments
    factory.getAllPendingAssignments = function () {
        var deferred = $q.defer();
        factory.getAssignments().then(retrieve);
        function retrieve(data) {
            var structured_data = {};
            var have_pending_assignments = false;
            data.forEach(function (assignment) {
                if (structured_data.hasOwnProperty(assignment.classTitle)) {
                    if (assignment.pending) {
                        structured_data[assignment.classTitle].push(assignment);
                        have_pending_assignments = true;
                    }
                } else {
                    structured_data[assignment.classTitle] = [];
                    if (assignment.pending) {
                        structured_data[assignment.classTitle].push(assignment);
                        have_pending_assignments = true;
                    }
                }
            });
            deferred.resolve({
                pending_assignments: structured_data,
                have_pending_assignments: have_pending_assignments
            });
        }

        return deferred.promise;
    };

    // Determines the priority of assignment based on due date
    factory.processAssignment = function (assignData, class_title) {
        var dueMoment = moment.unix(assignData.dueDate);
        assignData["classTitle"] = class_title;
        //assignData["relativeDueDate"] = dueMoment.fromNow();
        assignData["relativeDueDate"] = dueMoment.from("2015-03-27");
        var days_from_now = dueMoment.diff(moment(), 'days')+31;
        assignData["daysFromNow"] = days_from_now;
        assignData["pending"] = (days_from_now >= 0);

        // Assign badge class
        var badge_class = 'badge badge-stable';
        if (days_from_now >= 7) {
            badge_class = 'badge badge-balanced';
        }
        else if (days_from_now >= 3) {
            badge_class = 'badge badge-energized';
        }
        else if (days_from_now >= 0) {
            badge_class = 'badge badge-assertive';
        }
        assignData["badgeClass"] = badge_class;

        return assignData;
    };

    // A getter method for classes
    factory.getCourses = function () {
        var classes = [];
        return $q(function (resolve, reject) {
            factory.getRawData().then(function (data) {
                data.map(function (course) {
                    classes.push({
                        uuid: course.uuid,
                        title: course.title
                    });
                });
                resolve(classes);
            });
        });
    };

    return factory;
}]);
