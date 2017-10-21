(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location) {
        var vm = this;
        vm.output = output;
        vm.voiceToText = voiceToText;

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
                // var context = new AudioContext();
                // var source = context.createMediaStreamSource(stream);
                // var processor = context.createScriptProcessor(1024, 1, 1);
                //
                // source.connect(processor);
                // processor.connect(context.destination);
                //
                // processor.onaudioprocess = function(e) {
                //     // Do something with the data, i.e Convert this to ogg
                //     console.log(e.inputBuffer);
                // };

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
                            } else {
                                vm.error = 'text not found';
                            }
                        });
                    }

                });
            };



            //     = function () {
            //     try {
            //         mr.stop();
            //         mr.stream.getTracks().forEach(function(track)       {track.stop();});
            //     } catch (e) {}
            //
            //     let blob = new Blob(buffer, {
            //         type: 'data:audio/ogg;base64'
            //     });
            //
            //     let url = window.URL.createObjectURL(blob);
            //     download.href = url;
            //     download.download = "123";
            //     download.click();
            //     // window.URL.revokeObjectURL(url);
            // };


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