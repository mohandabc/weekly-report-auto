import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { nest } from 'd3-collection';

class Chart 
{
    /**
     * Abstract class 
     * @param {*} data : Data to display in he chart
     * @param {*} container HTML div where to render the chart
     * @param {*} title 
     * @param {*} options a set of display options
     */
    constructor(data, container, title = '', options=null){
        if(this.constructor === Chart){
            throw new Error("FYI: Abstract class 'Chart' cannot be instantiated");
        }

        am4core.options.autoDispose = true;
        this.chart = this.buildChart(data, container, title, options);
    }

    /**
     * Takes data and a container to render a chart in. Each sub objct should impliment this function
     * @param {*} data Chart data
     * @param {*} container html container to render the chart in
     */
    buildChart(data, container, title, options){
        /*override this function to define a chart */
    }


    /**
     * Takes data in the format returned by SQL and adapts it to clustered bar chart
     * First column value of data is considered categories (distinct)
     * Secont column valus are the series
     * Third column value is the value of each serie
     * example : 
     * this array of data
     * [
     *      {type : "Cement", result:"incomplete", count 4},
     *      {type : "Cement", result:"Successful", count 5},
     *      {type : "Cement", result:"Unsuccessful", count 1},
     * 
     *      {type : "MWD", result:"incomplete", count 1},
     *      {type : "MWD", result:"Successful", count 1},
     *      {type : "MWD", result:"Unsuccessful", count 0},
     * ]
     * becomes like this
     * [
     *      {category:'Cement', incomplete:4, Successful:5, Unsuccessful : 1},
     *      {category:'MWD', incomplete:1, Successful:1, Unsuccessful : 0},
     *  ]
     *  
     *  and generates these params object used to create chart series
     *  {
     *      "category": "category",
     *      "series": ["incomplete","succesful","unsuccessful","null"]
     *  }
     * 
     * @param {*} data Data to adept to work with clustered bar chart
     * @returns array of adaptedData and params
     */
    clusteredBarDataAdapter(data){
        let adaptedData = []
        let params = {}

        let nested = nest()
            .key(function(d) {
                return d.type
            })
            
            .entries(data)

        nested.forEach(item =>{
            let init = {}
            init['category'] = item['key'];

            adaptedData.push(item.values.reduce((p, c)=>{
                let ret = {}
                    
                    ret[c[Object.keys(c)[1]]] = c[Object.keys(c)[2]]
                    
                    return {...p,...ret}
                }, init))
        });

        let i = 0;
        let arr = []
        while (i < adaptedData?.length) {
            arr = arr.concat(Object.entries(adaptedData[i]).map(c =>c[0]).slice(1))
            i++;
        }
        arr = arr.filter((item, pos) => arr.indexOf(item) === pos)
        if (adaptedData?.length > 0){
        params = {
            category : Object.keys(adaptedData[0])[0],
            series : arr,
            }
        }
        return [adaptedData, params];
    }
}

export class PieChart extends Chart {
    buildChart(data, container, title, options) {
        /**
         * Please respect the following structure and labels names : [{category:?, value:?}...]
            // Example data format:
                [
                    {
                        "category": "NPT Contractor",
                        "value": 0.375
                    },
                    {
                        "category": "NPT  Service Companies",
                        "value": 1.375
                    },
                    {
                        "category": "NPT Sonatrach",
                        "value": 0.666666666666667
                    }
                ...
                ]
        */
        data = sortData(data);
        let params = {};
        if (data?.length > 0) {
          params = {
            category: Object.keys(data[0])[0],
            value: Object.keys(data[0])[1],
          };
        }
        if (data === undefined || params === {}) {
          return;
        }
      
        let chart = am4core.create(container, am4charts.PieChart);
        chart.innerRadius = am4core.percent(40);
        
        let series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = params?.value;
        series.dataFields.category = params?.category;
        series.ticks.template.disabled = true;
        series.alignLabels = false;
        series.labels.template.text = '[bold]{value.formatNumber("#.##")}';
        series.labels.template.radius = am4core.percent(-25);
        series.labels.template.padding(0, 0, 0, 0);
        series.labels.template.fill = am4core.color('white');
        series.ticks.template.events.on("ready", hideSmall);
        series.ticks.template.events.on("visibilitychanged", hideSmall);
        series.labels.template.events.on("ready", hideSmall);
        series.labels.template.events.on("visibilitychanged", hideSmall);
        series.slices.template.tooltipText = "{category}: {value.formatNumber('#.##')}";
        series.slices.template.stroke = am4core.color("#fff");
        series.slices.template.strokeWidth = 2;
        series.slices.template.strokeOpacity = 1;
        series.slices.template.cursorOverStyle = [
            {
              "property": "cursor",
              "value": "pointer"
            }
          ];

        let shadow = series.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0.1;

        let chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fill = options["title-color"];
        chartTitle.fontSize = 24;
        chartTitle.marginBottom = 10;
        // Add data
        chart.data = data;
      
        let legend = new am4charts.Legend();
        legend.position = "bottom";
        legend.labels.template.fontSize = 11;
        legend.valueLabels.template.fontSize = 11;
        chart.legend = legend;
        chart.legend.valueLabels.template.text = `{value.formatNumber('#.##')} ({value.percent.formatNumber('#.##')}%)`;

        chart.exporting.menu = new am4core.ExportMenu();
        return chart;

        function hideSmall(ev) {
            if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 3)) {
              ev.target.hide();
            }
            else {
              ev.target.show();
            }
          }

        function sortData(data) {
            const sortedData = [...data];
            sortedData.sort(function(a, b) {
                let value = Object.keys(data[0])[1];
                return b[value] - a[value];
            });
            return sortedData;
        }
      }
  }

export class BarChart extends Chart
{
    buildChart(data, container, title, options){
        /**
         * Please respect the following structure and labes names : [{category:?, value:?}...]
            // Example data format:
                const data = [
                                {
                                    "category": "26\"",
                                    "value": 12.38
                                },
                                {
                                    "category": "Inter Phase 26\" - 16\"",
                                    "value": 7.35
                                },
                                {
                                    "category": "16\"",
                                    "value": 5.43
                                }
                            ...
                            ]
        */
        let params = {}
        if (data?.length > 0){
            params = {
                category : Object.keys(data[0])[0],
                value : Object.keys(data[0])[1]
            }
        }
        if (data === undefined || params === {}){
            return;
        }
        
        let chart = am4core.create(container, am4charts.XYChart);
    
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = params?.category;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
    
        categoryAxis.renderer.labels.template.fill = options['label-color'];
    
        let label = categoryAxis.renderer.labels.template;
        label.wrap = false;
        label.truncate = false;
        label.maxWidth = 200;
        label.fontSize = 14;
        categoryAxis.events.on('sizechanged', function (ev) {
            let axis = ev.target;
            var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            var label = axis.renderer.labels.template;
            var rangeTemplate = axis.axisRanges.template;
            var rangeLabel = rangeTemplate.label;
            rangeLabel.fontSize = 14;
            label.fontSize = 14;
            if (cellWidth < label.maxWidth) {
                rangeLabel.rotation = -35;
                rangeLabel.dy = 45;
                label.rotation = -35;
                label.horizontalCenter = 'right';
            } else {
                rangeLabel.rotation = 0;
                rangeLabel.dy = 35;
                label.rotation = 0;
                label.horizontalCenter = 'middle';
            }
        });

        // eslint-disable-next-line
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMax = 0.1;
        valueAxis.stroke = options['stroke-color'];
        valueAxis.renderer.grid.template.stroke = options['stroke-color'];
    
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = params?.value;
        series.dataFields.categoryX = params?.category;
        series.name = params?.value;
        series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
        series.columns.template.fillOpacity = 0.8;
    
        var bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.interactionsEnabled = false;
        bullet.dy = -15;
        bullet.label.text = '[bold]{valueY}';
        bullet.label.fill = am4core.color(options['value-color']);
    
        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
    
        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fill = options['title-color'];
        chartTitle.fontSize = 24;
        chartTitle.marginBottom = 30;
    
        // Add data
        chart.exporting.menu = new am4core.ExportMenu();
        chart.data = data;
        return chart;
    }
}

export class ClusteredBarChart extends Chart
{
    buildChart(data, container, title, options){
        /**
         * Please respect the following structure and labes names : [{type:?, name:?, count:?}...]
        // Example data format:
            const data = [
                            {
                                "type": "Data Recovery", 
                                "name": "MLU Cabin Issue", 
                                "count": 1
                            },
                            {
                                "type": "Data Recovery",
                                "name": "MLU Released", 
                                "count": 1
                            },
                            {
                                "type": "Data Recovery",
                                "name": "MLU-Rig Box Connectivity",
                                 "count": 1
                            }
                        ...
                        ]
        */
        if (data === undefined){
            return
        }
        let [adaptedData, params] = this.clusteredBarDataAdapter(data);
        
        
        if (adaptedData.length === 0 || params === {}){
            return;
        }

        var chart = am4core.create(container, am4charts.XYChart)
        chart.colors.step = 2;
        
        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.extraMax = 0.2;
        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = params.category
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.labels.template.fill= options['label-color'];

        xAxis.renderer.labels.template.horizontalCenter = "right";
        xAxis.renderer.labels.template.verticalCenter = "right";
        xAxis.renderer.labels.template.rotation = -45;
        xAxis.renderer.minGridDistance = 10;

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;
        yAxis.renderer.line.stroke = options['stroke-color'];
        yAxis.renderer.grid.template.stroke = options['stroke-color'];



        function createSeries(value, name) {
            var series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = params.category
            series.name = name
        
            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);
            
            var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.label.dy = -10;
            bullet.label.text = '[bold]{valueY}'
            bullet.label.fontSize= 9;
            
            bullet.label.fill = am4core.color(options['value-color'])
            return series;
        }

        chart.exporting.menu = new am4core.ExportMenu();
        chart.data = adaptedData;
        params.series.forEach(serie => {
            createSeries(serie, serie);
        });



        function arrangeColumns() {

            let series = chart.series.getIndex(0);
        
            var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                var delta = ((x1 - x0) / chart.series.length) * w;
                if (am4core.isNumber(delta)) {
                    var middle = chart.series.length / 2;
        
                    var newIndex = 0;
                    chart.series.each(function(series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = chart.series.indexOf(series);
                        }
                    })
                    var visibleCount = newIndex;
                    var newMiddle = visibleCount / 2;
        
                    chart.series.each(function(series) {
                        var trueIndex = chart.series.indexOf(series);
                        var newIndex = series.dummyData;
        
                        var dx = (newIndex - trueIndex + middle - newMiddle) * delta
        
                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }

        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 24;
        chartTitle.fill = options["title-color"];
        chartTitle.marginBottom = 30;


    }
}

export class StackedBarChart extends Chart
{
    buildChart(data, container, title, options){
        /**
         * * Please respect the following structure and labes names : [{category:?, value1:?, value2:?}...]
            // Example data format:
                const data = [
                                {   
                                    "category": "26\"",
                                    "value1": 5.43, 
                                    "value2": 4.77
                                },
                                {
                                    "category": "Inter Phase 26\" - 16\"", 
                                    "value1": 3.07, 
                                    "value2": 0.18
                                },
                                {
                                    "category": "16\"",
                                     "value1": 4.07,
                                      "value2": 0.06
                                },
                            ...
                            ]
        */
        var chart = am4core.create(container, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data = data
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        let label = categoryAxis.renderer.labels.template;
        label.wrap = false;
        label.truncate = false;
        label.maxWidth = 200;
        label.fontSize = 14;
        categoryAxis.events.on('sizechanged', function (ev) {
            let axis = ev.target;
            var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            var label = axis.renderer.labels.template;
            var rangeTemplate = axis.axisRanges.template;
            var rangeLabel = rangeTemplate.label;
            rangeLabel.fontSize = 14;
            label.fontSize = 14;
            if (cellWidth < label.maxWidth) {
                rangeLabel.rotation = -35;
                rangeLabel.dy = 45;
                label.rotation = -35;
                label.horizontalCenter = 'right';
            } else {
                rangeLabel.rotation = 0;
                rangeLabel.dy = 35;
                label.rotation = 0;
                label.horizontalCenter = 'middle';
            }
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;

        // Create series
        function createSeries(field, name, color) {
        
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "category";
        series.sequencedInterpolation = true;
        if(color){
            series.fill = color;
        }
        
        // Make it stacked
        series.stacked = true;
        
        // Configure columns
        series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
        
        // Add label
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "[bold]{valueY}";
        labelBullet.locationY = 0.5;
        // labelBullet.locationX = name==='PT' ? 0.3 : 0.7;
        labelBullet.label.hideOversized = true;
        labelBullet.label.fill = "#FFF" //series.fill;
        
        return series;
        }

        createSeries("value1", "PT");
        createSeries("value2", "NPT", "#587FBD");


        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 24;
        chartTitle.fill = options["title-color"];
        chartTitle.marginBottom = 30;

        let legend = new am4charts.Legend();
        legend.position = "bottom";
        legend.labels.template.fontSize = 11;
        legend.valueLabels.template.fontSize = 11;
        chart.legend = legend;

        chart.exporting.menu = new am4core.ExportMenu();

        return chart;
    }
}

export class PartionedBarChart extends Chart
{
    buildChart(data, container, title, options){
        /**
         * * Please respect the following structure and labes names : [{part:?, category:?, value:?}...]
            // Example data format:
                const data = [{
                                    shift: "Night",
                                    stand: "stand 1",
                                    speed: 2
                                }, {
                                    shift: "Night",
                                    stand: "stand 2",
                                    speed: 2.5
                                },
                            ]
        */
        let params = {};
        if (data?.length > 0) {
            params = {
            part: Object.keys(data[0])[0],
            category: Object.keys(data[0])[1],
            value: Object.keys(data[0])[2],
            };
        }
        if (data === undefined || params === {}) {
            return;
        }
        var chart = am4core.create(container, am4charts.XYChart);
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = params.category;
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.labels.template.fontSize = 10;
        xAxis.renderer.labels.template.horizontalCenter = "right";
        xAxis.renderer.labels.template.verticalCenter = "right";
        xAxis.renderer.labels.template.rotation = -60;
        xAxis.renderer.minGridDistance = 10;
        xAxis.title.text = "Stand Number";

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = options.leftYaxisTitle;


        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = params.value; // Use valueY for horizontal bar chart
        series.dataFields.categoryX = params.category; // Use categoryX for horizontal bar chart
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;
        series.columns.template.adapter.add("fill", function(fill, target) {
            if (target.dataItem) {
                switch(target.dataItem.dataContext[params.part]) {
                    case "Day":
                        return chart.colors.getIndex(12);
                    case "Night":
                        return chart.colors.getIndex(2);
                    default:break;
                }
            }
            return fill;
        });

        var axisBreaks = {};
        var legendData = [];

        // Add ranges
        function addRange(label, start, end, color) {
            var range = xAxis.axisRanges.create(); // Use xAxis for horizontal bar chart
            range.category = start;
            range.endCategory = end;
            range.label.text = label;
            range.label.disabled = true;
            range.label.fill = color;
            range.label.location = 0;
            range.label.dy = -220; // Adjust dy for horizontal bar chart
            range.label.fontWeight = "bold";
            range.label.fontSize = 12;
            range.label.horizontalCenter = "left";
            range.label.inside = true;

            range.grid.stroke = am4core.color("#396478");
            // range.grid.strokeOpacity = 0.1;
            range.tick.length = 200;
            range.tick.disabled = false;
            // range.tick.strokeOpacity = 0.1;
            range.tick.stroke = am4core.color("#396478");
            range.tick.location = 0;

            range.locations.category = 0;
            var axisBreak = xAxis.axisBreaks.create(); // Use xAxis for horizontal bar chart
            axisBreak.startCategory = start;
            axisBreak.endCategory = end;
            axisBreak.breakSize = 1;
            axisBreak.fillShape.disabled = true;
            axisBreak.startLine.disabled = true;
            axisBreak.endLine.disabled = true;
            axisBreaks[label] = axisBreak;

            legendData.push({ name: label, fill: color });
        }

        let firstItem = data[0];
        let i = 0;
        const DataSize = data.length;
        let currentItem = data[0];
       
        while (i<DataSize-1 && currentItem.shift === firstItem.shift) {
            i+=1;
            currentItem = data[i];
        }
        
        const nightColor = chart.colors.getIndex(2);
        const dayColor = chart.colors.getIndex(12);
    
        addRange(firstItem.shift, firstItem.stand, currentItem.stand, firstItem.shift === 'Night'?nightColor: dayColor);
        if (i<DataSize-1){
            firstItem = data[i+1];
            currentItem = data[DataSize-1];
            addRange(firstItem.shift, firstItem.stand, currentItem.stand, firstItem.shift === 'Night'?nightColor: dayColor);
        }

        chart.cursor = new am4charts.XYCursor();

        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fill = options['title-color'];
        chartTitle.fontSize = 24;
        chartTitle.marginBottom = 30;

        var legend = new am4charts.Legend();
        legend.position = "bottom"; // Change legend position to bottom for better alignment
        legend.scrollable = true;
        legend.align = "center"; // Align legend items to the center
        legend.reverseOrder = true;

        chart.legend = legend;
        legend.data = legendData;

        legend.itemContainers.template.events.on("toggled", function(event) {
            var name = event.target.dataItem.dataContext.name;
            var axisBreak = axisBreaks[name];
            
            if (event.target.isActive) {
                axisBreak.animate({ property: "breakSize", to: 0 }, 1000, am4core.ease.cubicOut);
                xAxis.dataItems.each(function(dataItem) {
                    if (dataItem.dataContext[params.part] === name) {
                        dataItem.hide(1000, 500);
                    }
                });
                series.dataItems.each(function(dataItem) {
                    if (dataItem.dataContext[params.part] === name) {
                        dataItem.hide(1000, 0, 0, ["valueY"]);
                    }
                });
            } else {
                axisBreak.animate({ property: "breakSize", to: 1 }, 1000, am4core.ease.cubicOut);
                xAxis.dataItems.each(function(dataItem) {
                    if (dataItem.dataContext[params.part] === name) {
                        dataItem.show(1000);
                    }
                });
                series.dataItems.each(function(dataItem) {
                    if (dataItem.dataContext[params.part] === name) {
                        dataItem.show(1000, 0, ["valueY"]);
                    }
                });
            }
        });
        return chart;
    }
}

export class ScatterChart extends Chart
{
    buildChart(data, container, title, options){
        let params = {};
        if (data?.length > 0) {
            params = {
            xaxis: Object.keys(data[0])[0],
            yaxis: Object.keys(data[0])[1],
            };
        }
        if (data === undefined || params === {}) {
            return;
        }

        var chart = am4core.create(container, am4charts.XYChart);
        chart.data = data;
        // Create axes

        var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxisX.title.text = 'Connection Time (min)';
        valueAxisX.renderer.minGridDistance = 40;

        // Create value axis
        var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.title.text = 'Tripping Speed (m/h)';

        // Create series
        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.dataFields.valueY = params.yaxis;
        lineSeries.dataFields.valueX = params.xaxis;
        lineSeries.strokeOpacity = 0;

        // Add a bullet
        var bullet = lineSeries.bullets.push(new am4charts.Bullet());

        // Add a triangle to act as am arrow
        var arrow = bullet.createChild(am4core.Container);
        arrow.width = 12;
        arrow.height = 12;

        var line1 = arrow.createChild(am4core.Rectangle);
        line1.width = 3; // Adjust the dimensions as needed
        line1.height = 12;
        line1.fill = chart.colors.getIndex(12);
        line1.rotation = 45;
        line1.horizontalCenter = "middle";
        line1.verticalCenter = "middle";

        // Second line of the cross
        var line2 = arrow.createChild(am4core.Rectangle);
        line2.width = 3; // Adjust the dimensions as needed
        line2.height = 12;
        line2.fill = chart.colors.getIndex(12);
        line2.rotation = -45;
        line2.horizontalCenter = "middle";
        line2.verticalCenter = "middle";

        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fill = options['title-color'];
        chartTitle.fontSize = 24;
        chartTitle.marginBottom = 30;

        //scrollbars
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();

        return chart;
    }
}
// Customized Charts for just one case

export class CombinedChart extends Chart{
    buildChart(data, container, title, options){
        const THRESHOLD = options.threshold;
        let params = {};
        if (data?.length > 0) {
            params = {
            part: Object.keys(data[0])[0],
            category: Object.keys(data[0])[1],
            value: Object.keys(data[0])[2],
            value2: Object.keys(data[0])[3],
            };
        }
        if (data === undefined || params === {}) {
            return;
        }


        // var chart = am4core.create(container, am4charts.XYChart);
        var chart = new PartionedBarChart(data, container, title, options).chart;

        // chart.data = data;
        var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.renderer.opposite = true;
        valueAxisY.title.text = options.rightYaxisTitle;

        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "Bit Depth (m)";
        lineSeries.dataFields.valueY = params.value2;
        lineSeries.dataFields.categoryX = params.category;
        
        lineSeries.stroke = am4core.color("#44fd00");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";
        lineSeries.yAxis = valueAxisY;

        var thresholdGuideline = chart.yAxes.getIndex(0).axisRanges.create();
        thresholdGuideline.value = THRESHOLD; // Adjust the threshold value
        thresholdGuideline.grid.stroke = am4core.color("#FF0000"); // Line color
        thresholdGuideline.grid.strokeOpacity = 0.7; // Line opacity
        thresholdGuideline.grid.strokeWidth = 3;
        thresholdGuideline.grid.strokeDasharray = "lineDash"; // Dashed line style
        
        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.fill = am4core.color("#fff");
        circle.strokeWidth = 3;

       
        return chart;
    }
}
export class DateAxes extends Chart
{
    buildChart(data, container, title, options){
        /**
            // This chart is customized to display just one case :
            data = [
                        {
                            "update_date": "2023-01-08",
                            "cummul_cost": 138.56,
                            "cummul_depth": 18,
                            "planned_cost": 1601,
                            "drilling_end": 230
                        },
                        {
                            "update_date": "2023-01-09",
                            "cummul_cost": 145.732,
                            "cummul_depth": 59,
                            "planned_cost": 1601
                        },
                        {
                            "update_date": "2023-01-10",
                            "cummul_cost": 153.035,
                            "cummul_depth": 120.999999999516,
                            "planned_cost": 1601,
                            "drilling_end": 230
                        },
                    ...
                    ]
        */
        let chart = am4core.create(container, am4charts.XYChart);
        chart.data = data.map(({ update_date, ...obj }) => ({
            ...obj,
            update_date: parseDate(update_date)
            }));
        
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        
        function createAxisAndSeries(field1, field2, name1, name2, opposite, inversed, color1, color2, axisTitle) {
            color1=am4core.color(color1).rgb;
            color1.a=0.6;
            color2=am4core.color(color2).rgb;
            color2.a=0.6;
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            if(chart.yAxes.indexOf(valueAxis) != 0){
                valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
            }
            
            let series1 = chart.series.push(new am4charts.LineSeries());
            series1.dataFields.valueY = field1;
            series1.dataFields.dateX = "update_date";
            series1.strokeWidth = 2.5;
            series1.yAxis = valueAxis;
            series1.name = name1;
            series1.tooltipText = "{name}: [bold]{valueY}[/]";
            // series1.tensionX = 0.8;
            series1.showOnInit = true;
            series1.stroke = color1;
            series1.tooltip.getFillFromObject = false;
            series1.tooltip.background.fill = color1;

            let series2 = chart.series.push(new am4charts.LineSeries());
            series2.dataFields.valueY = field2;
            series2.dataFields.dateX = "update_date";
            series2.strokeWidth = 2.5;
            series2.yAxis = valueAxis;
            series2.name = name2;
            series2.tooltipText = "{name}: [bold]{valueY}[/]";
            // series2.tensionX = 0.8;
            series2.showOnInit = true;
            series2.stroke = color2;
            series2.tooltip.getFillFromObject = false;
            series2.tooltip.background.fill = color2;
            
            valueAxis.renderer.line.strokeOpacity = 1;
            valueAxis.renderer.line.strokeWidth = 1;
            valueAxis.renderer.line.stroke = "#000";
            valueAxis.renderer.labels.template.fill = "#000";
            valueAxis.renderer.opposite = opposite;
            valueAxis.renderer.inversed = inversed;
            valueAxis.title.text = axisTitle;
        }
        
        createAxisAndSeries("cummul_depth","drilling_end", "Realised Depth (m)", "Planned Depth (m)", false, true, "#FF0000", "#0000FF", "Meters");
        createAxisAndSeries("cummul_cost", "planned_cost", "Cummul Cost (KDA)", "Planned Cost (KDA)", true, false, "#FFA500", "#00FF00", "KDA");

        chart.legend = new am4charts.Legend();
        chart.cursor = new am4charts.XYCursor();

        let chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 24;
        chartTitle.fill = options["title-color"];
        chartTitle.marginBottom = 30;
        
        function parseDate(dateString) {
            return new Date(dateString);
          }
    }
}