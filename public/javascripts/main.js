$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'web.yy.com接口质量'
        },
        subtitle: {
            text: '数据来源: mongoDB'
        },
        xAxis: {
            categories: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00',
                '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            tickmarkPlacement: 'on'
        },
        yAxis: {
            title: {
                text: '接口错误数'
            },
            crosshair: true,
            min: 0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: '任务体系',
            marker: {
                symbol: 'square'
            },
            data: window.chartData.taskSystem
        }, {
            name: '碎钻商城',
            marker: {
                symbol: 'diamond'
            },
            data: window.chartData.weektask
        }]
    });
});


$(function () {
    $('#container_error').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: '接口错误占比',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
        },
        tooltip: {
            headerFormat: '{series.name}<br>',
            pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%']
            }
        },
        series: [{
            type: 'pie',
            name: '错误占比',
            innerSize: '50%',
            data: [
                ['queryHouNobleUserList：42',   42],
                ['qryNobleIdentity：37',   37]
            ]
        }]
    });
});
