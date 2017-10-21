(function () {
    angular
        .module("convobuddy")
        .controller("resultsController", resultsController);

    function resultsController(mainService, $rootScope) {
        let vm = this;

        vm.voiceToText = $rootScope.voiceToText;

        function init() {

            initHolisticScores();

        }

        init();

        function initHolisticScores() {
            vm.holisticScoreVoice = 9.1;
            vm.holisticScoreFace = 1.9;

            let avgScore = (vm.holisticScoreVoice + vm.holisticScoreFace) / 2;

            let lPanel = document.getElementById("left-panel");
            let curClass = lPanel.className;
            lPanel.classList.remove(curClass);

            if (avgScore < 2) {
                lPanel.classList.add("very-negative-grad");
            } else if (avgScore < 4) {
                lPanel.classList.add("negative-grad");
            } else if (avgScore < 6) {
                lPanel.classList.add("neutral-grad");
            } else if (avgScore < 8) {
                lPanel.classList.add("positive-grad");
            } else {
                lPanel.classList.add("very-positive-grad");
            }
        }
    }
})();