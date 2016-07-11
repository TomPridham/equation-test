"use strict";

global.jQuery = require("jquery");
require("bootstrap");
const angular = require("angular");
require("angular-ui-router");
const homeController = require("./home/homeController.js");

angular.module("myApp", ["ui.router"]);
angular.module("myApp").controller("HomeController", ["$scope", "$http", "$q", homeController]);
angular.module("myApp").config(($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "routes/Home.html",
            controller: "HomeController"
        })

});

