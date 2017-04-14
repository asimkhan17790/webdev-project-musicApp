(function () {
    angular
        .module('WebDevMusicApp')
        .filter('excerpt', function () {
        return function (text, length) {
            if (text.length > length) {
                return text.substr(0, length) + '...';
            }
            return text;
        }
    });
})();
