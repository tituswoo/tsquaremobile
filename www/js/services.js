/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', function ($http) {

    var factory = {};
    var tsquared = {};

    factory.getRawData = function () {
        return $http.get('js/dsquared.json');
    };

    // eventually we'll make better getters and setters for things.
    // right now just return everything...

    return factory;
}]);