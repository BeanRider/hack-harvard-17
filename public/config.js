(function () {
    angular
        .module("convobuddy")
        .config(Configuration);

    function Configuration($routeProvider) {
        $routeProvider
            .when("/main", {
                templateUrl: "views/main/templates/main.view.client.html"
            })
            .otherwise({
                redirectTo: "/main"
            });

    }

})();