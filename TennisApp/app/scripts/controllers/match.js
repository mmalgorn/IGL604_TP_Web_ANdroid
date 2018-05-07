'use strict';

/**
* @ngdoc function
* @name tennisAppApp.controller:MatchCtrl
* @description
* # MatchCtrl
* Controller of the tennisAppApp
*/
angular.module('tennisAppApp')
.controller('MatchCtrl', function ($log,$scope,$cookies, serviceAjax,$location,$rootScope,$interval,nickName,Notification,messageFormatter) {

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  if(!angular.isDefined($cookies.get('idClient'))){
    $cookies.put('idClient',makeid());
  }

  console.log("Cookies idClient : "+$cookies.get('idClient'));
  console.log($rootScope.socket);
  if(!angular.isDefined($rootScope.socket)){
  $rootScope.socket = io.connect('http://localhost:8080');

    $rootScope.socket.on($cookies.get('idClient'), function(message) {
      $scope.send = {
        id : $cookies.get('idClient'),
      };
      serviceAjax.sendid($scope.send);
      webNotification.showNotification(message.titre, {
           body: message.contenu,
         onClick: function onNotificationClicked() {
           console.log('Notification clicked.');
             $location.path('matchU');
         },
         autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
       }, function onShow(error, hide) {
         if (error) {
           window.alert('Unable to show notification: ' + error.message);
         } else {
           console.log('Notification Shown.');

           setTimeout(function hideNotification() {
             console.log('Hiding notification....');
             hide(); //manually close the notification (you can skip this if you use the autoClose option)
           }, 5000);
         }
       });

    });
  }



  $scope.text="testText";
  $scope.title="TESTTITTLE";
  $scope.matchSelected = null;

  $scope.loadMatch = function(){
    $scope.loading = true;
    serviceAjax.match().then(function(data){
      console.log(data);
      data = data.data;

      $scope.matchs = data;
      $scope.error = null;
    }).catch(function(err){
      if(!angular.isDefined($scope.error)){
      Notification.error("Erreur de communication avec le serveur");
      }
      $scope.error = "Erreur de communication avec le serveur";

    });
  };


  $scope.pageChanged = function(){
    $scope.loadMatch();
  };


  if(angular.isDefined($rootScope.matchF)){
    $scope.matchSelected = $rootScope.matchF;
  }

  $scope.uncheck = function (value) {

    if(value !== $rootScope.matchF){

        if(angular.isDefined($rootScope.socketMatch)){
          $rootScope.socketMatch.disconnect();
        }
        $rootScope.matchF=value;
        $scope.matchSelected = value;
        $rootScope.socketMatch = io.connect('http://localhost:8080/match'+$scope.matchF.id);
        console.log ('http://localhost/match'+$scope.matchF.id);
        $rootScope.socketMatch.on('match', function(message) {
          webNotification.showNotification(message.titre, {
             body: message.contenu,
             onClick: function onNotificationClicked() {
                  $location.path('matchU');
             },
             autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
           }, function onShow(error, hide) {
             if (error) {
               window.alert('Unable to show notification: ' + error.message);
             } else {

               setTimeout(function hideNotification() {
                 hide(); //manually close the notification (you can skip this if you use the autoClose option)
               }, 5000);
             }
           });
        });

    }else{
      $scope.matchSelected = null;
      $rootScope.matchF = null;
      $rootScope.socketMatch.disconnect();
    }

    };


  $scope.changeView = function(match){
    $rootScope.match=match;
    $location.path('matchU');
  };
  $scope.loadMatch();
  var timerData =
  $interval(function () {
    $scope.loadMatch();
  }, 5000);


  $scope.connexion = function(){
    $scope.loading = true;
    $scope.send = {
      id : $cookies.get('idClient'),
    };

    console.log($scope.send);
    serviceAjax.connexionGains($scope.send).then(function(data){
      console.log(data);
      data = data.data;
      $scope.send = {
        id : $cookies.get('idClient'),
      };
      serviceAjax.sendid($scope.send);
      if(parseInt(data)>0){
      webNotification.showNotification("Gain depuis la dernière connexion", {
         body: "Vous avez gagnez "+data+"€",
         onClick: function onNotificationClicked() {
              $location.path('matchU');
         },
         autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
       }, function onShow(error, hide) {
         if (error) {
           window.alert('Unable to show notification: ' + error.message);
         } else {

           setTimeout(function hideNotification() {
             hide(); //manually close the notification (you can skip this if you use the autoClose option)
           }, 5000);
         }
       });
     }
    });
  };

  $scope.connexion();



});
