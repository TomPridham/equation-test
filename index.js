`use strict`;
const angular = require('angular');
angular.module("myApp", ["ui.router"]);
// require("./home/homeController");

angular.module("myApp").config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "routes/Home.html",
            controller: "homeController"
        })

});