(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp.Speaker', ['ngRoute'])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/speaker/login', {
            templateUrl: '/templates/speaker_login.html',
            controller: 'speakerLoginController'
          })
          .when('/speaker/:speakerUUID', {
            templateUrl: '/templates/speaker_view.html',
            controller: 'speakerViewController'
          })
      }])
    .controller('speakerLoginController', ['$scope', '$http', '$location', '$route', function ($scope, $http, $location, $route) {
      $scope.doLogin = function () {
        return $http
          .post('/api/v1/auth/login', {'email': $scope.email, 'password': $scope.password})
          .then(function (response) {
            return $route.reload();
          }, function (response) {
            alert('Wrong password!');
          })
      };

      $scope.doResetPassword = function () {
        return $http.post('/api/v1/resetPassword', {'email':$scope.email})
          .then(function () {
            alert('Password was reset');
          }, function () {
            alert('Password was reset');
          });
      };

      $http.get('/api/v1/auth/myself').then(function (response) {
        var uuid = response.data.data.UUID;
        console.log(response.data.data);
        console.log(response.data.data.UUID);
        $location.path('/speaker/' + uuid);
      }, function (errorResponse) {
        //it is ok, unauthorized
      });
    }])
    .controller('speakerViewController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
      var speakerUUID = $routeParams.speakerUUID;
      $http.get('/api/v1/speaker/' + speakerUUID).then(function (response) {
        $scope.speakerFound = true;
        $scope.speaker = response.data.data;
        $scope.speakerJSON = JSON.stringify(response.data.data, null, 2);
      }, function (errorResponse) {
        $scope.speakerFound = false;
      });
    }]);
})();