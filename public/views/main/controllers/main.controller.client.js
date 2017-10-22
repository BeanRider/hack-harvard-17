(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location, $window, $rootScope,$route) {
        var vm = this;
        vm.fullname = "Guest";
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

        vm.logoClick = logoClick;

        function logoClick() {
            $window.location.href = '/#/main';
        }

        function startAudioRecording() {
            let buffer = [];
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
                let binary = atob(dataUrl.split(',')[1]),
                    data = [];

                for (let i = 0; i < binary.length; i++)
                    data.push(binary.charCodeAt(i));

                return new File([new Uint8Array(data)], 'recorded.webm', {
                    type: 'data:audio/webm'
                });
            }


            let hasSent = false;
            function sendAudioForProcessing() {
                mr.stop();
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

                                    $rootScope.transcript = vm.voiceText;

                                    return mainService.nlp(vm.voiceText);
                                } else {
                                    vm.error = 'not able to record properly..please try again';
                                    var retVal = confirm("Not able to record properly..reload ?");
                                    if( retVal == true ){
                                        $window.location.reload();
                                        }
                            else{
                                    throw Error(vm.error);}
                                }
                            })
                            .then((data) => {
                                $rootScope.holisticScoreLanguage = parseFloat(data.data.sentimentScore);
                                console.log("nlp: " + data.data + ", score = " + data.data.sentimentScore);

                                vm.stopLoop();
                                return vm.output();
                            })
                            .then((data) => {
                                let text = data.data;
                                if (text) {
                                    console.log("the text is " + text);
                                    vm.faceText = text;
                                    let joy = 0;
                                    let anger = 0;
                                    let sorrow = 0;
                                    let surprise = 0;
                                    for(let i = 0; i < vm.faceText.length; i++){
                                        let confidence = vm.faceText[i].detectionConfidence;
                                        joy = joy + (generate_sentiment_score(vm.faceText[i].joyLikelihood) * confidence);
                                        anger = anger + (generate_sentiment_score(vm.faceText[i].angerLikelihood) * confidence);
                                        sorrow = sorrow + (generate_sentiment_score(vm.faceText[i].sorrowLikelihood) * confidence);
                                        surprise = surprise + (generate_sentiment_score(vm.faceText[i].surpriseLikelihood) * confidence);
                                    }
                                    vm.joy_score = joy/(5*vm.faceText.length);
                                    vm.anger_score = anger/(5*vm.faceText.length);
                                    vm.sorrow_score = sorrow/(5*vm.faceText.length);
                                    vm.surprise_score = surprise/(5*vm.faceText.length);

                                    $rootScope.emotionScores = {
                                        "joy": vm.joy_score,
                                        "anger": vm.anger_score,
                                        "sorrow": vm.sorrow_score,
                                        "surprise": vm.surprise_score,
                                    };

                                    $rootScope.holisticScoreFace = Object.keys($rootScope.emotionScores).reduce(
                                        function(a, b){
                                            return $rootScope.emotionScores[a] > $rootScope.emotionScores[b] ? a : b
                                        });

                                    vm.data = [vm.joy_score, vm.anger_score, vm.sorrow_score,vm.surprise_score];
                                    $rootScope.data = vm.data;
                                    //vm.labels =['Red', 'Yellow','Blue','Green'];
                                    vm.labels =['Joy', 'Anger','Sorrow','Surprise'];
                                    $rootScope.labels = vm.labels;
                                } else {
                                    vm.error = 'text not found';
                                    throw Error(vm.error);
                                }
                            })
                            .then((data) => {
                                $window.location.href = '/#/results';
                            })
                            .catch((err) => {
                                console.error('ERROR:', err);
                            });
                    }
                });
            }
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(handleSuccess);

            vm.startLoop();

            vm.endMeeting = function() {
                document.getElementById("loading").style.visibility = "visible";
                document.getElementById("record-status").style.visibility = "hidden";
                stopLoop();
                sendAudioForProcessing();
            };
        }

        vm.startSession = startSession;
        function startSession() {
            document.getElementById("start-overlay").style.visibility = "hidden";

            // Audio Recording
            startAudioRecording();

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
        }

        function init() {
            document.getElementById("loading").style.visibility = "hidden";
        }
        init();


        function output() {
            console.log("in output ");
            return mainService.faceRecon();
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
            // myInterval = setInterval(function() {
            //     take_snap();
            // }, 5000);
            myInterval = setInterval(Function("document.getElementById(\"snap\").click();"), 3000);
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

            if (vm.image_counter > 8) {
                vm.endMeeting();
            }

            console.log(vm.image_counter);
            dataURL = canvas.toDataURL("image/jpeg",0.85);
            var file = dataUrlToImage(dataURL,vm.image_counter);
            var formData = new FormData();
            formData.append('file', file, file.name);
            mainService.upload(formData);
        }
    }
})();