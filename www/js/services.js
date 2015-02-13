/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', function ($http) {

    var factory = {};
    var data = [];

    (function () {

        // TODO: debug
        console.log('called');

        $http.get('js/dsquared.json').success(function(raw_data) {

            // TODO: debug
            console.log('called back');

            data = raw_data;
        });
    })();

    factory.getRawData = function () {
        return data;
    };

    factory.getClasses = function () {
        return data;
    };

    factory.getAnnouncements = function() {
        // TODO: uuid or id?
        var uuid = arguments[0];
        var announcements = [];

        // return all announcements regardless of class
        if (uuid === undefined) {
            data.forEach(function(element) {
                announcements = announcements.concat(element.announcements);
            })
        }

        // return all announcements for the class with passed-in uuid
        else
        {
            // search for the class with passed-in uuid
            var class_with_uuid = data.filter(function(element) {
                return element.uuid === uuid;
            });

            if (class_with_uuid.length === 1) {
                announcements = class_with_uuid[0].announcements;
            }
            else
            {
                console.log('oops, two classes with same uuid?');
            }
        }

        return announcements;
    };

    // eventually we'll make better getters and setters for things.
    // right now just return everything...

    return factory;
}]);