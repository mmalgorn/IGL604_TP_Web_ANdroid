'use strict';

/**
 * @ngdoc service
 * @name tennisAppApp.socket
 * @description
 * # socket
 * Factory in the tennisAppApp.
 */
angular.module('tennisAppApp')
.
factory('socket', function (socketFactory) {
  var socket = socketFactory();
      socket.forward('broadcast');
      return socket;
  });
