(function () {
    angular
        .module("convobuddy")
        .controller("mainController", mainController);

    function mainController(mainService, $location) {
        var vm = this;
        vm.output = output;
        function init() {
            output();
        }

        init();
        function output() {
            console.log("in output");
            var promise = mainService.voiceToText();
            /*promise.success(function (text) {
                if (text) {
                    console.log("the text is " + text);
                    vm.text = text;
                } else {
                    vm.error = 'text not found';
                }
            });*/
            vm.text = promise;

        }
    }
})();