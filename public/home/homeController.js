"use strict";
import  Chart  from 'chart.js'
import {keys} from '../../keys.js';

module.exports = function ($scope, $http) {

    Chart.defaults.global.responsive          = true;
    Chart.defaults.global.maintainAspectRatio = true;
    $scope.count                              = 0;
    let immunizationData                      = {labels: {}, data: []};
    let censusData                            = {labels: [], data: []};
    let charts                                = ["chart1", "chart2", "chart3", "chart4"];
    let ids                                   = ["pageOne", "pageTwo", "pageThree", "pageFour"];
    let data                                  = [immunizationData, censusData];
    let options                               = [
        {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
        {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    ];
    let myChart;

    //gets immunization data
    $http.get('https://opendata.utah.gov/resource/9heb-s7ea.json', keys).then(
        (res)=> {
            let index = 0;
            res.data.forEach(datum => {
                //if it's a new district
                if (immunizationData.labels[datum.school_district] === undefined) {
                    //add to labels
                    immunizationData.labels[datum.school_district] = Object.keys(immunizationData.labels).length;
                    //add kids at index
                    immunizationData.data.push([Number(datum.of_students_adequately_immunized_all_six_vaccines), Number(datum.total_students_enrolled)]);
                } else {
                    //assign index to shorten code
                    index                        = immunizationData.labels[datum.school_district];
                    //add kids from matching district to dataset
                    immunizationData.data[index] = [immunizationData.data[index][0] + Number(datum.of_students_adequately_immunized_all_six_vaccines), immunizationData.data[index][1] + Number(datum.total_students_enrolled)];
                }
            });

            index                   = immunizationData.labels;
            immunizationData.labels = [];
            //get percentage immunized and format labels
            for (let key in index) {
                immunizationData.labels[index[key]] = key;
                immunizationData.data[index[key]]   = immunizationData.data[index[key]][0] / immunizationData.data[index[key]][1];

            }
        }, (req, res)=> {
        });

    //get census data
    $http.get('https://opendata.utah.gov/resource/byga-7rfv.json', keys).then(
        (res)=> {
            res.data.forEach(datum => {

                //add to labels
                censusData.labels.push((datum.people_quickfacts).match(/(.*)County/)[0].trim());
                //add income at index
                censusData.data.push(Number(datum.median_household_income_2009_2013));
            });
        }, (req, res)=> {

        });

    $scope.move = (num) => {
        $scope.count += num;


        myChart = new Chart(document.getElementById(charts[$scope.count - 1]), {

            type: 'line',
            data: {
                labels: data[$scope.count - 1].labels,
                datasets: [{
                    label: '# of Votes',
                    data: data[$scope.count - 1].data,
                    borderWidth: 1
                }]
            },
            options: options[$scope.count - 1]
        });
        console.log(document.getElementById(ids[$scope.count - 1]).offsetTop);
        let myElement                                  = document.getElementById(ids[$scope.count - 1]);
        document.getElementById('container').scrollTop = myElement.offsetTop;
    };
}
;