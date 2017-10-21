(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location) {
        var vm = this;
        vm.output = output;
        vm.voiceToText = voiceToText;
        function init() {
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