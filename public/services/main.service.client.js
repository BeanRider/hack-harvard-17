(function () {
    angular
        .module("convobuddy")
        .service("mainService", mainService);

    function mainService($http) {


        var api = {
            voiceToText: voiceToText
        };
        return api;


        function voiceToText() {
            return $http.get("/api/voiceToText");

        }

    }
})();