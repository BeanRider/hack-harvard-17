(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location) {
        var vm = this;
        vm.output = output;
        vm.voiceToText = voiceToText;

        function init() {
            var video = document.getElementById('video');

// Get access to the camera!
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                navigator.mediaDevices.getUserMedia({video: true},image_format= "jpeg",
                    jpeg_quality= 85).then(function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                });
            }
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');

// Trigger photo take
            document.getElementById("snap").addEventListener("click", function () {
                context.drawImage(video, 0, 0, 640, 480);
                var image = new Image();
                image.src = canvas.toDataURL("image/jpeg",0.85);
                image.originalname = "image1.png";
                console.log("image"+ image.src);

                promise = mainService.upload2(image);
                promise.success(function (text) {
                    if (text) {
                        console.log("the text is " + text);
                        vm.faceText = text;
                    } else {
                        vm.error = 'text not found';
                    }
                });
            });

        }
        init();


        function output() {
            console.log("in output ");
            promise = mainService.faceRecon();
            promise.success(function (text) {
                if (text) {
                    console.log("the text is " + text);
                    vm.faceText = text;
                } else {
                    vm.error = 'text not found';
                }
            });

        }

        function voiceToText() {
            promise = mainService.voiceToText();
            promise.success(function (text) {
                if (text) {
                    console.log("the text is " + text);
                    vm.voiceText = text;
                } else {
                    vm.error = 'text not found';
                }
            });
            promise = mainService.nlp();

        }
    }
})();