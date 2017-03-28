(function() {

    angular
        .module("WebDevMusicApp")
        /*.run(['$location', '$rootScope', function($location, $rootScope) {
         $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

         if (current.hasOwnProperty('$$route')) {
         $rootScope.title = current.$$route.title;
         }
         });
         }])*/
        .controller("MusicRecSearchController",MusicRecSearchController);


    function MusicRecSearchController($location,Upload,$timeout) {
        console.log('Hello from music page');

        var vm = this;
        vm.recordAudio = recordAudio;
        vm.stopRecording = stopRecording;
        //var recordRTC = null;

        function init () {
        }
        init();

        function recordAudio() {
        console.log(vm.recordedInput);
        }
        function stopRecording() {
            console.log(vm.recordedInput);
        }

        vm.sendToServer = function () {


            $timeout(function () {
                console.log(vm.recordedInput);
                Upload.upload({
                    url: '/api/findmusic/musicFingerPrint', //webAPI exposed to upload the file
                    data:{file:vm.recordedInput} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise

                        console.log(resp.data);
                        var data = JSON.parse(resp.data);
                        vm.music = data.metadata.music;
                        // vm.error = 'An error occurred';

                }, function (resp) { //catch error
                    console.log(resp);
                    //vm.error =  resp.status;
                    // vm.error =  'Error status: ' + resp.status;
                }, function (evt) {
                    // console.log(evt);
                    // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            }, 50);

        };



        /*function recordAudio() {

            var session = {
                audio: true,
                video: false
            };

            navigator.getUserMedia(session, function (mediaStream) {
                recordRTC = RecordRTC(MediaStream);
                recordRTC.startRecording();
            }, function (err) {
                console.log(err);
            });
        }
        function stopRecording() {
            recordRTC.stopRecording(function(audioURL) {
                var formData = new FormData();
                formData.append('edition[audio]', recordRTC.getBlob())
                $.ajax({
                    type: 'POST',
                    url: 'some/path',
                    data: formData,
                    contentType: false,
                    cache: false,
                    processData: false,
                })
            });

        }*/


    }
})();