(function () {
    angular
        .module("convobuddy")
        .service("mainService", mainService);

    function mainService($http) {


        var api = {
            faceRecon: faceRecon,
            voiceToText: voiceToText,
            nlp: nlp,
            upload:upload
        };
        return api;

        function faceRecon() {
            return $http.get("/api/faceRecon");
        }

        function voiceToText(formData) {
            let request = {
                method: 'POST',
                url: '/api/voiceToText',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            };
            return $http(request);
        }

        function nlp(text) {
            return $http.post("/api/nlp", {data: text});
        }

        function upload(formData) {
            let request = {
                method: 'POST',
                url: '/upload',
                data: formData,
                headers: {
                    'Content-Type': undefined
                }
            };
            return $http(request);
            //return $http.post("/upload", file);
        }


    }
})();