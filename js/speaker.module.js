(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp.Speaker', ['ngRoute'])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
//page where Speaker( not admin!!!!) can login
          .when('/speaker/login', {
            templateUrl: '/templates/speaker_login.html',
            controller: 'speakerLoginController'
          })
//page where Speaker can edit his/her profile
          .when('/speaker/editMyself',{
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'editMyselfSpeakerController'
          })
//page where everybody, who knows speaker'UUID, can view Speakers profile
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
//redirect user to page, where he/she can edit speakers profile
            $location.path('/speaker/editMyself');
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
//redirect user to page, where he/she can edit speakers profile
        $location.path('/speaker/editMyself');
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
//load speaker documents
        return $http.get('/api/v1/document/?speakerUUID='+speakerUUID);
      }, function (errorResponse) {
        $scope.speakerFound = false;
        return;
      }).then(function (documentsResponse) {
        if(documentsResponse){
          $scope.documents = documentsResponse.data.data;
        }
      });
    }])
    .controller('editMyselfSpeakerController', ['$scope', '$http', '$location', '$route', function ($scope, $http, $location, $route) {
      $scope.conferenceyears = new Date().getFullYear();
      var speakerUUID;
      $http.get('/api/v1/auth/myself').then(function (response) {
        speakerUUID = response.data.data.UUID;
        $scope.speaker = response.data.data;
        //it is ok, authorized
      }, function (errorResponse) {
        $location.path('/speaker/login');
      });

      $scope.addLecture = function () {
        $scope.speaker.lectures.push({});
      };

      $scope.removeLecture = function (i) {
        console.log('Removing lecture ', i);
        $scope.speaker.lectures.splice(i, 1);
      };

      $scope.save = function () {
        return $http.put('/api/v1/speaker/'+speakerUUID, $scope.speaker)
          .then(function (ok) {
            alert('Data saved!');
          });
      };
    }]);
})();