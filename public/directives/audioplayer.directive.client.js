(function () {
    angular
        .module('WebDevMusicApp')
        .directive('wbdvAudioPlayer', audioPlayerDirective);

    function audioPlayerDirective() {

        var startIndex = -1;
        var endIndex = -1;
        function linkFunc(scope, element, attributes) {

            element.bind('play', scope.model.play).bind('pause', function () {
                scope.model.playing = false;
                scope.model.playStatus = "Paused...";
            }).bind('ended', function () {
                scope.model.playStatus = "Paused...";
                if ((scope.model.index + 1) < scope.model.trackCount) {
                    scope.model.index++;
                    loadTrack(scope.model.index);
                    element.play();
                } else {
                    element.pause();
                    scope.model.index = 0;
                    loadTrack(scope.model.index);
                }
            }).get(0);

            function loadTrack(id) {
                //  $('.plSel').removeClass('plSel');
                //  $('#plList li:eq(' + id + ')').addClass('plSel');
                // npTitle.text(tracks[id].name);
                scope.model.nowPlayingTitle = scope.model.playlist.songs[id].title;
                scope.model.index = id;
                scope.model.audio.src = scope.model.playlist.songs[id].url;
            }

            /*element.sortable({
                handle: 'a.handler',
                axis: 'y',
                start: function (event, ui) {
                    startIndex = ui.item.index();
                },
                stop: function (event, ui) {
                    endIndex = ui.item.index();
                    scope.model.reArrangeItems(startIndex,endIndex);
                }});*/
        }
        return {
            link: linkFunc

        };
    }
})();
