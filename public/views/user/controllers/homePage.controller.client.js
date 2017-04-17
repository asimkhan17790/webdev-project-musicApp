(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("HomePageController",HomePageController);


    function HomePageController (EmailService,EventService ,currentUser,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location) {


        var vm = this;
        vm.userId = currentUser._id;
        //playlist
        vm.playing = false;
        vm.playStatus = "Paused...";
        vm.nowPlayingTitle = "";
        vm.trackCount=0;
        vm.loadTrack = loadTrack;
        vm.previousSong = previousSong;
        vm.nextSong = nextSong;
        vm.playThisSong = playThisSong;
        vm.play = play;
        vm.selectedSong = null ;
        vm.index = 0;
        vm.deletethisSong = deletethisSong;
        vm.searchNearByEvents = searchNearByEvents;
        vm.createplayList = createplayList ;
        vm.deleteplayList = deleteplayList ;
        vm.editProfile = editProfile ;
        vm.error = null;
        vm.songError = null;
        vm.user = null;
        vm.getTrsustedURL = getTrsustedURL;
        vm.followers = null ;
        vm.following = null ;
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.sendEmailInvitation = sendEmailInvitation;
        vm.closeModal = closeModal;
        vm.logout = logout ;
        vm.searchSongs = searchSongs;
        vm.redirectToSearchedSong = redirectToSearchedSong;
        function init() {

            searchNearByEvents();
            getUserDetails ();
            getMusicUpdates();
            findAllPlayList();
        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function sendEmailInvitation () {
            var emailInput = {
                emailAddress: vm.invitationEmail,
                firstName : vm.user.firstName
            };
            var promise = EmailService.sendEmailInvitation(emailInput);
            promise.success (function (result) {
                if (result && result.status === 'OK') {
                    if (result.description) {
                        vm.emailSuccess = result.description;
                    }
                    else {
                        vm.emailSuccess = 'Congrats...Your invitation has been sent successfully!!';
                    }
                    vm.invitationEmail = null;
                    /*  $timeout(function () {
                     closeModal();
                     }, 2000);*/
                } else {
                    vm.emailSuccess = null;
                    vm.emailError = "Some Error Occurred";
                }
            }).error(function () {
                vm.emailSuccess = null;
                vm.emailError = "Some Error Occurred";
            });
        }

        function clearUserFromModal() {
            vm.users = null;
            vm.inputSong = null;
            vm.error = null;
            vm.inputQuery = null;
            vm.invitationEmail = null;
            vm.emailSuccess = null;
            vm.emailError = null;
            vm.songError = null;
            vm.searchedSongs=null;
        }

        function redirectToSearchedUser(userId2) {
            var promise = UserService.findUserById(userId2);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    var searchedUser = result.data;
                    closeModal();
                    $timeout(function () {
                        if(searchedUser.userType == 'U')
                            $location.url("/user/userSearch/"+userId2);
                        else if(searchedUser.userType == 'M')
                        {
                            $location.url("/user/singerSearch/"+userId2);
                        }
                    }, 250);
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function searchUsers () {
            var promise = UserService.searchUsers(vm.inputQuery ,vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.users = result.data;
                    vm.error = null;
                } else {
                    vm.users = null;
                    vm.error = "No user found !!";
                }
            }).error(function () {
                vm.users = null;
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function searchSongs () {
            var promise = MusicService.searchSongs(vm.inputSong);
            promise.success (function (result) {
                if (result && result.status === 'OK' && result.data && result.data.length > 0) {
                    vm.searchedSongs = result.data;
                    vm.songError = null;
                } else {
                    vm.searchedSongs = null;
                    vm.songError = "No such song found !!";
                }
            }).error(function () {
                vm.searchedSongs = null;
                vm.songError = "Some Error Occurred!! Please try again!";
            });
        }
        function redirectToSearchedSong (selectedSong) {

            closeModal();
            $timeout(function () {
                if (selectedSong.origin === 'mymusic') {
                    $location.url("/music/song/songDetails/"+selectedSong._id);
                }
            }, 250);



            console.log('redirecting');
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    findAllSongsForPlayList();
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
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
        function findAllPlayList() {
            var promise = UserService.findAllplayList(vm.userId);
            promise.success(function (user) {
                vm.playLists = user.playList ;
                console.log(vm.playLists);

            })
            promise.error(function (err) {
                console.log("some error occured " + err);
                vm.playLists = null ;
            })
        }

        function editProfile() {
            $location.url("/user/editProfile/"+vm.userId);
        }

        function closeModal() {
            vm.songError = null;
            vm.inputSong = null;
            vm.inputQuery = null;
            vm.invitationEmail = null;
            vm.emailSuccess = null;
            vm.emailError = null;
            $('.modal').modal('hide');
            vm.searchedSongs = null;
        }
        function deleteplayList(playList) {
            var promise = playListService.deleteplayList(playList);
            promise.success(function(playList) {
                if(playList){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "PlayList Not found";
            })
        }

        function createplayList() {
            vm.playlist.playListOwner =  vm.userId;
            var promise = playListService.createplayList(vm.playlist);
            promise.success(function(playlist) {
                if(playlist){
                    closeModal();
                    vm.playlist = {};
                    $timeout(function () {
                        init();
                    }, 250);
                }
            })
            promise.error(function (err) {
                vm.error = "User Not found";
            })
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

        function getTrsustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }


        // playlist

        function findAllSongsForPlayList() {
            var promise = playListService.findAllSongs(vm.user.favPlayList);
            promise.success (function (result) {
                if (result && result.status ==='OK' && result.data && result.data.songs.length > 0) {
                    vm.playlist = result.data;
                    loadMp3Player();
                }
                else if(result && result.status==='OK' && result.data && result.data.songs.length == 0){
                    if(vm.audio) {
                        vm.audio.pause();
                        vm.playlist = result.data;
                        vm.audio.pause();
                        vm.audio.src = null;
                        vm.nowPlayingTitle = null;
                        $scope.$apply();
                    }
                    vm.noSongFound = "There are no songs to play in this Playlist";
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
        function deletethisSong(song) {
            var songId = song._id;
            var promise = playListService.deleteSongFromPlayList(vm.user.favPlayList ,songId);
            promise.success(function(response) {
                if(response){
                    init();
                }
            }).error(function (err) {
                vm.error = "Unable to delete the song in the album";
            })
        }

        function loadTrack(id) {
            vm.nowPlayingTitle = vm.playlist.songs[id].title;
            vm.index = id;
            vm.playlist.playlistThumbNail = vm.playlist.songs[id].songThumb;
            vm.audio.src = $sce.trustAsResourceUrl(vm.playlist.songs[id].songURL);
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
    }

})();