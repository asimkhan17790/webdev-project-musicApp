/**
 * Created by sumitbhanwala on 4/4/17.
 */

/**
 * Created by sumitbhanwala on 3/22/17.
 */
module.exports = function () {
    var model = {
        UserModel : require("./user/user.model.server.js")(),
        albumModel : require("./album/album.model.server.js")(),
        playListModel : require("./playList/playlist.model.server.js")(),
        songModel : require("./song/song.model.server.js")(),
    }
    return model;
}