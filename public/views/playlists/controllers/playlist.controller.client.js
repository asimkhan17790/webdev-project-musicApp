/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("PlayListController",PlayListController);


    function PlayListController($routeParams,currentUser,$location,Upload,$timeout,MusicService,$sce,EmailService,$scope,playListService,UserService) {

        var vm = this;
        vm.playing = false;
        vm.playStatus = "Paused...";
        vm.nowPlayingTitle = "";
        vm.trackCount=0;
        vm.loadTrack = loadTrack;
        vm.previousSong = previousSong;
        vm.nextSong = nextSong;
        vm.playThisSong = playThisSong;
        vm.loadAllMyList = loadAllMyList ;
        vm.deletethisSong = deletethisSong;
        vm.addtothisplaylist =addtothisplaylist ;
        vm.play = play;
        vm.playListId = $routeParams.playListId;
        vm.pid = currentUser._id;
        vm.uid = $routeParams.uid;
        vm.selectedSong = null ;
        vm.index = 0;
        vm.isOwner=null ;
        vm.logout = logout ;

        function init () {
            vm.userId = $routeParams['uid'];
            if(vm.uid == null)
                vm.isOwner = 'yes' ;
            else
                vm.isOwner = 'false' ;
            findAllSongsForPlayList();
        }
        init();
        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
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

        function addtothisplaylist (playList) {
            var songId = vm.selectedSong;
            var playListId = playList._id ;
            var promise = playListService.addSongtoPlayList(songId ,playListId);
            promise.success(function(response) {
                if(response){
                    vm.songaddedsuccess = "song added to the playlist";
                    closeModal() ;
                    init();

                }
            }).error(function (err) {
                vm.error = "Unable to add song in your album";
            })
        }

        function deletethisSong(song) {
            var songId = song._id;
            var promise = playListService.deleteSongFromPlayList(vm.playListId ,songId);
            promise.success(function(response) {
                if(response){
                    init();
                }
            }).error(function (err) {
                vm.error = "Unable to delete the song in the album";
            })
        }

        function loadAllMyList(song) {
            if(vm.pid != null)
            {
                var promise  = UserService.findAllplayList(vm.pid);
                promise.success(function (user) {
                    vm.availablePlaylist = user.data ;
                    console.log(vm.availablePlaylist);
                    vm.selectedSong = song._id ;
                })
                promise.error(function (err) {
                    console.log("some error occured " + err);
                    vm.availablePlaylist = null ;
                })
            }
        }

        function findAllSongsForPlayList() {
            var promise = playListService.findAllSongs(vm.playListId);
            promise.success (function (result) {
                if (result && result.status ==='OK' && result.data && result.data.songs.length > 0) {
                    vm.playlist = result.data;
                    if(!vm.pid)
                        vm.isOwner = 'yes' ;
                    else if((vm.pid !=null) && (vm.playlist.playListOwner ===  vm.pid))
                        vm.isOwner = 'yes' ;
                    else if( (vm.pid !=null) &&(vm.playlist.playListOwner !=  vm.pid))
                        vm.isOwner = null ;
                    loadMp3Player();
                }
                else if(result && result.status==='OK' && result.data && result.data.songs.length == 0){
                    if(vm.audio) {
                        vm.playlist = result.data;
                        vm.audio.pause();
                        vm.audio.src = null;
                        vm.nowPlayingTitle = null;
                        $scope.$apply();
                    }
                    vm.noSongFound = "There are no songs to play in this album";
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
            vm.playlist.playlistThumbNail = vm.playlist.songs[id].songThumb;
            vm.audio.src = $sce.trustAsResourceUrl(vm.playlist.songs[id].songURL);
        }


        function closeModal() {
            $('.modal').modal('hide');
        }



    }
})();