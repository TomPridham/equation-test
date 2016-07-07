`use strict`;
import angular from 'angular';
import {Chart} from 'chart.js'
import { keys } from '../keys.js';

angular.module("myApp").controller("homeController", ($scope, $http, $q) => {
    let ctx = document.getElementById("myChart");
    $scope.count = 0;

    let data2 = [];
    let myChart;

    $http.get('https://opendata.utah.gov/resource/9heb-s7ea.json', keys).then(
        (req)=> {
            req.data.forEach(datum => {
                data2.push({"x": datum.adequately_immunized, "y": datum.school_district});
            });

        }, (req, res)=> {
        });

    $scope.move = (count) => {
        // console.log(data);
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    };
});