(function () {
    angular
        .module("convobuddy")
        .config(Configuration);

    function Configuration($routeProvider) {
        $routeProvider
            .when("/main", {
                templateUrl: "views/main/templates/main.view.client.html",
                controller: 'mainController',
                controllerAs: 'model'
            })
            .otherwise({
                redirectTo: "/main"
            });

    }

})();