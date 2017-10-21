(function () {
    angular
        .module("convobuddy")
        .service("mainService", mainService);

    function mainService($http) {


        var api = {
            faceRecon: faceRecon,
            voiceToText: voiceToText,
            nlp: nlp,
            upload2:upload2
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

        function upload2(file) {
            return $http.post("/upload2",file);
        }


    }
})();