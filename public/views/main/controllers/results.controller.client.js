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
            vm.holisticScoreLanguage = round10($rootScope.holisticScoreLanguage);
            vm.holisticScoreFace = $rootScope.holisticScoreFace;

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