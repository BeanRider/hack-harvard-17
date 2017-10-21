(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location, $window, $rootScope) {
        var vm = this;
        vm.fullname = "Jeffrey Weng";
        vm.image_counter = 0;
        vm.output = output;
        vm.voiceToText = voiceToText;
        vm.endMeeting = endMeeting;
        vm.startLoop = startLoop;
        vm.stopLoop = stopLoop;
        vm.take_snap = take_snap;
        var myInterval = 0;

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var video = document.getElementById('video');

        function endMeeting() {
            $window.location.href = '/#/results';
            $rootScope.holisticScoreLanguage = 10*Math.random();
            $rootScope.holisticScoreFace = 10*Math.random();
        }

// Trigger photo take
        var snap = document.getElementById("snap");

        function init() {

            var buffer = [];
            function ondataavailable(e) {
                console.log("reach");
                if (e && e.data)
                    buffer.push(e.data);
            }

            let player = document.getElementById('player');
            let mr;
            let handleSuccess = function(stream) {
                console.log("handleSuccess");
                mr = new MediaRecorder(stream, {mimeType: "audio/webm;codecs=opus"});
                mr.ondataavailable = ondataavailable;
                mr.start(1000);

                // if (window.URL) {
                //     player.src = window.URL.createObjectURL(stream);
                // } else {
                //     player.src = stream;
                // }
            };

            function bufferToDataUrl(callback) {
                let blob = new Blob(buffer, {
                    type: 'audio/webm; codecs=opus'
                });

                let reader = new FileReader();
                reader.onload = function() {
                    callback(reader.result);
                };
                reader.readAsDataURL(blob);
            }

            function dataUrlToFile(dataUrl) {
                var binary = atob(dataUrl.split(',')[1]),
                    data = [];

                for (var i = 0; i < binary.length; i++)
                    data.push(binary.charCodeAt(i));

                return new File([new Uint8Array(data)], 'recorded.webm', {
                    type: 'data:audio/webm'
                });
            }

            let hasSent = false;
            let download = document.getElementById("download");
            download.onclick
                = function() {
                bufferToDataUrl(function(dataUrl) {
                    let file = dataUrlToFile(dataUrl);
                    console.log(file);
                    // upload file to the server.
                    var formData = new FormData();

                    // add the files to formData object for the data payload
                    if (!hasSent) {
                        console.log("adding file");
                        hasSent = true;
                        formData.append('uploads[]', file, file.name);
                        let promise = mainService.voiceToText(formData);
                        promise.success(function (text) {
                            if (text) {
                                console.log("the text is " + text);
                                vm.voiceText = text;
                                $rootScope.voiceToText = text;
                            } else {
                                vm.error = 'text not found';
                            }
                        });
                    }

                });
            };

            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(handleSuccess);

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

           /* snap.addEventListener("click", function () {
                context.drawImage(video, 0, 0, 640, 480);
                image_counter = image_counter + 1;
                dataURL = canvas.toDataURL("image/jpeg",0.85);
                var file = dataUrlToImage(dataURL,image_counter);
                var formData = new FormData();
                formData.append('file', file, file.name);
                mainService.upload(formData);

            });*/


        }
        init();


        function output() {
            console.log("in output ");
            let promise = mainService.faceRecon();
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
            let promise = mainService.nlp();
        }

// STARTS and Resets the loop if any
        function startLoop() {

            myInterval = setInterval(Function("document.getElementById(\"snap\").click();"), 20000);
        }

    function stopLoop() {
        clearInterval(myInterval);
    }
        function dataUrlToImage(dataUrl,image_counter) {
            console.log("daturltoImage"+ image_counter);
            var binary = atob(dataUrl.split(',')[1]),
                data = [];
            for (var i = 0; i < binary.length; i++)
                data.push(binary.charCodeAt(i));
            return new File([new Uint8Array(data)], "'recorded"+image_counter+".jpeg'", {
                type: 'data:image/jpeg'
            });
        }

        function take_snap() {
            context.drawImage(video, 0, 0, 640, 480);
            vm.image_counter = vm.image_counter + 1;
            console.log(vm.image_counter);
            dataURL = canvas.toDataURL("image/jpeg",0.85);
            var file = dataUrlToImage(dataURL,vm.image_counter);
            var formData = new FormData();
            formData.append('file', file, file.name);
            mainService.upload(formData);
        }
    }
})();