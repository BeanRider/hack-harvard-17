(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location) {
        let vm = this;
        vm.output = output;
        function init() {
            output();
        }

        init();
        function output() {
            console.log("in output");
            let promise = mainService.faceRecon();
            promise.success(function (text) {
                if (text) {
                    console.log("the text is " + text);
                    vm.faceText = text;
                } else {
                    vm.error = 'text not found';
                }
            });

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