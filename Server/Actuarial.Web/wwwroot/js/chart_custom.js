//<!--Rainfall and Evaporation echarts init-->
var dom = document.getElementById("totalProperties");
var rainChart = echarts.init(dom);
var app = {};
option = null;
$(document).ready(function () {
    $.get(baseUrl + siteURL.GetAgentPropertyGraph, function (data) {
        ////console.log('data', data.object.totalProperties)
        //var bar1 = data.object.totalProperties;
        //var bar2 = data.object.enlistProperties;

        //option = {
        //    color: ['#0be3df', '#3e4f5c'],
        //    tooltip: {
        //        trigger: 'axis'
        //    },
        //    legend: {
        //        data: ['Total', 'Enlist']
        //    },
        //    calculable: true,
        //    xAxis: [
        //        {
        //            type: 'category',
        //            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //        }
        //    ],
        //    yAxis: [
        //        {
        //            type: 'value'
        //        }
        //    ],
        //    series: [
        //        {
        //            name: 'Total',
        //            type: 'bar',
        //            data: bar1,
        //            markPoint: {
        //                data: [
        //                    { type: 'max', name: 'Max' },
        //                    { type: 'min', name: 'Min' }
        //                ]
        //            },
        //            //markLine: {
        //            //    data: [
        //            //        { type: 'average', name: 'Average' }
        //            //    ]
        //            //}
        //        },
        //        {
        //            name: 'Enlist',
        //            type: 'bar',
        //            data: bar2,
        //            //markPoint: {
        //            //    data: [
        //            //        { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
        //            //        { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
        //            //    ]
        //            //},
        //            //markLine: {
        //            //    data: [
        //            //        { type: 'average', name: 'Average' }
        //            //    ]
        //            //}
        //        }
        //    ]
        //};
        //if (option && typeof option === "object") {
        //    rainChart.setOption(option, false);
        //}

        debugger
        var totalProperties = document.getElementById("totalProperties");

        //Chart.defaults.global.defaultFontFamily = "Lato";
        //Chart.defaults.global.defaultFontSize = 18;

        var densityData = {
            label: 'Properties',
            data: data.object.enlistProperties,
            backgroundColor: 'rgba(0, 99, 132, 0.6)',
            borderWidth: 0,
            yAxisID: "y-axis-density"
        };
        var planetData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [densityData]
        };

        var chartOptions = {
            scales: {
                xAxes: [{
                    barPercentage: 1,
                    categoryPercentage: 0.6,
                    ticks: {
                        beginAtZero: true,
                        max: 50,
                        min: 0,
                        callback: function (label, index, labels) {
                            return label;
                        }
                    }
                }
                ],
                yAxes: [{
                    id: "y-axis-density",
                    ticks: {
                        beginAtZero: true,
                        max: 25,
                        min: 0,
                        callback: function (label, index, labels) {
                            return label;
                        }
                    }
                }]
            }
        };

        var barChart = new Chart(totalProperties, {
            type: 'bar',
            data: planetData,
            options: chartOptions
        });
    });
    $.get(baseUrl + siteURL.GetPropertySaleGraph, function (data) {

        var labels = [];
        for (var i = 0; i < data.object.labels.length; i++) {
            labels[i] = data.object.labels[i].substring(0, 4) + "..";
        }
        var propertyNames = data.object.labels;
        var ctx = document.getElementById("salesLineChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Amount',
                    //data: [1121212122, 1121212129, 312121212, 121212125, 1212121212, 3],
                    data: data.object.data,
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
                            beginAtZero: true,
                            callback: function (label, index, labels) {
                                //    alert(label + "--" + index + "--" + labels)
                                return numeral(label).format('$0,0a');
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var label = propertyNames[tooltipItems[0].index];
                            return label;
                        },
                        label: function (tooltipItem, data) {
                            var label = 'Amount: ';
                            label += numeral(Math.round(tooltipItem.yLabel * 100) / 100).format('($0,0)');
                            return label;
                        }
                    }
                }
            }
        });



        //console.log('data', data.object.totalProperties)

        //debugger
        //option = {
        //    color: ['#0be3df', '#3e4f5c'],
        //    tooltip: {
        //        trigger: 'axis'
        //    },
        //    legend: {
        //        data: ['Total Sales',]
        //    },
        //    calculable: true,
        //    xAxis: [
        //        {
        //            type: 'category',
        //            //data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        //            data: labels
        //        }
        //    ],
        //    yAxis: [
        //        {
        //            type: 'value'
        //        }
        //    ],
        //    series: [
        //        {
        //            name: 'Total',
        //            type: 'bar',
        //            data: data.object.data,
        //            markPoint: {
        //                data: [
        //                    { type: 'max', name: 'Max' },
        //                    { type: 'min', name: 'Min' }
        //                ]
        //            }
        //        }
        //    ]
        //};
        //if (option && typeof option === "object") {
        //    salesChart.setOption(option, false);
        //}
    });

});

var map = AmCharts.makeChart("mapdiv", {
    type: "map",
    theme: "dark",
    projection: "mercator",
    panEventsEnabled: true,
    backgroundColor: "#fff",
    backgroundAlpha: 1,
    zoomControl: {
        zoomControlEnabled: true
    },
    dataProvider: {
        map: "worldHigh",
        getAreasFromMap: true,
        areas:
            []
    },
    areasSettings: {
        autoZoom: true,
        color: "#B4B4B7",
        colorSolid: "#84ADE9",
        selectedColor: "#84ADE9",
        outlineColor: "#666666",
        rollOverColor: "#9EC2F7",
        rollOverOutlineColor: "#000000"
    }
});

