`use strict`;
import  Chart  from 'chart.js'
import { keys } from '../../keys.js';

module.exports = function ($scope, $http, $q) {

    Chart.defaults.global = {
        responsive: true,
        maintainAspectRatio: true

    };
    let ctx = document.getElementById("myChart");
    $scope.count = 0;

    let data2 = {labels: {}, data:[]};
    let myChart;

    //gets immunization data
    $http.get('https://opendata.utah.gov/resource/9heb-s7ea.json', keys).then(
        (req)=> {
            console.log(Object.keys(data2.labels).length);
            let index =0;
            req.data.forEach(datum => {
                //if it's a new district
                if (data2.labels[datum.school_district] === undefined) {
                    //add to labels
                    data2.labels[datum.school_district] = Object.keys(data2.labels).length;
                    //add kids at index
                    data2.data.push([Number(datum.of_students_adequately_immunized_all_six_vaccines), Number(datum.total_students_enrolled)]);
                } else{
                    //assign index to shorten
                    index = data2.labels[datum.school_district];
                    //add kids from matching district to dataset
                    data2.data[index] = [data2.data[index][0] + Number(datum.of_students_adequately_immunized_all_six_vaccines), data2.data[index][1] + Number(datum.total_students_enrolled)];
                }
            });

            //get percentage immunized
            for (let i = 0; i < data2.data.length; i++) {
                data2.data[i] = data2.data[i][0]/data2.data[i][1];
            }
            console.log(data2)

        }, (req, res)=> {
        });

    $scope.move = (count) => {
        // console.log(data);
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data2.districts,
                datasets: [{
                    label: '# of Votes',
                    data: [],
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
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };
};