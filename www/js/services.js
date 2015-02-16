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
    /*
    factory.getAllAnnouncements = function() {
        var allAnnouncements = [];

        return $q(function (resolve, reject) {
            factory.getRawData().then(function (data) {
                data.map(function (item) {
                    var announcements = item.announcements;
                    for (var j = 0; j < announcements.length; j++) {
                        var announceData = announcements[j];
                        announceData["classTitle"] = item.title;
                        allAnnouncements.push(announcements[j]);
                    }
                });
                resolve(data);
            }).catch(function (data, status) {
                reject(status);
            });
        });
    }
    */

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
    }

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

        /*var uuid = arguments[0];
         var announcements = [];

         // return all announcements regardless of class
         if (uuid === undefined) {
         data.forEach(function (element) {
         announcements = announcements.concat(element.announcements);
         })
         }

         // return all announcements for the class with passed-in uuid
         else {
         // search for the class with passed-in uuid
         var class_with_uuid = data.filter(function (element) {
         return element.uuid === uuid;
         });

         if (class_with_uuid.length === 1) {
         announcements = class_with_uuid[0].announcements;
         }
         else {
         console.log('oops, two classes with same uuid?');
         }
         }

         return announcements;
         };

         // eventually we'll make better getters and setters for things.
         // right now just return everything...
         */
    };

    return factory;
}]);
