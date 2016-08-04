'use strict';

angular.module('mean.admin').controller('UsersController', ['$scope', 'Global', 'Menus', '$rootScope', '$http', 'Users', 'Circles',
    function($scope, Global, Menus, $rootScope, $http, Users, Circles) {

    $scope.global = Global;
    $scope.user = {};

    Circles.list(function(acl) {
      $scope.availableCircles = acl;
    });

    $scope.showDescendants = function(permission) {
      var temp = $('.ui-select-container .btn-primary').text().split(' ');
      temp.shift(); //remove close icon
      var selected = temp.join(' ');

      if($scope.allDescendants) {
        $scope.descendants = $scope.allDescendants[selected];
      } else {
        $scope.descendants = [];
      }
    };

    $scope.selectPermission = function() {
      $scope.descendants = [];
      // $scope.targetedUsersCount = 0; // for(var x in $scope.challenge.permissions) {//   $scope.targetedUsersCount += $scope.challenge.permissions[x].members; // }
    };
        Circles.mine(function(acl) {
            var circles = acl.allowed;

            $scope.userSchema = [{
                title: 'Email',
                schemaKey: 'email',
                type: 'email',
                inTable: true
            }, {
                title: 'Name',
                schemaKey: 'name',
                type: 'text',
                inTable: true
            }, {
                title: 'Username',
                schemaKey: 'username',
                type: 'text',
                inTable: true
            }, {
                title: 'Roles',
                schemaKey: 'roles',
                type: 'uiselect',
                options: circles,
                inTable: true
            }, {
                title: 'Password',
                schemaKey: 'password',
                type: 'password',
                inTable: false
            }, {
                title: 'Repeat password',
                schemaKey: 'confirmPassword',
                type: 'password',
                inTable: false
            }];

        });



        $scope.init = function() {
            Users.query({}, function(users) {
                $scope.users = users;
            });
        };

        $scope.add = function(valid) {
            if (!valid) return;
            if (!$scope.users) $scope.users = [];

            var user = new Users({
                email: $scope.user.email,
                name: $scope.user.name,
                username: $scope.user.username,
                password: $scope.user.password,
                confirmPassword: $scope.user.confirmPassword,
                roles: $scope.user.roles
            });

            user.$save(function(data, headers) {
                $scope.user = {};
                $scope.users.push(user);
                $scope.userError = null;
            }, function(data, headers) {
                $scope.userError = data.data;
            });
        };

        $scope.remove = function(user) {
            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }

            user.$remove();
        };

        $scope.update = function(user, userField) {
            // if (userField && userField === 'roles' && user.tmpRoles.indexOf('admin') !== -1 && user.roles.indexOf('admin') === -1) {
            //     if (confirm('Are you sure you want to remove "admin" role?')) {
            //         user.$update();
            //     } else {
            //         user.roles = user.tmpRoles;
            //     }
            // } else
            Users.update(user);
        };

        $scope.beforeSelect = function(userField, user) {
            if (userField === 'roles') {
                user.tmpRoles = user.roles;
            }
        };
    }
]);
