(function () {
    angular
        .module("WebDevMusicApp")
        .factory("StaticDataService", StaticDataService);

    function StaticDataService() {
        var widgetOptions = [
            {
                "widgetType": "HEADER",
                "label": "Header"
            }, {
                "widgetType": "IMAGE",
                "label": "Image"
            }, {
                "widgetType": "YOUTUBE",
                "label": "YouTube"
            }, {
                "widgetType": "HTML",
                "label": "Html"
            },
            {
                "widgetType": "TEXT",
                "label": "Text"
            }
        ];
        var api = {
            "imageWidthOptions": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
            "youtubeWidthOptions": ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
            "headerSizeOptions": [1, 2, 3, 4, 5, 6],
            "widgetOptions": widgetOptions,
            "getWidgetTypeLabelName": getWidgetTypeLabelName
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