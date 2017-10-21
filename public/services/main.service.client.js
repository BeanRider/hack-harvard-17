(function () {
    angular
        .module("convobuddy")
        .service("mainService", mainService);

    function mainService($http) {


        var api = {
            faceRecon: faceRecon,
            voiceToText: voiceToText,
            nlp: nlp
        };
        return api;

        function faceRecon() {
            return $http.get("/api/faceRecon");
        }

        function voiceToText(file) {
            return $http.get("/api/voiceToText");
        }

        function nlp(){
            return $http.get("/api/nlp");
        }


    }
})();