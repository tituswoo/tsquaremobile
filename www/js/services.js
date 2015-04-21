/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', '$q', function ($http, $q) {

    var factory = {};
    var data = [];

    factory.setRawData = function(newData) {
        data = newData;
    };

    factory.getRawData = function () {
        return $q(function (resolve, reject) {
            var interval = setInterval(function () {
                if (data.length != 0) {
                    clearInterval(interval);
                    resolve(data);
                }/* else {

                    $http.get('js/dsquared.json')
                        .success(function (d) {
                            data = d;
                            resolve(d);
                        })
                        .error(function(data, status) {
                            reject(status);
                        });
                }*/
            }, 500);
        });
    };

    factory.getDebugRawData = function () {
        return $q(function (resolve, reject) {
            $http.get('js/dsquared.json')
                .success(function (d) {
                    data = d;
                    resolve(d);
                })
                .error(function(data, status) {
                    reject(status);
                });
        });
    };

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
            } else {
                // @todo: error?
            }
        }

        return deferred.promise;
    };

    factory.getSpecificAnnouncement = function(uuid) {
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

    factory.getAnnouncements = function (uuid) {
        var deferred = $q.defer();

        factory.getRawData().then(retrieve);

        function retrieve(data) {
            if (uuid != undefined) {
                var announcements = [];
                data.map(function (c) {
                    if (c.uuid === uuid) {
                        announcements = c.announcements;
                        for (var j = 0; j < announcements.length; j++) {
                            var announceData = announcements[j];
                            announceData["classTitle"] = c.title;
                        }

                        deferred.resolve(announcements);
                    }
                });
            } else {
                // return all announcements
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

    factory.getSpecificAssignment = function(uuid) {

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
                            /**
                            var assignData = assignments[j];
                            var dueMoment = moment.unix(assignData.dueDate);
                            assignData["classTitle"] = c.title;
                            assignData["relativeDueDate"] = dueMoment.fromNow();
                            assignData["daysFromNow"] = dueMoment.diff(moment(), 'days');
                             **/
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
                        /**
                        var assignData = assignments[j];
                        var dueMoment = moment.unix(assignData.dueDate);
                        assignData["classTitle"] = item.title;
                        assignData["relativeDueDate"] = dueMoment.fromNow();
                        assignData["daysFromNow"] = dueMoment.diff(moment(), 'days');
                         **/
                    }
                    allAssignments = allAssignments.concat(assignments);
                });
                deferred.resolve(allAssignments)
            }
        }

        return deferred.promise;
    };

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
                }
                else
                {
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

    factory.processAssignment = function (assignData, class_title) {
        var dueMoment = moment.unix(assignData.dueDate);
        assignData["classTitle"] = class_title;
        assignData["relativeDueDate"] = dueMoment.fromNow();
        var days_from_now = dueMoment.diff(moment(), 'days');
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
