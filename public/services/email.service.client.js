(function () {
    angular
        .module("WebDevMusicApp")
        .factory("EmailService", EmailService);

    function EmailService($http) {

        var api = {
            sendEmail: sendEmail
        };

        return api;

       function sendEmail (emailObject) {
           return $http.post("/api/email/", emailObject);
       }

    }

})();