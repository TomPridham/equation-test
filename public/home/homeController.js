"use strict";
import  {Chart}  from 'chart.js'
import {keys} from '../../keys.js';

const homeController = function ($scope, $http, $q) {

          Chart.defaults.global.responsive          = true;
          Chart.defaults.global.maintainAspectRatio = true;
          let makeChart                             = (id, type, labels, title, data, opts, colors)=> {
              //
              if (!colors) {
                  colors = [];
              }
              return new Chart(document.getElementById(id), {
                  type: type,
                  data: {
                      labels: labels,
                      datasets: [{
                          label: title,
                          data: data,
                          borderWidth: 1,
                          backgroundColor: colors
                      }]
                  },
                  options: opts
              });
          };
          $scope.count                              = 0;
          let immunizationData                      = {labels: {}, data: []};
          let cleanedImmunizationData               = {labels: [], data: []};
          let censusData                            = {labels: [], data: []};
          let mergedData                            = {labels: [], data: [], colors: []};
          let colors                                = [];
          let districtMap                           = {
              "Beaver": "Beaver",
              "Box Elder": "Box Elder",
              "Cache": "Cache",
              "Logan": "Cache",
              "Carbon": "Carbon",
              "Daggett": "Daggett",
              "Davis": "Davis",
              "Duchesne": "Duchesne",
              "Emery": "Emery",
              "Garfield": "Garfield",
              "Grand": "Grand",
              "Iron": "Iron",
              "Juab": "Juab",
              "Tintic": "Juab",
              "Kane": "Kane",
              "Millard": "Millard",
              "Morgan": "Morgan",
              "Piute": "Piute",
              "Rich": "Rich",
              "Canyons": "Salt Lake",
              "Granite": "Salt Lake",
              "Jordan": "Salt Lake",
              "Murray": "Salt Lake",
              "Salt Lake": "Salt Lake",
              "San Juan": "San Juan",
              "North Sanpete": "Sanpete",
              "South Sanpete": "Sanpete",
              "Sevier": "Sanpete",
              "North Summit": "Summit",
              "Park City": "Summit",
              "South Summit": "Summit",
              "Tooele": "Tooele",
              "Uintah": "Uintah",
              "Alpine": "Utah",
              "Nebo": "Utah",
              "Provo": "Utah",
              "Wasatch": "Wasatch",
              "Washington": "Washington",
              "Wayne": "Wayne",
              "Ogden": "Weber",
              "Weber": "Weber"
          };

          //gets immunization data
          let immPromise = $http.get('https://opendata.utah.gov/resource/9heb-s7ea.json', keys).then(
              (res)=> {
                  let index = 0;
                  res.data.forEach(datum => {
                      if (datum.school_district === "Charter/private") {

                      } else {
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
                      }
                  });

                  index                   = immunizationData.labels;
                  immunizationData.labels = [];
                  //get percentage immunized and format labels
                  for (let key in index) {
                      immunizationData.labels[index[key]] = key;
                      immunizationData.data[index[key]]   = (immunizationData.data[index[key]][0] / immunizationData.data[index[key]][1]).toFixed(2);

                  }
                  console.log('done');
              }, ()=> {
                  alert("Woops, something went wrong! Refresh?");
              }).then(()=> {
                  makeChart("chart-1", "bar", immunizationData.labels, "Immunization Rates By District", immunizationData.data,
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
          ).then(()=> {
              for (let i = 0; i < immunizationData.data.length; i++) {
                  if (immunizationData.data[i] < .91) {
                      cleanedImmunizationData.data.push(immunizationData.data[i]);
                      cleanedImmunizationData.labels.push(immunizationData.labels[i]);
                  }
              }
              makeChart("chart-2", "bar", cleanedImmunizationData.labels, "Immunization Rates By District", cleanedImmunizationData.data,
                  {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  min: .5,
                                  max: 1
                              }
                          }]
                      }
                  }
              )
          });


//get census data
          let cenPromise = $http.get('https://opendata.utah.gov/resource/byga-7rfv.json', keys).then(
              (res)=> {
                  res.data.forEach(datum => {
                      if (datum.people_quickfacts != "Utah") {
                          //add to labels
                          censusData.labels.push((datum.people_quickfacts).match(/(.*)County/)[1].trim());
                          //add income at index
                          censusData.data.push(Number(datum.median_household_income_2009_2013));
                      }

                  });

              }, (res)=> {
              }).then(()=> {
                  makeChart("chart-3", "bar", censusData.labels, "Household Income by County", censusData.data,
                      {
                          scales: {
                              yAxes: [{
                                  ticks: {
                                      beginAtZero: false
                                  }
                              }]
                          }
                      }
                  );

                  censusData.data.forEach(datum=> {
                      let r, g, b = 0;
                      let mid     = 45000;
                      if (datum > mid) {
                          // green to yellow
                          r = Math.floor(255 * ((mid - Number(datum) % mid) / mid));
                          g = 255;

                      } else {
                          // yellow to red
                          r = 255;
                          g = Math.floor(255 * (Number(datum) / mid));
                      }
                      colors.push("rgba(" + r + "," + g + "," + b + ", 0.6)");
                  })
              }
          );

          $q.all([immPromise, cenPromise]).then(()=> {
                  for (let i = 0; i < cleanedImmunizationData.data.length; i++) {
                      mergedData.labels.push(cleanedImmunizationData.labels[i]);
                      mergedData.data.push(cleanedImmunizationData.data[i]);
                      //find county that matches district
                      let temp = districtMap[mergedData.labels[i]];

                      for (let j = 0; j < censusData.labels.length; j++) {

                          if (temp === censusData.labels[j]) {
                              mergedData.colors.push(colors[j]);
                              break;
                          }
                      }
                  }
                  makeChart("chart-4", "bar", mergedData.labels, "Immunization Rates By District", mergedData.data, {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  min: .5,
                                  max: 1
                              }
                          }]
                      }
                  }, mergedData.colors);
              }
          )
          ;

          $scope.move = num => {
              $scope.count += num;

              document.getElementById("page-" + $scope.count).scrollIntoView();
          };
      };

export {homeController}