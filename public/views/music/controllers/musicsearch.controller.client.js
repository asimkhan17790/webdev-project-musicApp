(function() {

    angular
        .module("WebDevMusicApp")
        .controller("MusicRecSearchController",MusicRecSearchController);


    function MusicRecSearchController($location,Upload,$timeout,MusicService,$sce,EmailService) {
        console.log('Hello from music page');

        var vm = this;
        vm.recordAudio = recordAudio;
        vm.stopRecording = stopRecording;
        vm.findLyrics = findLyrics;
        vm.getTrustedHtml = getTrustedHtml;
        vm.sendEmail = sendEmail;
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

        }
        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function findLyrics (songTitle, artists) {
            console.log(artists[0]);
            if (songTitle && artists && artists[0] != null) {
                var promise =  MusicService.searchLyrics(songTitle, artists[0].name);

                promise.success(function (data) {
                    if (data.message && data.message.header
                        && data.message.header.status_code && data.message.header.status_code === 200) {
                        //console.log(data.message.body.lyrics.lyrics_body);
                        vm.lyricsData = data.message.body.lyrics.lyrics_body;
                        console.log(vm.lyricsData);
                    }
                    else {
                        console.log("No Data Found");
                        vm.lyricsData =null;
                    }
                })
                    .error(function () {
                        vm.error = "Error Occurred";
                        vm.lyricsData =null;
                    });
            }
            else {
                console.log("No input Data");
            }

        }

        function sendEmail () {
            var promise =  EmailService.sendEmail(vm.email);
            promise.success(function (response) {
                console.log(response);
            }).error(function (error) {
                    console.log(error);
                });



        }
    }
})();