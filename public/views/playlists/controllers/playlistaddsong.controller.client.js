/**
 * Created by sumitbhanwala on 4/12/17.
 */
/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("PlayListAddSongController",PlayListAddSongController);

    function PlayListAddSongController($location,$routeParams,Upload,$timeout,MusicService,$sce,EmailService,$scope ,playListService) {
        var vm = this;
        vm.playing = false;
        var pid = $routeParams.pid;
        vm.playStatus = "Paused...";
        vm.nowPlayingTitle = "";
        vm.trackCount=0;
        vm.noSongFound = null ;
        vm.loadTrack = loadTrack;
        vm.previousSong = previousSong;
        vm.nextSong = nextSong;
        vm.playThisSong = playThisSong;
        vm.play = play;
        vm.index = 0;
        vm.playlist = {};
        function init () {
            findAllSongsForPlayList();

        }

        function loadMp3Player() {
            if (vm.playlist && vm.playlist.songs && vm.playlist.songs.length > 0) {
                vm.nowPlayingTitle = vm.playlist.songs[0].title;
                vm.trackCount = vm.playlist.songs.length;
            }
            vm.audio = angular.element(document.querySelector('#audio1')).bind('play', vm.play).bind('pause', function () {
                vm.playing = false;
                vm.playStatus = "Paused...";
                console.log(vm.playing);
                console.log(vm.playStatus);
                $scope.$apply();
            }).bind('ended', function () {
                vm.playStatus = "Paused...";
                if ((vm.index + 1) < vm.trackCount) {
                    vm.index++;
                    loadTrack(vm.index);
                    vm.audio.play();
                } else {
                    vm.audio.pause();
                    vm.index = 0;
                    loadTrack(vm.index);
                }
                $scope.$apply();
            }).get(0);
            loadTrack(vm.index);
        }

        init();
        
        function findAllSongsForPlayList() {
            var promise = playListService.findAllSongs(pid);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.songs.length > 0) {
               //     console.log(result.data);
                    vm.playlist = result.data;
                    loadMp3Player();
                }
                else if(result && result.status==='OK' && result.data && result.data.songs.length == 0){
                    vm.noSongFound = "There are no songs to play in this playlist";
                }else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function play () {
            vm.playing = true;
            vm.playStatus = "Now Playing...";
            $scope.$apply();
            console.log(vm.playing);
            console.log(vm.playStatus);
        }

        function previousSong() {
            if ((vm.index - 1) > -1) {
                vm.index--;
                loadTrack(vm.index);
                if (vm.playing) {
                    vm.audio.play();
                }
            } else {
                vm.audio.pause();
                vm.index = 0;
                loadTrack(vm.index);
            }
        }
        function nextSong() {

            if ((vm.index + 1) < vm.trackCount) {
                vm.index++;
                loadTrack(vm.index);
                if (vm.playing) {
                    vm.audio.play();
                }
            } else {
                vm.audio.pause();
                vm.index = 0;
                loadTrack(vm.index);
            }
        }

        function playThisSong (id) {
            loadTrack(id);
            vm.audio.play();
        }

        function loadTrack(id) {
            vm.nowPlayingTitle = vm.playlist.songs[id].title;
            vm.index = id;
            vm.audio.src = $sce.trustAsResourceUrl(vm.playlist.songs[id].url);
        }



    }
})();