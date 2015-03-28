/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', '$q', function ($http, $q) {

    var factory = {};
    var data = [];

    factory.getRawData = function () {
        return $q(function (resolve, reject) {
            if (data.length != 0) {
                resolve(data);
            } else {
                $http.get('js/dsquared.json')
                    .success(function (d) {
                        data = d;
                        resolve(d);
                    })
                    .error(function(data, status) {
                        reject(status);
                    });
            }
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
                            var assignData = assignments[j];
                            var dueMoment = moment.unix(assignData.dueDate);
                            assignData["classTitle"] = c.title;
                            assignData["relativeDueDate"] = dueMoment.fromNow();
                            assignData["daysFromNow"] = dueMoment.diff(moment(), 'days');
                        }
                        deferred.resolve(assignments);
                    }
                });
            } else {
                // return all assignments
                var allAssignments = [];
                data.map(function (item) {
                    var assignments = item.assignments;
                    for (var j = 0; j < assignments.length; j++) {
                        var assignData = assignments[j];
                        var dueMoment = moment.unix(assignData.dueDate);
                        assignData["classTitle"] = item.title;
                        assignData["relativeDueDate"] = dueMoment.fromNow();
                        assignData["daysFromNow"] = dueMoment.diff(moment(), 'days');
                    }
                });
                deferred.resolve(allAssignments)
            }
        }

        return deferred.promise;

    };

    return factory;
}]);
