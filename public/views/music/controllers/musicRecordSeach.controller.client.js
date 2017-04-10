(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("MusicRecorderController", MusicRecorderController);

    function MusicRecorderController ($scope, $sce,$timeout,Upload) {

        var vm = this;
        vm.recordAudio = recordAudio;
        vm.stopRecording = stopRecording;
        vm.getTrustedHtml = getTrustedHtml;
        vm.recordAndSearch = recordAndSearch;
        vm.showSpinner = showSpinner;
        function init() {


        }
        init();

        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }
        function recordAudio() {
            console.log(vm.recordedInput);
        }
        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function stopRecording() {
            console.log(vm.recordedInput);
        }
        function recordAndSearch() {

            $timeout(function () {
                console.log(vm.recordedInput);
                Upload.upload({
                    url: '/api/findmusic/musicFingerPrint', //webAPI exposed to upload the file
                    data:{file:vm.recordedInput} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    vm.recordingFlag = false;
                    console.log(resp.data);
                    if (resp &&
                        resp.data) {

                        var data = JSON.parse(resp.data);
                        if (data &&
                            data.metadata &&
                            data.metadata.music) {

                            vm.music = data.metadata.music;
                            vm.success= true;
                            vm.error = null;
                        }
                        else {
                            vm.error = "Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!";
                            vm.success= false;
                        }

                    }
                    else {
                        vm.error = "Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!";
                        vm.success= false;
                    }
                    // vm.error = 'An error occurred';

                }, function (resp) {
                    vm.recordingFlag = false;
                    console.log(resp);
                    vm.error =  "Some Error Occurred";
                    vm.success= false;

                }, function (evt) {
                    console.log("In progress");
                });
            }, 50);

        }



    }

})();