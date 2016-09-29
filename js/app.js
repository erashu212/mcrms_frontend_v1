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
          .when('/admin/search', {
            templateUrl: '/templates/search.html',
            controller: 'searchController'
          })
          .when('/admin/createSpeaker',{
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'createSpeakerController'
          })
          .when('/admin/editSpeaker/:speakerUUID',{
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'editSpeakerController'
          })
          .when('/', {
            templateUrl: '/templates/main.html',
            controller: 'mainController'
          })
          .otherwise({
            redirectTo: '/'
          });
      }])
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
        return $http.post('/api/v1/resetPassword/',{'email':speaker.email})
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