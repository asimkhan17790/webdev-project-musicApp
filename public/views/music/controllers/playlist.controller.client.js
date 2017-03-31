/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("PlayListController",PlayListController);


    function PlayListController($location,Upload,$timeout,MusicService,$sce,EmailService,$scope) {

        var vm = this;
        vm.playing = false;
        vm.playStatus = "Paused...";
        vm.nowPlayingTitle = "";
        vm.trackCount=0;
        vm.loadTrack = loadTrack;
        vm.previousSong = previousSong;
        vm.nextSong = nextSong;
        vm.playThisSong = playThisSong;
        vm.play = play;
        vm.index = 0;



        vm.playlist = {
            playlistId:"123456",
            ownerID :"123456789",
            ownerName : "Asim Khan",
            ownerUserName : "asimkhan17",
            playListName : "Play List Name",
            playlistThumbNail : "../../../resources/images/MuiscAlt2.png",
            songs:[
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "https://archive.org/download/mythium/JLS_ATI.mp3" // spotify ID
                },
                {
                    "title": "All This Is 2",
                    "length": "2:46", //?
                    "url": "https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2?cid=null" // spotify ID
                },
                {
                    "title": "All This Is - 3",
                    "length": "2:46", //?
                    "url": "https://archive.org/download/mythium/JLS_ATI.mp3" // spotify ID
                },
                {
                    "title": "All This Is - 4",
                    "length": "2:46", //?
                    "url": "https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2?cid=null" // spotify ID
                },
                {
                    "title": "All This Is - 5",
                    "length": "2:46", //?
                    "url": "https://archive.org/download/mythium/JLS_ATI.mp3" // spotify ID
                },
                {
                    "title": "All This Is - 6",
                    "length": "2:46", //?
                    "url": "https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2?cid=null" // spotify ID
                },
                {
                    "title": "All This Is - 7",
                    "length": "2:46", //?
                    "url": "https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2?cid=null" // spotify ID
                }

            ]
        };

        function init () {
            console.log('playlistController init');


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
          //  $('.plSel').removeClass('plSel');
          //  $('#plList li:eq(' + id + ')').addClass('plSel');
           // npTitle.text(tracks[id].name);
            vm.nowPlayingTitle = vm.playlist.songs[id].title;
            vm.index = id;
            vm.audio.src = $sce.trustAsResourceUrl(vm.playlist.songs[id].url);
        }



    }
})();