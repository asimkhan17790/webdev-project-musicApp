/**
 * Created by sumitbhanwala on 4/4/17.
 */

/**
 * Created by sumitbhanwala on 3/22/17.
 */
module.exports = function () {
    var model = {
        UserModel : require("./user/user.model.server.js")()
    }
    return model;
}