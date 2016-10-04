(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp', [
    'ngRoute',
    'mcrmsApp.Admin',
    'mcrmsApp.Speaker'
  ])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: '/templates/main.html',
            controller: 'mainController'
          })
          .otherwise({
            redirectTo: '/'
          });
      }])
//Header controller for menu - glitchy
//but golang api endpoints works ok
    .controller('headerController', ['$scope', '$http', '$route', function ($scope, $http, $route) {
      $http.get('/api/v1/auth/myself').then(function (response) {
        $scope.myUUID = response.data.data.UUID;
        $scope.myFirstName = response.data.data.firstname;
        $scope.myLastName = response.data.data.lastname;
        $scope.isUserLogged = true;
      }, function (errorResponse) {
        //it is ok, unauthorized
      });
      $scope.speakerLogout = function () {
        return $http.post('/api/v1/logout')
          .then(function (response) {
            $route.reload();
          }, function (errorResponse) {
            $route.reload();
          });
      };

      $http.get('/api/v1/admin/myself').then(function (response) {
        $scope.myAdminUsername = response.data.data.username;
        $scope.isAdmin = true;
      }, function (errorResponse) {
        //it is ok, unauthorized
      });

      $scope.adminLogout = function () {
        return $http.post('/api/v1/admin/logout')
          .then(function (response) {
            $route.reload();
          }, function (errorResponse) {
            $route.reload();
          });
      };
    }])
    .controller('mainController', ['$scope', function ($scope) {
      $scope.controller = 'mainController';
    }]);
})();