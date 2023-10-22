$(document).ready(function () {
    $.get(baseUrl + siteURL.GetAgentPropertyOffersGraph, function (data) {
        console.log(data)
        var labels = [];
        for (var i = 0; i < data.object.labels.length; i++) {
            labels[i] = data.object.labels[i].substring(0, 10) + "..";
        }
        var propertyNames = data.object.labels;
        new Chart(document.getElementById("horizontalBar"), {
            type: "horizontalBar",
            data: {
                //"labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Grey"],
                labels: labels,
                datasets: [{
                    label: "Offers Count",
                    data: data.object.data,
                    fill: true,
                    backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"
                    ],
                    borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
                        "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            max: 50,
                            min: 0,
                            callback: function (label, index, labels) {
                                return label;
                            }
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var label = propertyNames[tooltipItems[0].index];
                            return label;
                        },
                        label: function (tooltipItem, data) {
                            debugger
                            var label = 'Count: ';
                            label += tooltipItem.xLabel;
                            return label;
                        }
                    }
                }
            }
        });

    });

    //line chart
    $.get(baseUrl + siteURL.GetAgentPropertyVisitsGraph, function (data) {
        //console.log(data.object)
        //console.log(data.object.propertyVisitsModel)
        var d1 = data.object.weeks;
        var visitsDetails = data.object.propertyVisitsModel;
        var ctx = document.getElementById("totalVisits");
        ctx.height = 150;
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                //labels: ["January", "February", "March", "April", "May", "June", "July"],
                labels: d1,
                datasets: //[
                    //{
                    //	label: "My First dataset",
                    //	borderColor: "rgba(0,0,0,.09)",
                    //	borderWidth: "1",
                    //	backgroundColor: "rgba(0,0,0,.07)",
                    //	data: [ 22, 44, 67, 43, 76, 45, 12 ]
                    //},
                    //{
                    //	label: "My second dataset",
                    //	borderColor: "#ccc",
                    //	borderWidth: "1",
                    //	backgroundColor: "rgba(0,0,0,.07)",
                    //	data: [2, 14, 67, 23, 6, 45, 12]
                    //}
                    visitsDetails
                //]
            },
            options: {
                //legend: {
                //    display: false
                //},
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 50,
                            min: 0
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var label = visitsDetails[tooltipItems[0].index].fulllabel;
                            return label;
                        },
                        label: function (tooltipItem, data) {
                            var label = 'Count: ' + tooltipItem.yLabel;
                            return label;
                        }
                    }
                }
            }
        });

    });
});
