(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp', ['ngRoute'])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/speaker/login', {
            templateUrl: '/templates/speaker_login.html',
            controller: 'speakerLoginController'
          })
          .when('/admin/login', {
            templateUrl: '/templates/admin_login.html',
            controller: 'adminLoginController'
          })
          .when('/speaker/:speakerUUID', {
            templateUrl: '/templates/speaker_view.html',
            controller: 'speakerViewController'
          })
          .when('/', {
            templateUrl: '/templates/main.html',
            controller: 'mainController'
          })
          .otherwise({
            redirectTo: '/'
          });
      }])
    .controller('mainController', ['$scope', function ($scope) {
      $scope.controller = 'mainController';
    }])
    .controller('speakerLoginController', ['$scope','$http','$location', function ($scope,$http,$location) {
      $scope.doLogin = function () {
        return $http
          .post('/api/v1/auth/login', {'email':$scope.email, 'password':$scope.password})
          .then(function (response) {
            var uuid = response.data.speakerUUID;
            console.log(response);
            $location.path('/speaker/'+uuid);
          }, function (response) {
            alert('Wrong password!');
          })
      };

      $http.get('/api/v1/auth/myself').then(function (response) {
        var uuid = response.data.data.UUID;
        console.log(response.data.data);
        console.log(response.data.data.UUID);
        $location.path('/speaker/'+uuid);
      }, function (errorResponse) {
        //it is ok, unauthorized
      });
    }])
    .controller('adminLoginController', ['$scope', function ($scope) {

    }])
    .controller('speakerViewController', ['$scope','$http', '$routeParams',function ($scope, $http,$routeParams) {
      var speakerUUID = $routeParams.speakerUUID;
      $http.get('/api/v1/speaker/'+speakerUUID).then(function (response) {
        $scope.speakerFound = true;
        $scope.speaker = response.data.data;
      }, function (errorResponse) {
        $scope.speakerFound = false;
      });
    }])
})();