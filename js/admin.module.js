(function () {
  'use strict';
  /*global angular, async*/
  angular.module('mcrmsApp.Admin', ['ngRoute'])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
        //Page where Admin, not Speaker, can login
          .when('/admin/login', {
            templateUrl: '/templates/admin_login.html',
            controller: 'adminLoginController'
          })
          //Page, where Admin, can see list of Speakers
          .when('/admin/search', {
            templateUrl: '/templates/search.html',
            controller: 'searchController'
          })
          //Page, where Admin can create new speaker
          .when('/admin/createSpeaker', {
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'createSpeakerController'
          })
          //Page to edit speaker - Admin can visit this page from /admin/search
          .when('/admin/editSpeaker/:speakerUUID', {
            templateUrl: '/templates/admin_edit_speaker.html',
            controller: 'editSpeakerController'
          })
          //Page for Admin to change some global things - list of moderators and so on
          .when('/admin/settings', {
            templateUrl: '/templates/admin_settings.html',
            controller: 'adminSettingsController'
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
      $scope.speaker = {};
      $scope.speaker.lectures = [];
      $http.get('/api/v1/admin/myself').then(function (response) {
        //it is ok, authorized
      }, function (errorResponse) {
        $location.path('/admin/login');
      }).then(function () {
        return $http.get('/api/v1/moderator')
      }).then(function (moderatorResponse) {
        $scope.moderators = moderatorResponse.data.data;
        $scope.isAdmin = true;
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
            $location.path('/admin/search');
          });
      };
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
            $location.path('/admin/search');
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
      }).then(function () {
        return $http.get('/api/v1/moderator')
      }).then(function (moderatorResponse) {
        $scope.moderators = moderatorResponse.data.data;
        $scope.isAdmin = true;
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
    .controller('adminSettingsController', ['$scope', '$http', '$location', '$route', function ($scope, $http, $location, $route) {
      $http.get('/api/v1/admin/myself').then(function (response) {
        return $http.get('/api/v1/moderator');
      }, function (errorResponse) {
        $location.path('/admin/login');
      }).then(function (okResponse) {
        $scope.moderators = okResponse.data.data;
      });


      $scope.update = function (moderator) {
        return $http.put('/api/v1/moderator/' + moderator.ID, {'name': moderator.name})
          .then(function (response) {
            $route.reload();
          }, function (error) {
            alert('Error updating moderator!');
          })
      };

      $scope.create = function () {
        return $http.post('/api/v1/moderator',{'name':$scope.newModeratorName})
          .then(function () {
            $route.reload();
          }, function (error) {
            alert('Error creating moderator!');
          });
      };
      $scope.remove = function (moderator) {
        if (!window.confirm('Are you sure?')) {
          return
        }

        return $http.delete('/api/v1/moderator/' + moderator.ID)
          .then(function (response) {
            $route.reload();
          }, function (error) {
            alert('Error updating moderator!');
          })
      };
    }])
})();