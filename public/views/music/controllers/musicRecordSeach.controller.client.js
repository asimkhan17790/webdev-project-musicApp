(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("MusicRecorderController", MusicRecorderController);

    function MusicRecorderController ($scope, $sce,$timeout,Upload,MusicService,$routeParams) {

        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.recordAudio = recordAudio;
        vm.stopRecording = stopRecording;
        vm.getTrustedHtml = getTrustedHtml;
        vm.recordAndSearch = recordAndSearch;
        vm.showSpinner = showSpinner;
        vm.findLyrics = findLyrics;
        vm.closeAlert = closeAlert;
        function init() {


        }
        init();
        function closeAlert() {
            vm.error=null;
        }
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
            vm.lyricsData= null;
            vm.error = null;
            $timeout(function () {
                console.log(vm.recordedInput);
                Upload.upload({
                    url: '/api/findmusic/musicFingerPrint', //webAPI exposed to upload the file
                    data:{file:vm.recordedInput} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    vm.recordingFlag = false;
                    console.log(resp.data);

                    if (resp && resp.status==200 && resp.data && resp.data.status==='OK') {
                        vm.music = resp.data;
                        if (vm.music.previewURL) {
                            vm.music.previewURL =  $sce.trustAsResourceUrl(vm.music.previewURL);
                        }

                        vm.success= true;
                        vm.error = null;
                    }
                    else if (resp && resp.status==200 && resp.data && resp.data.status==='KO') {
                        if (resp.description) {
                            vm.error = resp.data.description;
                            console.log('hi');
                        }
                        else {
                            vm.error = "Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!";
                        }
                        vm.success= false;
                    }
                    else {
                        vm.error = "Oh Ooh!! Music not Recognised. Try again by keeping the Mic close to the Music!";
                        vm.success= false;
                    }
                }, function (err) {
                    vm.recordingFlag = false;
                    if (err && err.data && err.data.description) {
                        vm.error =  err.data.description;
                    }
                    else {
                        vm.error =  "Some Error Occurred";
                    }
                    vm.success= false;

                }, function (evt) {
                    console.log("In progress" + evt);
                });
            }, 50);

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
                        vm.error = "Lyrics does not exist in Database";
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

    }

})();