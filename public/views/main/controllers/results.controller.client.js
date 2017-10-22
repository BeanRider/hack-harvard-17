(function () {
    angular
        .module("convobuddy")
        .controller("resultsController", resultsController);

    function resultsController(mainService, $rootScope, $window) {
        let vm = this;

        // Pie
        vm.data = $rootScope.data;
        vm.labels = $rootScope.labels;

        // Transcript
        vm.voiceToText = $rootScope.voiceToText;

        // Logo click
        vm.logoClick = logoClick;
        function logoClick() {
            $window.location.href = '/#/main';
        }

        function init() {
            vm.transcript = "Can I use PayPal to receive the card? Maybe I can, maybe I can not. Why are you trying to ask me for information? I think you are rude.";
            if ($rootScope.transcript) {
                vm.transcript = $rootScope.transcript;
            }

            initHolisticScores();
            initEmotionScores();
        }
        init();

        function initEmotionScores() {
            vm.emotionScores = $rootScope.emotionScores;
            Object.keys(vm.emotionScores).forEach(function(k) {
                let newWidth = (round10(vm.emotionScores[k]*800)) + "px";
                console.log("newWidth = " + newWidth);
                vm.emotionScores[k] = round10(vm.emotionScores[k]*100);
                document.getElementById(k).style.width = newWidth;
            });
        }

        function initHolisticScores() {
            vm.holisticScoreLanguage = round10($rootScope.holisticScoreLanguage);
            vm.holisticScoreFace = "N/A";
            if ($rootScope.holisticScoreFace) {
                vm.holisticScoreFace = $rootScope.holisticScoreFace;
            }

            // Set color based on language score
            let score = vm.holisticScoreLanguage;

            let lPanel = document.getElementById("left-panel");
            let curClass = lPanel.className;
            lPanel.classList.remove(curClass);

            if (score < 2) {
                lPanel.classList.add("very-negative-grad");
            } else if (score < 4) {
                lPanel.classList.add("negative-grad");
            } else if (score < 6) {
                lPanel.classList.add("neutral-grad");
            } else if (score < 8) {
                lPanel.classList.add("positive-grad");
            } else {
                lPanel.classList.add("very-positive-grad");
            }
        }
    }

    function round10(d) {
        return Math.round(10 * d) / 10;
    }
})();