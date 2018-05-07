'use strict';

/**
 * @ngdoc function
 * @name tennisAppApp.controller:MatchuCtrl
 * @description
 * # MatchuCtrl
 * Controller of the tennisAppApp
 */
angular.module('tennisAppApp')
  .controller('MatchuCtrl', function ($location,$scope,$rootScope,$cookies,serviceAjax,Notification) {
    console.log($rootScope.match);

  if(angular.isDefined($rootScope.match)){
    $scope.match = $rootScope.match;
  }else{
    if(angular.isDefined($rootScope.matchF)){
      $scope.match = $rootScope.matchF;
    }else{
      $location.path('match');
    }
  }

$scope.disableButton=true;
  $scope.verifForm = function(){
    if($scope.joueur==null || $scope.price ==null){
      $scope.disableButton=true;
      console.log("NOK");
    }else{
      $scope.disableButton=false;
      console.log("OK");
    }
  }

  $scope.parier = function(){
    $scope.loading = true;
        $scope.disableButton = true;
    $scope.send = {
      id : $cookies.get('idClient'),
      match : $scope.match.id,
      somme : $scope.price,
      issue : $scope.joueur
    };

    console.log($scope.send);
    serviceAjax.pari($scope.send).then(function(data){
      console.log(data);
      $scope.price = null;
      $scope.joueur = null;
      Notification.success(data);

      if(data.status === 200){
        console.log("Data Status 200");


      }
      $scope.disableButton = false;
    }).catch(function(err){
      console.log(err);
      if(err.status!=-1){
      Notification.error(err.data);
    }else{
      Notification.error("Erreur : Problème de connexion avec le serveur");
    }
    });


  };
  });
