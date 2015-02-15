/**
 * Created by tituswoo on 2/9/15.
 */

angular.module('starter.services', []);

angular.module('starter.services').factory('TSquare', ['$http', function ($http) {

    var factory = {};
    var classes = [];

    $http.get('js/dsquared.json').success(function (data) {
        data.map(function (item) {
            classes.push(item);
        });
    });

    var allAnnouncements = [];
    $http.get('js/dsquared.json').success(function (data) {
        data.map(function (item) {
            var announcements = item.announcements;
            for (var j = 0; j < announcements.length; j++) {
                var announceData = announcements[j];
                announceData["classTitle"] = item.title;
                allAnnouncements.push(announcements[j]);
            }
        });
    });

    return {
        classes : classes,
        announcements : allAnnouncements,
        getAnnouncement: function(uuid) {
            var announcement = [];
            allAnnouncements.map(function (a) {
                if (a.uuid == uuid) {
                    announcement = a;
                }
            })
            return announcement;
        }
    };
}]);