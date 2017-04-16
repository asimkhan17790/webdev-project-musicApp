(function() {
    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("HomePageSingerController",HomePageSingerController);

    function HomePageSingerController ($sce,$scope ,currentUser,$location,UserService,MusicService, albumService ,$routeParams,StaticDataService ,$timeout,EventService) {
        var vm = this;
        vm.userId = currentUser._id;
        vm.deleteAlbum = deleteAlbum ;
        vm.logout = logout ;
        vm.playing = false;
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
        function init() {
            searchNearByEvents();
           // searchAllPlaylists();
            getUserDetails ();
            getMusicUpdates();
            findAllAlbums();
        }
        init();
        function findAllAlbums() {
            var promise = UserService.findAllAlbums(vm.userId);
            promise.success(function (response) {
                if (response && response.status ==='OK') {
                    vm.albums = response.data;
                    vm.error = null;
                    if (vm.albums.length > 0) {
                        findAllSongsForAlbum(vm.albums[0]._id);
                       // var i;
                        /*for (i = 0;i<albums.length;i++) {
                            findAllSongsForAlbum([]);
                        }*/
                    }
                    else {
                        vm.songError = "No Songs to display"
                    }
                }
                else {
                    vm.albums = null;
                    if (response.description) {
                        vm.error = response.description;
                    }
                    else {
                        vm.error = "Some Error Occurred" ;
                    }
                }

            }).error(function (err) {
                vm.error = "Some Error Occurred" ;
            })
        }
        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function closeModal() {
            $('.modal').modal('hide');
        }

        function searchNearByEvents() {
            console.log('searchNearByEvents');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var cord = {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    };
                    var inputFilter = {
                        cords : cord
                    }
                    callSearchEventService(inputFilter);

                }, function (error) {
                    console.log(error);
                    callSearchEventService(null);
                });
            } else {
                console.log('Geolocation is not supported by this browser.');
                callSearchEventService(null);
                return null;
            }
        }
        function callSearchEventService(inputFilter) {
            var promise =  EventService.searchNearByEvents(inputFilter);
            promise.success(function (response) {
                console.log(response);
                vm.events = response.events;

            }).error(function (error) {
                console.log(error);
            });
        }
        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
        }

        function closeModal() {
            $('.modal').modal('hide');
        }

        function getMusicUpdates() {
            var promise = MusicService.getMusicUpdates();
            promise.success(function (response) {

                if (response.status=='ok') {
                    vm.musicArticles = response.articles;
                    console.log(vm.musicArticles);
                  //  geenerateNewsWidget();
                }else {
                    vm.musicArticles = null;
                }
            }).error(function (err) {
                vm.musicArticles = null;
            });
        }

        function deleteAlbum(album) {
            var promise = albumService.deleteAlbum(album);
            promise.success(function(album) {
                if(album){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "Album Not found";
            })
        }

        function loadMp3Player() {
            if (vm.album && vm.album.songs && vm.album.songs.length > 0) {
                vm.nowPlayingTitle = vm.album.songs[0].title;
                vm.trackCount = vm.album.songs.length;
            }
            vm.audio = angular.element(document.querySelector('#audio1')).bind('play', vm.play).bind('pause', function () {
                vm.playing = false;
                vm.playStatus = "Paused...";
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
        function loadAllMyList(song) {
            if(vm.pid != null)
            {
                var promise  = UserService.findAllplayList(vm.pid);
                promise.success(function (user) {
                    vm.availablePlaylist = user.data ;
                    console.log(vm.availablePlaylist);
                    vm.selectedSong = song._id ;
                }).error(function (err) {
                    console.log("some error occured " + err);
                    vm.availablePlaylist = null ;
                })
            }
        }

        function findAllSongsForAlbum(albumid) {
            console.log("Finding songs for " + albumid);
            var promise = albumService.findAllSongs(albumid);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data &&
                    result.data.songs.length > 0) {
                    //     console.log(result.data);
                    vm.album = result.data;
                    console.log("Length: " + result.data.songs.length);
                    console.log(vm.album);
                    console.log(vm.userId);

                    // if( vm.pid == null)
                    //     vm.isOwner = true ;
                    // if((vm.pid !=null) && (vm.album.albumOwner ===  vm.pid))
                    //      vm.isOwner = true ;
                    //  else if( (vm.pid !=null) &&(vm.album.albumOwner !=  vm.pid))
                    //      vm.isOwner = false ;
                    console.log(vm.isOwner);
                    loadMp3Player();
                }
                else if(result && result.status==='OK' && result.data && result.data.songs.length == 0){
                    if(vm.audio) {
                        vm.audio.pause();
                    }
                    console.log("Length: " + result.data.songs.length);
                    vm.noSongFound = "There are no songs to play in this album";
                }else {
                    vm.error = "Some Error Occurred!! Please try again!";
                    console.log("Some Error Occurred!! Please try again!");
                }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
                console.log("Some Error Occurred!! Please try again!");
            });
        }

        // recently added code check this end to end clearly and maybe this should go in the init block
        // check if the albums are listed correctly or not
        function createalbum() {
            vm.album.albumOwner =  vm.userId;
            var promise = albumService.createalbum(vm.album);
            promise.success(function(album) {
                if(album){
                    closeModal();
                    vm.album = {};
                    $timeout(function () {
                    // probably will handle the redirection to the
                     // album default page
                        init();
                    }, 250);
                }
            }).error(function (err) {
                vm.error = "User Not found";
            })
        }

        function getTrsustedURL (url) {
           return  $sce.trustAsResourceUrl(url);
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
            //  $('.plSel').removeClass('plSel');
            //  $('#plList li:eq(' + id + ')').addClass('plSel');
            // npTitle.text(tracks[id].name);
            vm.nowPlayingTitle = vm.album.songs[id].title;
            vm.index = id;
            vm.audio.src = $sce.trustAsResourceUrl(vm.album.songs[id].songURL);
        }
    }

})();