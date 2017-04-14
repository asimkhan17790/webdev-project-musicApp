(function () {
    angular
        .module("WebDevMusicApp")
        .factory("EmailService", EmailService);

    function EmailService($http) {

        var api = {
            sendEmail: sendEmail,
            sendEmailInvitation : sendEmailInvitation
        };

        return api;

       function sendEmail (emailObject) {
           return $http.post("/api/email/", emailObject);
       }
       function sendEmailInvitation (inputObject) {
           return $http.post("/api/user/sendInvite/", inputObject);
       }

    }
})();