(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("SongDetailsguestController", SongDetailsguestController);

    function SongDetailsguestController ($location,playListService ,UserService, $sce,$timeout,Upload,MusicService,$routeParams) {
        var vm = this;
        vm.songId = $routeParams.songId ;
        //vm.getTrustedHtml = getTrustedHtml;
        vm.showSpinner = showSpinner;
        vm.findLyrics = findLyrics;
        vm.closeAlert = closeAlert;
        vm.selectedSong = null;
        vm.getTrustedURL = getTrustedURL;
        vm.clearDataFromModal = clearDataFromModal;

        function init() {
            findSongById();
            angular.element(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip({animation: true});
            });
        }
        function getTrustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }
        init();

        function findSongById () {
            var promise = MusicService.findSongById(vm.songId);
            promise.success(function(response) {
                vm.music = response.data;
                console.log(vm.music);
                vm.music.songURL =  $sce.trustAsResourceUrl(vm.music.songURL);

            }).error(function (err) {
                vm.error = "Some Error Occurred";
            })
        }

        function closeModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;
            $('.modal').modal('hide');
        }


        function clearDataFromModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;

        }

        function closeAlert() {
            vm.error=null;
        }
        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }


        function findLyrics (songTitle, artists) {
            console.log(artists[0]);
            if (songTitle && artists && artists[0] != null) {
                var promise =  MusicService.searchLyrics(songTitle, artists[0]);
                promise.success(function (data) {
                    if (data.message && data.message.header
                        && data.message.header.status_code && data.message.header.status_code === 200
                    && data.message.body.lyrics && data.message.body.lyrics.lyrics_body) {
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