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

    factory.getAnnouncements = function (uuid) {
        var deferred = $q.defer();

        factory.getRawData().then(retrieve);

        function retrieve(data) {
            if (uuid != undefined) {
                var announcements = [];
                data.map(function (c) {
                    if (c.uuid === uuid) {
                        announcements = c.announcements;
                        deferred.resolve(announcements);
                    }
                });
            } else {
                // @todo: return all announcements
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
