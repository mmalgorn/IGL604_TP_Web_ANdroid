'use strict';

/**
* @ngdoc service
* @name tennisAppApp.serviceAjax
* @description
* # serviceAjax
* Factory in the tennisAppApp.
*/
angular.module('tennisAppApp')
.factory('serviceAjax', function serviceAjax($http,$q,Notification) {
  return{
    match: function(){
      var deferred = $q.defer();

      var data = $http.get("http://localhost:3000/listeMatchs");
      deferred.resolve(data);
      return deferred.promise;
    },
    pari : function(send){
      var deferred = $q.defer();
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/PriseParis',
        data:  send


    };


  return $http(req).then(function(data){
      console.log(data);
        deferred.resolve(data);
        return data.data;
    });

  },
    sendid : function(send){
      var deferred = $q.defer();
      var req = {
        method: 'POST',
        url : 'http://localhost:3000/GainRecu',
        data : send
      };
      var data = $http(req);
      deferred.resolve(data);
      return deferred.promise;
    },
    connexionGains : function(send){
      var deferred = $q.defer();
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/Connexion',
        data:  send
      };
      console.log("Data : "+req.data);
      var data = $http(req);
            deferred.resolve(data);
            return deferred.promise;
      }
  };
});
