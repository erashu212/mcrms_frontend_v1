(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp.Admin', ['ngRoute'])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/admin/login', {
            templateUrl: '/templates/admin_login.html',
            controller: 'adminLoginController'
          })
          .when('/admin/search', {
            templateUrl: '/templates/search.html',
            controller: 'searchController'
          })
          .when('/admin/createSpeaker', {
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'createSpeakerController'
          })
          .when('/admin/editSpeaker/:speakerUUID', {
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'editSpeakerController'
          })
      }])
    .controller('adminLoginController', ['$scope', '$http', '$location', '$route', function ($scope, $http, $location, $route) {
      $scope.doLogin = function () {
        return $http
          .post('/api/v1/admin/login', {'username': $scope.username, 'password': $scope.password})
          .then(function (response) {
            return $route.reload();
          }, function (response) {
            alert('Wrong password!');
          })
      };

      $http.get('/api/v1/admin/myself').then(function (response) {
        $location.path('/admin/search');
      }, function (errorResponse) {
        //it is ok, unauthorized
      });
    }])
    .controller('searchController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      $http.get('/api/v1/admin/myself').then(function (response) {
        //it is ok, authorized
      }, function (errorResponse) {
        $location.path('/admin/login');
      }).then(function () {
        return $http.get('/api/v1/speaker/');
      }).then(function (response) {
        $scope.speakers = response.data.data;
      });

      $scope.resetPassword = function (speaker) {
        return $http.post('/api/v1/resetPassword/', {'email': speaker.email})
          .then(function () {
            alert('Password was reset!');
          }, function () {
            alert('Error reseting password!');
          });
      };

      $scope.$watch('query', function (newVal, oldVal, scp) {
        if (newVal != oldVal) {
          $http.get('/api/v1/speaker/?firstname=' + newVal + '&lastname=' + newVal + '&email=' + newVal)
            .then(function (response) {
              $scope.speakers = [];
              $scope.speakers = response.data.data;
            }, function (errorResponse) {

            });
        }
      });
    }])
    .controller('createSpeakerController', ['$scope', '$http', '$location', '$route', function ($scope, $http, $location, $route) {
      $http.get('/api/v1/admin/myself').then(function (response) {
        //it is ok, authorized
      }, function (errorResponse) {
        $location.path('/admin/login');
      });

      $scope.addLecture = function () {
        $scope.speaker.lectures.push({});
      };

      $scope.removeLecture = function (i) {
        console.log('Removing lecture ', i);
        $scope.speaker.lectures.splice(i, 1);
      };

      $scope.save = function () {
        return $http.post('/api/v1/speaker/', $scope.speaker)
          .then(function (ok) {
            alert('Data saved!');
          });
      };
    }])
    .controller('editSpeakerController', ['$scope', '$http', '$location', '$route', '$routeParams', function ($scope, $http, $location, $route, $routeParams) {
      var speakerUUID = $routeParams.speakerUUID;
      $http.get('/api/v1/admin/myself').then(function (response) {
        //it is ok, authorized
      }, function (errorResponse) {
        $location.path('/admin/login');
      }).then(function () {
        return $http.get('/api/v1/speaker/' + speakerUUID);
      }).then(function (response) {
        $scope.speaker = response.data.data;
      });

      $scope.addLecture = function () {
        $scope.speaker.lectures.push({});
      };

      $scope.removeLecture = function (i) {
        console.log('Removing lecture ', i);
        $scope.speaker.lectures.splice(i, 1);
      };

      $scope.save = function () {
        return $http.put('/api/v1/speaker/' + speakerUUID, $scope.speaker)
          .then(function (ok) {
            alert('Data saved!');
          });
      };
    }])
})();