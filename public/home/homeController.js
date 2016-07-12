"use strict";
import  {Chart}  from 'chart.js'
import {keys} from '../../keys.js';

const homeController = function ($scope, $http, $q) {

          Chart.defaults.global.responsive          = true;
          Chart.defaults.global.maintainAspectRatio = true;
          let makeChart                             = (id, type, labels, data, opts)=> {
              // debugger;
              return new Chart(document.getElementById(id), {
                  type: type,
                  data: {
                      labels: labels,
                      datasets: [{
                          data: data,
                          borderWidth: 1
                      }]
                  },
                  options: opts
              });
          };
          $scope.count                              = 0;
          let immunizationData                      = {labels: {}, data: []};
          let censusData                            = {labels: [], data: []};
          let ids                                   = ["pageZero", "pageOne", "pageTwo", "pageThree", "pageFour"];

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
                  console.log('done');
              }, ()=> {
                  alert("Woops, something went wrong! Refresh?");
              }).then(()=> {
                  makeChart("chart-1", "bar", immunizationData.labels, immunizationData.data,
                      {
                          scales: {
                              yAxes: [{
                                  ticks: {
                                      beginAtZero: true
                                  }
                              }]
                          }
                      }
                  )
              }
          );


//get census data
          $http.get('https://opendata.utah.gov/resource/byga-7rfv.json', keys).then(
              (res)=> {
                  res.data.forEach(datum => {
                      if (datum.people_quickfacts != "Utah") {
                          //add to labels
                          censusData.labels.push((datum.people_quickfacts).match(/(.*)County/)[0].trim());
                          //add income at index
                          censusData.data.push(Number(datum.median_household_income_2009_2013));
                      }

                  });

              }, (res)=> {
              }).then(()=> {
                  makeChart("chart-2", "bar", censusData.labels, censusData.data,
                      {
                          scales: {
                              yAxes: [{
                                  ticks: {
                                      beginAtZero: false
                                  }
                              }]
                          }
                      }
                  )
              }
          );

          $scope.move = num => {
              $scope.count += num;

              document.getElementById("page-" + $scope.count).scrollIntoView();
          };
      };

export {homeController}