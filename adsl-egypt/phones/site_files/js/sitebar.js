app.controller('sitebar', ($scope, $http) => {
    $scope.register = function () {
        site.showModal('#registerModal');
    };
    $scope.login = function () {
        site.showModal('#loginModal');
    };
    $scope.logout = function () {
        site.showModal('#logoutModal');
    };

    $scope.changeLang = function (lang) {
        $http({
            method: 'POST',
            url: '/@language/change',
            data: {
                name: lang,
            },
        }).then(function (response) {
            if (response.data.done) {
                window.location.reload(!0);
            }
        });
    };
});

app.controller('login', function ($scope, $http) {
    $scope.userEmail = 'smart';
    $scope.userPassword = 'smart';
    $scope.busy = !1;
    $scope.tryLogin = function (ev) {
        if (ev.which == 13) {
            $scope.login();
        }
    };

    $scope.login = function () {
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/user/login',
            data: {
                $encript: '123',
                email: site.to123($scope.userEmail),
                password: site.to123($scope.userPassword),
            },
        }).then(
            function (response) {
                if (response.data.error) {
                    $scope.error = response.data.error;
                }
                if (response.data.done) {
                    window.location.reload(!0);
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };
});

app.controller('logout', function ($scope, $http) {
    $scope.busy = !1;

    $scope.logout = function () {
        $scope.error = '';
        $scope.busy = !0;

        $http.post('/api/user/logout').then(
            function (response) {
                if (response.data.done) {
                    window.location.reload(!0);
                } else {
                    $scope.error = response.data.error;
                    $scope.busy = !1;
                }
            },
            function (error) {
                $scope.busy = !1;
                $scope.error = error;
            },
        );
    };
});

$(window).click(() => {
    $('.user-menu').hide();
});
