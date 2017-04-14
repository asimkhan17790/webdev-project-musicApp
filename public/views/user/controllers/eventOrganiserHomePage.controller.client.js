(function() {

    angular
        .module("WebDevMusicApp")
        .controller("EventOrgController",EventOrgController);

    function EventOrgController ($location,EventService, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.createNewEvent = createNewEvent;
        vm.error = null;
        vm.success = null;
        vm.events = null;
        vm.noEventsFound = null;
        vm.closeModal = closeModal;
        function init() {
            console.log('Event Org Page controller');
            getUserDetails ();
            getAllEventsOfUser();

        }
        init();

        function closeModal() {
            vm.error = null;
            vm.success = null;
            vm.noEventsFound = null;
            vm.event = null;
            $('.modal').modal('hide');
        }

        function createNewEvent() {

            if (vm.event) {

                    //call create Service
                    var promise = EventService.createEvent(vm.event,vm.userId);
                    promise.success(function (response) {
                        if (response) {
                            if (response.status === "OK") {
                                vm.success = "Event created successfully";
                                vm.error= null;


                                $timeout(function () {
                                    closeModal();
                                    getAllEventsOfUser ();
                                }, 550);
                            }
                            else {
                                vm.error= response.description;
                                vm.success = null;
                            }
                        }
                        else {
                            vm.error= "Some error occurred";
                            vm.success = null;
                        }
                    });


            }
            else {
                vm.error = "Field missing";
            }
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function getAllEventsOfUser () {

            var promise = EventService.getAllEventsOfUser(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.events = result.data;
                    vm.noEventsFound = null;
                    console.log(vm.events);

                } else {
                    if (result.status==='KO') {
                        if (result.description) {
                            vm.noEventsFound = result.description;
                        } else {
                            vm.noEventsFound = "Some Error Occurred!!";
                        }
                    }
                    else {
                        vm.noEventsFound = "Some Error Occurred!!";
                    }
                    vm.noEventsFound = "Some Error Occurred!!";
                }

            }).error(function () {
                vm.noEventsFound = "Some Error Occurred!!";
            });
        }



    }

})();