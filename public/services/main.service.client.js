(function () {
    angular
        .module("convobuddy")
        .service("mainService", mainService);

    function mainService($http) {


        var api = {
            faceRecon: faceRecon,
            voiceToText: voiceToText
        };
        return api;

        function faceRecon() {
            return $http.get("/api/faceRecon");
        }

        function voiceToText(formData) {
            var request = {
                method: 'POST',
                url: '/api/voiceToText',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            };
            return $http(request);
        }

    }
})();