(function () {
    angular
        .module("convobuddy")
        .config(Configuration);

    function Configuration($routeProvider) {
        $routeProvider
            .when("/results", {
                templateUrl: "views/main/templates/results.view.client.html",
                controller: 'resultsController',
                controllerAs: 'model'
            })
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