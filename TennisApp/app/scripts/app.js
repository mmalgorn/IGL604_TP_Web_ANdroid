'use strict';

/**
 * @ngdoc overview
 * @name tennisAppApp
 * @description
 * # tennisAppApp
 *
 * Main module of the application.
 */
angular
  .module('tennisAppApp', ['ngRoute',
    'angular-web-notification',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui-notification'])
  .value('nickName', 'anonymous')
  .value('messageFormatter', function(date, nick, message) {
    return date.toLocaleTimeString() + ' - ' +
           nick + ' - ' +
           message + '\n';
  })
  .config(function ($routeProvider) {
  $routeProvider
    .when('/match', {
      templateUrl: 'views/match.html',
      controller: 'MatchCtrl'
    })
    .when('/matchU', {
      templateUrl: 'views/matchu.html',
      controller: 'MatchuCtrl',
      controllerAs: 'matchU'
    })
    .otherwise({
      redirectTo: '/match'
    });
})
.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);
