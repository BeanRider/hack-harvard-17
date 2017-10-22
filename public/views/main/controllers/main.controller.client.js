(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location, $window, $rootScope) {
        var vm = this;
        vm.fullname = "Jeffrey Weng";
        vm.image_counter = 0;
        vm.output = output;
        vm.startLoop = startLoop;
        vm.stopLoop = stopLoop;
        vm.take_snap = take_snap;
        var myInterval = 0;

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var video = document.getElementById('video');

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

            function sendAudioForProcessing() {
                bufferToDataUrl(function(dataUrl) {
                    let file = dataUrlToFile(dataUrl);
                    console.log(file);
                    // upload file to the server.
                    let formData = new FormData();

                    // add the files to formData object for the data payload
                    if (!hasSent) {
                        console.log("adding file");
                        hasSent = true;
                        formData.append('uploads[]', file, file.name);
                        mainService.voiceToText(formData)
                            .then((text) => {
                                if (text && text.data.length > 0) {
                                    vm.voiceText = text.data[0].alternatives[0].transcript;
                                    console.log("the transcript is " + vm.voiceText);

                                    $rootScope.voiceToText = text;

                                    return mainService.nlp(vm.voiceText);
                                } else {
                                    vm.error = 'text not found';
                                    throw Error(vm.error);
                                }
                            })
                            .then((data) => {
                                $rootScope.holisticScoreLanguage = parseFloat(data.data.sentimentScore);
                                // $rootScope.holisticScoreLanguage = 10*Math.random();
                                $rootScope.holisticScoreFace = "Joy";

                                console.log("nlp: " + data.data + ", score = " + data.data.sentimentScore);
                                $window.location.href = '/#/results';

                            })
                            .catch((err) => {
                                console.error('ERROR:', err);
                            });
                    }

                });
            }

            vm.endMeeting = function() {
                sendAudioForProcessing();

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
                    var joy = 0;
                    var anger = 0;
                    var sorrow = 0;
                    var surprise = 0;
                    for(i=0;i<vm.faceText.length;i++){
                        confidence = vm.faceText[i].detectionConfidence;
                        joy = joy + (generate_sentiment_score(vm.faceText[i].joyLikelihood) * confidence);
                        anger = anger + (generate_sentiment_score(vm.faceText[i].angerLikelihood) * confidence);
                        sorrow = sorrow + (generate_sentiment_score(vm.faceText[i].sorrowLikelihood) * confidence);
                        surprise = surprise + (generate_sentiment_score(vm.faceText[i].surpriseLikelihood) * confidence);
                    }
                    vm.joy_score = joy/(5*vm.faceText.length);
                    vm.anger_score = anger/(5*vm.faceText.length);
                    vm.sorrow_score = sorrow/(5*vm.faceText.length);
                    vm.surprise_score = surprise/(5*vm.faceText.length);
                    vm.data = [vm.joy_score, vm.anger_score, vm.sorrow_score,vm.surprise_score];
                    //vm.labels =['Red', 'Yellow','Blue','Green'];
                    vm.labels =['Joy', 'Anger','sorrow','surprise'];
                } else {
                    vm.error = 'text not found';
                }
            });
        }

        function generate_sentiment_score(sentiment){
            var score;
            if(sentiment == "VERY_LIKELY"){
                score = 5;
            }
            else if(sentiment == "LIKELY"){
                score = 4;
            }
            else if(sentiment == "POSSIBLE"){
                score = 3;
            }
            else if(sentiment == "UNLIKELY"){
                score = 2;
            }
            else if(sentiment == "VERY_UNLIKELY"){
                score = 1;
            }
            else if(sentiment == "UNKNOWN"){
                score = 0;
            }
            return score;
        }

// STARTS and Resets the loop if any
        function startLoop() {

            myInterval = setInterval(Function("document.getElementById(\"snap\").click();"), 10000);
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