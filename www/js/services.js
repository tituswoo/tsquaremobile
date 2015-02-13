/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', function ($http) {

    var factory = {};
    var data = [];

    (function () {
        $http.get('js/dsquared.json').success(function(raw_data) {
            data = raw_data;
        });
    })();

    factory.getRawData = function () {
        return data;
    };

    // eventually we'll make better getters and setters for things.
    // right now just return everything...

    return factory;
}]);