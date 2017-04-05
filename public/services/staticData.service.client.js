(function () {
    angular
        .module("WebDevMusicApp")
        .factory("StaticDataService", StaticDataService);

    function StaticDataService() {
        var userTypeOptions = [
            {
                "userType": "M",
                "label": "Music Company/Singer"
            }, {
                "userType": "E",
                "label": "Event Organiser"
            }, {
                "userType": "U",
                "label": "Music Lover"
            }
        ];
        var api = {
            "imageWidthOptions": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
            "youtubeWidthOptions": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
            "headerSizeOptions": [1, 2, 3, 4, 5, 6],
            "getWidgetTypeLabelName": getWidgetTypeLabelName,
            "userTypeOptions": userTypeOptions
        };

        return api;

        function getWidgetTypeLabelName(widgetType) {
            var element = widgetOptions.find(function (element) {
                if (element.widgetType === widgetType) {
                    return element;
                }
            });
            return angular.copy(element.label);
        }

    }

})();