(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("MusicRecorderController", MusicRecorderController);

    function MusicRecorderController (UserService,EmailService, $sce,currentUser,$timeout,Upload,MusicService,$routeParams,playListService,$location) {

        var vm = this;
        vm.userId = currentUser._id;
        vm.recordAudio = recordAudio;
        vm.stopRecording = stopRecording;
        vm.getTrustedHtml = getTrustedHtml;
        vm.recordAndSearch = recordAndSearch;
        vm.showSpinner = showSpinner;
        vm.findLyrics = findLyrics;
        vm.closeAlert = closeAlert;
        vm.loadAllMyList = loadAllMyList ;
        vm.addSongToMyPlaylist = addSongToMyPlaylist;
        vm.addSongToFavorites = addSongToFavorites;
        vm.availablePlaylist = null;
        vm.selectedSong = null;
        vm.songSaveError = null;
        vm.songSaveSuccess = null;
        vm.addedToFav = null;
        vm.favError = null;
        vm.favSuccess = null;
        vm.logout = logout ;
        vm.sendEmailInvitation = sendEmailInvitation ;
        vm.closeModal= closeModal;
        vm.clearDataFromModal = clearDataFromModal;
        function init() {
            getUserDetails();
            angular.element(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip({animation: true});
            });
        }
        init();

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

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function closeModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;
            $('.modal').modal('hide');
        }

        function addSongToFavorites() {
            if (!vm.addedToFav) {
                var promise  = playListService.createSongFromSpotify(createSong(),vm.favorite);
                promise.success(function (result) {
                    if (result && result.status === 'OK') {
                        if (result.description) {
                            vm.favSuccess = result.description;
                            vm.favError = null;
                        }
                        else {
                            vm.favSuccess = "Song Successfully Added!!";
                            vm.favError = null;
                        }
                        vm.addedToFav = true;
                        $timeout(function () {
                            vm.favSuccess = null;
                            vm.favError = null;
                        }, 1000);

                    } else {
                        if (result.description) {
                            vm.favError = result.description;
                        }else {
                            vm.favError = "Some Error Occurred";
                        }
                        vm.favSuccess = null;
                        $timeout(function () {
                            vm.favSuccess = null;
                            vm.favError = null;
                        }, 1000);
                    }

                }).error(function (err) {
                    vm.favError = "Some Error Occurred";
                    vm.favSuccess = null;
                    $timeout(function () {
                        vm.favSuccess = null;
                        vm.favError = null;
                    }, 1000);
                });
            }
        }


        function createSong () {
            var artistArray = [];
            vm.music.artists.forEach(function (item) {
                artistArray.push(angular.copy(item.name));
            });
            console.log('trck ID :'+vm.music.spotifyID);
            var newsong = {
                songURL : angular.copy(vm.music.previewURL.$$unwrapTrustedValue()),
                title : angular.copy(vm.music.trackName) ,
                name : angular.copy(vm.music.trackName),
                genre : 'N/A',
                artist : angular.copy(artistArray),
                songThumb : angular.copy(vm.music.imageUrl),
                spotifyID : vm.music.spotifyID
            };
            return newsong;
        }

        function addSongToMyPlaylist(selectedPlayList) {

                var promise  = playListService.createSongFromSpotify(createSong (),selectedPlayList._id);
                promise.success(function (result) {
                    if (result && result.status === 'OK') {
                        if (result.description) {
                            vm.songSaveSuccess = result.description;
                            vm.songSaveError = null;
                        }
                        else {
                            vm.songSaveSuccess = "Song Successfully Added!!";
                            vm.songSaveError = null;
                        }
                        $timeout(function () {
                            closeModal();
                        }, 500);

                    } else {

                        if (result.description) {
                            vm.songSaveError = result.description;
                        }else {
                            vm.songSaveError = "Some Error Occurred";
                        }
                        vm.songSaveSuccess = null;
                        $timeout(function () {
                            vm.songSaveError = null;
                            vm.songSaveSuccess = null;
                        }, 1000);
                    }

                }).error(function (err) {
                    vm.songSaveError = "Some Error Occurred";
                    vm.songSaveSuccess = null;
                });
        }


        function clearDataFromModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;

        }
        function loadAllMyList() {
            if(vm.userId != null)
            {
                var promise  = UserService.findAllplayList(vm.userId);
                promise.success(function (user) {
                    vm.availablePlaylist = user.data ;
                    console.log(vm.availablePlaylist);

                }).error(function (err) {
                    console.log("some error occured " + err);
                    vm.availablePlaylist = null ;
                });
            }
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
            vm.addedToFav = null;
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

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    vm.favorite = result.data.favPlayList;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
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