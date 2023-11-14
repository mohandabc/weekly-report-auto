import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { nest } from 'd3-collection';
import "./table.css";
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
        if (data === undefined || params == {}) {
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
        if (data === undefined || params == {}){
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
        
        
        if (adaptedData.length === 0 || params == {}){
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

            series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
            series.columns.template.fillOpacity = 0.8;

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);
            
            var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.label.dy = -15;
            bullet.label.text = '[bold]{valueY}'
            bullet.label.fontSize= 11;
            if (data.length > 14) {
                bullet.label.fontSize= 9;
                bullet.label.rotation= -60;
            }
            
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
        if (data === undefined || params == {}) {
            return;
        }
        var chart = am4core.create(container, am4charts.XYChart);
        chart.data = data;

        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = params.category;
        xAxis.renderer.grid.template.opacity=0.5;
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.labels.template.fontSize = 10;
        xAxis.renderer.labels.template.horizontalCenter = "right";
        xAxis.renderer.labels.template.verticalCenter = "right";
        xAxis.renderer.labels.template.rotation = -60;
        xAxis.renderer.minGridDistance = 10;
        xAxis.title.text = "Stand Number";

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = options.leftYaxisTitle;
        yAxis.renderer.grid.template.opacity=0.5;


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
        if (data === undefined || params == {}) {
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
        line1.stroke = "#449ddd";
        line1.fill = chart.colors.getIndex(16);
        line1.rotation = 45;
        line1.horizontalCenter = "middle";
        line1.verticalCenter = "middle";
        
        // Second line of the cross
        var line2 = arrow.createChild(am4core.Rectangle);
        line2.width = 3; // Adjust the dimensions as needed
        line2.height = 12;
        line2.stroke = "#449ddd";
        line2.fill = chart.colors.getIndex(16);
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
        if (data === undefined || params == {}) {
            return;
        }


        // var chart = am4core.create(container, am4charts.XYChart);
        var chart = new PartionedBarChart(data, container, title, options).chart;

        // chart.data = data;
        var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxisY.renderer.opposite = true;
        valueAxisY.title.text = options.rightYaxisTitle;
        valueAxisY.renderer.grid.template.disabled = true;

        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "Bit Depth (m)";
        lineSeries.dataFields.valueY = params.value2;
        lineSeries.dataFields.categoryX = params.category;
        
        lineSeries.stroke = am4core.color("#449ddd");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";
        lineSeries.yAxis = valueAxisY;

        let dataMaxValue = data.reduce(function (prev, current) {
            return prev[params.value] > current[params.value] ? prev : current;
        });
        
        if (THRESHOLD > dataMaxValue[params.value]){
            chart.yAxes.getIndex(0).max = THRESHOLD;
        }
        
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

        chart.seriesContainer.zIndex = -1;

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

       

        if (Array.isArray(data)){
            let processedData = data.map(({ update_date, ...obj }) => ({
                ...obj,
                update_date: parseDate(update_date)
           }));

            chart.data = processedData;
        }else{
            let monitoringData = data['monitoring_kpi'];
            let eventData = data['events'];
            let processedData = monitoringData?.map(({ update_date, ...obj }) => {
            
                let data = {
                    ...obj,
                    update_date: parseDate(update_date),
                }
    
                let event = eventData?.filter(event=>event.DateStart.split(" ")[0] === update_date);
                if (event?.length>0) {                
                    data["event_title"] = event[0].Title;
                    data["event_depth"] = event[0].Depth;
                    data["event_date"] =  parseDate(event[0].DateStart.split(' ')[0]);
                }
                return data;
                
            });
            chart.data = processedData;
        }
        
        
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        
        function createAxisAndSeries(field1, field2, name1, name2, opposite, inversed, color1, color2, axisTitle) {
            color1=am4core.color(color1).rgb;
            color1.a=0.6;
            color2=am4core.color(color2).rgb;
            color2.a=0.6;
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            
            
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

            
            if(opposite) {
                valueAxis.renderer.grid.template.disabled = true;
            };
            // valueAxis.min= 0;
            valueAxis.renderer.inversed = inversed;
            valueAxis.title.text = axisTitle;
        }
        
        createAxisAndSeries("cummul_depth","drilling_end", "Realised Depth (m)", "Planned Depth (m)", false, true, "#FF0000", "#0000FF", "Meters");
        createAxisAndSeries("cummul_cost", "planned_cost", "Cummul Cost (KDA)", "Planned Cost (KDA)", true, false, "#FFA500", "#00FF00", "KDA");
        

        // Add events
        if(!Array.isArray(data) && data['events']){
            var lineSeries = chart.series.push(new am4charts.LineSeries());
            lineSeries.dataFields.valueY = 'event_depth';
            lineSeries.dataFields.dateX = 'event_date';
            lineSeries.strokeOpacity = 0;
            lineSeries.yAxis = chart.yAxes.getIndex(0);
            lineSeries.name = 'Events';
    
            // // Add a bullet
            var bullet = lineSeries.bullets.push(new am4charts.Bullet());
    
            // // Add a triangle to act as am arrow
            var arrow = bullet.createChild(am4core.Triangle);
            arrow.width = 12;
            arrow.height = 12;
            arrow.rotation = 90
            arrow.horizontalCenter = "middle";
            arrow.verticalCenter = "middle";
            arrow.tooltipText = "{event_title}: [bold]{valueY}[/]";
        }
        

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

export class GroupedBarChart extends Chart
{
    buildChart(data, container, title, options){
                am4core.options.autoDispose = true;
                let chart = am4core.create(container, am4charts.XYChart);
                chart.responsive.enabled = true;
                chart.paddingBottom = 60;
                chart.cursor = new am4charts.XYCursor();
                chart.scrollbarY = new am4core.Scrollbar();
                chart.scrollbarX = new am4core.Scrollbar();
    
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "category";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataItems.template.text = "";
                categoryAxis.renderer.minGridDistance = 30;
    
                let label = categoryAxis.renderer.labels.template;
                label.wrap = false;
                label.truncate = false;
                label.maxWidth = 200;
                label.fontSize = 10;
    
                categoryAxis.events.on("sizechanged", function (ev) {
                    let axis = ev.target;
                    var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                    var label = axis.renderer.labels.template;
                    var rangeTemplate = axis.axisRanges.template;
                    var rangeLabel = rangeTemplate.label;
                    if (cellWidth < label.maxWidth) {
                        rangeLabel.rotation = -35
                        rangeLabel.dy = 45;
                        rangeLabel.fontSize = 16;
    
                        label.rotation = -35;
                        label.dy = 1;
                        label.fontSize = 14;
                        label.horizontalCenter = "right";
                        label.verticalCenter = "left";
                    } else {
                        rangeLabel.rotation = 0
                        rangeLabel.dy = 35;
                        rangeLabel.fontSize = 16;
    
                        label.rotation = 0;
                        label.dy = 1;
                        label.fontSize = 16;
                        label.horizontalCenter = "middle";
                        label.verticalCenter = "top";
                    }
                });
    
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.tooltip.disabled = true;
                valueAxis.title.text = options.unit;
                valueAxis.title.fontWeight = 800;
                valueAxis.min = 0;
                valueAxis.extraMax = 0.1;
    
                var columnSeries_night = chart.series.push(new am4charts.ColumnSeries());
                columnSeries_night.columns.template.width = am4core.percent(80);
                columnSeries_night.columns.template.fillOpacity = 0.6;
                columnSeries_night.tooltipText = "{provider} -{realName}: [bold]{valueY}";
                columnSeries_night.dataFields.categoryX = "category";
                columnSeries_night.dataFields.valueY = "night";
                columnSeries_night.name = "Night Shift";
                columnSeries_night.fill = "#6B6CA7"
                columnSeries_night.stacked = false;
    
    
                var columnSeries = chart.series.push(new am4charts.ColumnSeries());
                columnSeries.columns.template.width = am4core.percent(80);
                columnSeries.columns.template.fillOpacity = 0.6;
                columnSeries.tooltipText = "{provider} -{realName}: [bold]{valueY}";
                columnSeries.dataFields.categoryX = "category";
                columnSeries.dataFields.valueY = "value";
                columnSeries.name = "Day Shift ";
                columnSeries.fill = "#FFDC00"
                columnSeries.stacked = false;
                
                if(options.show_benchmark=='Yes'){
    
                var paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                paretoValueAxis.renderer.opposite = true;
                paretoValueAxis.min = 0;
                paretoValueAxis.strictMinMax = true;
                paretoValueAxis.renderer.grid.template.disabled = true;
                paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
                paretoValueAxis.cursorTooltipEnabled = false;
    
                var paretoSeries = chart.series.push(new am4charts.LineSeries())
                paretoSeries.dataFields.valueY = -1;
                paretoSeries.dataFields.categoryX = "category";
                paretoSeries.yAxis = paretoValueAxis;
                paretoSeries.strokeWidth = 3;
                paretoSeries.strokeOpacity = 0.5;
                paretoSeries.name = "Benchmark 3 1/2 ";
                paretoSeries.stroke = am4core.color("rgba(255,0,0,1)");
                paretoSeries.strokeDasharray = "5,3";
          
    
                var paretoValueAxis_2 = chart.yAxes.push(new am4charts.ValueAxis());
                paretoValueAxis_2.renderer.opposite = true;
                paretoValueAxis_2.renderer.grid.template.disabled = true;
                paretoValueAxis_2.numberFormatter = new am4core.NumberFormatter();
                paretoValueAxis_2.cursorTooltipEnabled = false;
    
                var paretoSeries_2 = chart.series.push(new am4charts.LineSeries())
                paretoSeries_2.dataFields.valueY = -1;
                paretoSeries_2.dataFields.categoryX = "category";
                paretoSeries_2.yAxis = paretoValueAxis_2;
                paretoSeries_2.strokeWidth = 3;
                paretoSeries_2.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
                paretoSeries_2.strokeOpacity = 0.5;
                paretoSeries_2.name = "Benchmark 5' ";
                paretoSeries_2.strokeDasharray = "5,3";
                paretoSeries_2.stroke = am4core.color("rgba(0,0,255,1)");
    
                }
                if (options.Benchmark_5_passed != 0) {
    
                    let range2 = valueAxis.axisRanges.create();
                    range2.value = options.Benchmark_5_passed;
                    range2.grid.stroke = am4core.color("#0000FF");
                    range2.grid.strokeWidth = 2;
                    range2.grid.strokeOpacity = 1;
                    range2.label.inside = true;
                    range2.label.fill = range2.grid.stroke;
                    range2.label.verticalCenter = "bottom";
                    range2.grid.strokeDasharray = "3,3"
    
    
                }
    
                if (options.Benchmark_3_passed != 0) {
    
                    let range_1 = valueAxis.axisRanges.create();
                    range_1.value = options.Benchmark_3_passed;
                    range_1.grid.stroke = am4core.color("#FF0000");
                    range_1.grid.strokeWidth = 2;
                    range_1.grid.strokeOpacity = 1;
                    range_1.label.inside = true;
                    range_1.strokeDasharray = "5,3";
                    range_1.label.fill = range_1.grid.stroke;
                    range_1.label.verticalCenter = "bottom";
                    range_1.grid.strokeDasharray = "3,3"
    
                }
    
                chart.legend = new am4charts.Legend()
                chart.legend.position = 'top'
                chart.legend.paddingBottom = 20
                chart.legend.labels.template.maxWidth = 95
                var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis2.renderer.opposite = true;
                valueAxis2.syncWithAxis = valueAxis;
                valueAxis2.tooltip.disabled = true;
    
                var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis3.renderer.opposite = true;
                valueAxis3.syncWithAxis = valueAxis;
                valueAxis3.tooltip.disabled = true;
                chart.cursor.lineX.disabled = true;
                chart.cursor.lineY.disabled = true;
    
                let valueLabel = columnSeries.bullets.push(new am4charts.LabelBullet());
                valueLabel.label.text = "{value}";
                valueLabel.label.dy = 15;
                valueLabel.fontWeight = "bold";
    
    
                // let dps = $("#pipe_size").val();
                // if (dps.length == 0) {
                //     dps = ""
                // } else {
                //     dps = "DP:" + dps.toString()
                // }
    
                let valueLabel2 = columnSeries.bullets.push(new am4charts.LabelBullet());
                valueLabel2.label.text = "{realName} DP"
                valueLabel2.label.dy = -15;
                valueLabel2.fontWeight = "bold";
                valueLabel2.label.fill = "#F22A12"
    
                let valueLabel_night = columnSeries_night.bullets.push(new am4charts.LabelBullet());
                valueLabel_night.label.text = "{realName} DP";
                valueLabel_night.label.dy = -15;
                valueLabel_night.fontWeight = "bold";
                valueLabel_night.label.fill = "#F22A12"
    
    
                let valueLabe2 = columnSeries_night.bullets.push(new am4charts.LabelBullet());
                valueLabe2.label.text = "{night}";
                valueLabe2.label.dy = 15;
                valueLabe2.fontWeight = "bold";
    
                valueLabel2.label.background.stroke = am4core.color("#555");
                valueLabel2.label.background.strokeOpacity = 1;
    
                valueLabel_night.label.background.stroke = am4core.color("#555");
                valueLabel_night.label.background.strokeOpacity = 1;
    
                var rangeTemplate = categoryAxis.axisRanges.template;
                rangeTemplate.tick.disabled = false;
                rangeTemplate.tick.location = 0;
                rangeTemplate.tick.strokeOpacity = 0.6;
                rangeTemplate.tick.length = 60;
                rangeTemplate.grid.strokeOpacity = 0.5;
                var rangeLabel = rangeTemplate.label;
    
                rangeLabel.tooltip = new am4core.Tooltip();
                rangeLabel.tooltip.dy = -10;
                rangeLabel.cloneTooltip = false;
                rangeLabel.color = am4core.color("red");
    
                var chartData = [];
                var data = data;
    
                for (var providerName in data) {
                    var providerData = data[providerName];
    
                    var tempArray = [];
                    var count = 0;
                    for (var itemName in providerData) {
    
                        if (itemName != "quantity") {
                            count++;
                            tempArray.push({
                                category: providerName + " " + itemName,
                                realName: itemName,
                                value: providerData[itemName]['day'],
                                night: providerData[itemName]['night'],
                                Benchmark_3_inch: options.Benchmark_3_passed,
                                Benchmark_5_inch: options.Benchmark_5_passed,
                                provider: providerName
                            })
    
                        }
    
    
                    }
                    tempArray.sort(function (a, b) {
                        if (a.value > b.value) {
                            return 1;
                        } else if (a.value < b.value) {
                            return -1
                        } else {
                            return 0;
                        }
                    })
                    var lineSeriesDataIndex = Math.floor(count / 2);
                    tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
                    tempArray[lineSeriesDataIndex].count = count;
                    am4core.array.each(tempArray, function (item) {
                        chartData.push(item);
                    })
    
                    var range = categoryAxis.axisRanges.create();
                    range.category = tempArray[0].category;
                    range.endCategory = tempArray[tempArray.length - 1].category;
                    range.label.text = tempArray[0].provider;
                    range.label.dy = 30;
                    range.label.truncate = true;
                    range.label.fontWeight = "bold";
                    range.label.tooltipText = tempArray[0].provider;
    
    
                }
    
    
                chart.data = chartData;
                var range = categoryAxis.axisRanges.create();
                range.category = chart.data[chart.data.length - 1]?.category;
                range.label.disabled = true;
                range.tick.location = 1;
                range.grid.location = 1;
    
    
                chart.exporting.menu = new am4core.ExportMenu();
                let titlevar = chart.titles.create();
                titlevar.text = title;
                titlevar.fontSize = 25;
                titlevar.marginBottom = 60;
    
    
                chart.exporting.events.on("exportstarted", function (ev) {
                    titlevar.disabled = false;
                    titlevar.parent.invalidate();
                });
            return chart;
        
}}

export class WTW_shift extends Chart
{
    buildChart(data, container, title, options){
        var category_axis = options.category_axis
        var chart = am4core.create(container, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;

        chart.data = data;

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = category_axis;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;
        valueAxis.extraMax = 0.1;
        valueAxis.title.text = "Minute";

        function createSeries(name, valuey, category_axis, stacked, color) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.columns.template.width = am4core.percent(80);
            series.name = name;
            series.dataFields.categoryX = category_axis;
            series.dataFields.valueY = valuey;
            series.fill = am4core.color(color);
            series.dataItems.template.locations.categoryX = 0.5;
            series.stacked = stacked;
            series.tooltip.pointerOrientation = "vertical";
            series.columns.template.fillOpacity = 0.7;
            series.columns.template.tooltipText = name.substring(0,15) +": [bold]{valueY.formatNumber('#.00')}";

            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.interactionsEnabled = false;
            labelBullet.label.fill = am4core.color("#000000");
            labelBullet.label.fontWeight = "bold";
            labelBullet.locationY = 0.5;
            labelBullet.label.text = "{valueY.formatNumber('#.00')}";
            return series;
            }

        createSeries("Weight To Slips - Night", "night_pre_conn", category_axis, false, "#2D4B6B");
        createSeries("Connection Time - Night", "night_connection_time", category_axis, true, "#61A3E8");
        createSeries("Slips To Weight - Night", "night_post_conn", category_axis, true, "#AACAEC");
        createSeries("Weight To Slips - Day", "day_pre_conn", category_axis, false, "#FFAE0D");
        createSeries("Connection Time - Day", "day_connection_time", category_axis, true, "#FFDC00");
        createSeries("Slips To Weight - Day", "day_post_conn", category_axis, true, "#F0FF33");


        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();
        chart.exporting.menu = new am4core.ExportMenu();

        let titletext = chart.titles.create();
        titletext.text = title;
        titletext.fontSize = 25;
        titletext.marginBottom = 60;
    return chart;
        
}}

export class WTW_trip_rig extends Chart
{
    buildChart(data, container, title, options){
        var chart = am4core.create(container, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = data;

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = options.category_axis;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.fontWeight = "bold";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;
        valueAxis.extraMax = 0.1;
        valueAxis.title.text = "Minute";

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(80);
        series1.name = "Weight To Slips";
        series1.dataFields.categoryX = options.category_axis;
        series1.dataFields.valueY = "pre_conn";
        series1.fill = am4core.color("#38425B");
        series1.dataItems.template.locations.categoryX = 0.5;
        series1.stacked = true;
        series1.tooltip.pointerOrientation = "vertical";

        var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
        bullet1.interactionsEnabled = false;
        bullet1.label.fill = am4core.color("#fff");
        bullet1.locationY = 0.5;
        bullet1.label.text = "{valueY.formatNumber('#.00')}";
        bullet1.label.fontWeight = "bold";

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.columns.template.width = am4core.percent(80);
        series2.name = "Connection Time";
        series2.dataFields.categoryX = options.category_axis;
        series2.dataFields.valueY = "connection_time";
        series2.dataItems.template.locations.categoryX = 0.5;
        series2.stacked = true;
        series2.fill = am4core.color("#E08771");
        series2.tooltip.pointerOrientation = "vertical";

        var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
        bullet2.interactionsEnabled = false;
        bullet2.locationY = 0.5;
        bullet2.label.fill = am4core.color("#fff");
        bullet2.label.text = "{valueY.formatNumber('#.00')}";
        bullet2.label.fontWeight = "bold";

        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.columns.template.width = am4core.percent(80);
        series3.name = "Slips To Weight";
        series3.dataFields.categoryX = options.category_axis;
        series3.dataFields.valueY = "post_conn";
        series3.dataItems.template.locations.categoryX = 0.5;
        series3.stacked = true;
        series3.tooltip.pointerOrientation = "vertical";
        series3.fill = am4core.color("#869880");

        var bullet3 = series3.bullets.push(new am4charts.LabelBullet());
        bullet3.interactionsEnabled = false;
        bullet3.label.text = "{valueY.formatNumber('#.00')}";
        bullet3.locationY = 0.5;
        bullet3.label.fill = am4core.color("#fff");
        bullet3.label.fontWeight = "bold";

        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();
        chart.exporting.menu = new am4core.ExportMenu();

        let titles = chart.titles.create();
        titles.text = title;
        titles.fontSize = 25;
        titles.marginBottom = 60;
    }
}

export class Monitored_vs_Drilled extends Chart
{
    buildChart(data, container, title){

        var chart = am4core.create(container, am4charts.XYChart);
        chart.exporting.menu = new am4core.ExportMenu();
        // Add percent sign to all numbers
        chart.numberFormatter.numberFormat = "#.#";
        
        // Add data
        let sorted_data = data.sort((a, b) => (a.meters_drilled < b.meters_drilled) ? 1 : ((b.meters_drilled < a.meters_drilled) ? -1 : 0))
        chart.data = sorted_data

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Meters";
        valueAxis.title.fontWeight = 800;
        valueAxis.min = 0
        valueAxis.extraMax = 0.1;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "meters_drilled";
        series.dataFields.categoryX = "name";
        series.name = "Meters Drilled ";
        series.fill = "#004C99"

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "meters_monitored";
        series2.dataFields.categoryX = "name";
        series2.name = "Meters Monitored";
        series2.fill = "#CC6600"

        let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "[bold]{meters_drilled} [normal](100%)";
        valueLabel.label.fill = "#FFF"
        valueLabel.locationY = 0.5;

        let valueLabe2 = series2.bullets.push(new am4charts.LabelBullet());
        valueLabe2.label.text = "{meters_monitored}";
        valueLabe2.label.fill = "#FFF"
        valueLabe2.locationY = 0.5;
        valueLabe2.label.adapter.add("text", function(text) {
            return '[bold]' + chart.data[0]['meters_monitored'] + "[normal] (" + Math.floor(chart.data[0]['meters_monitored']/chart.data[0]['meters_drilled'] * 100) + "%)"
        });


        let titles = chart.titles.create();
        titles.text = title;
        titles.fontSize = 25;
        titles.marginBottom = 60;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'bottom'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95
    }
}

export class Monitored_vs_Drilled_Rig extends Chart
{
    buildChart(data, container, title, options){
        // # I should write the query that receives this data and inject it in options
        var _NPT_details_grouped = options._NPT_details_grouped; 

        var chart = am4core.create(container, am4charts.XYChart);
        chart.responsive.enabled = true;
        chart.paddingBottom = 60;
        chart.cursor = new am4charts.XYCursor();
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarX = new am4core.Scrollbar();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataItems.template.text = "{realName}";
        categoryAxis.renderer.minGridDistance = 30;
        chart.numberFormatter.numberFormat = "#.##";
        if (title=="NPT Vs PT Per Well") categoryAxis.cursorTooltipEnabled = false;

        let label = categoryAxis.renderer.labels.template;
        label.wrap = false;
        label.truncate = false;
        label.maxWidth = 200;
        label.fontSize = 14;

        categoryAxis.events.on("sizechanged", function (ev) {
            let axis = ev.target;
            var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            var label = axis.renderer.labels.template;
            var rangeTemplate = axis.axisRanges.template;
            var rangeLabel = rangeTemplate.label;
            if (cellWidth < label.maxWidth) {
                rangeLabel.rotation = -35
                rangeLabel.dy = 45;
                rangeLabel.fontSize = 16;

                label.rotation = -35;
                label.fontSize = 14;
                label.horizontalCenter = "right";
                label.verticalCenter = "left";
            } else {
                rangeLabel.rotation = 0
                rangeLabel.dy = 35;
                rangeLabel.fontSize = 16;

                label.rotation = 0;
                label.fontSize = 16;
                label.horizontalCenter = "middle";
                label.verticalCenter = "top";
            }
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = options.unit;
        valueAxis.title.fontWeight = 800;
        valueAxis.min = 0;
        valueAxis.extraMax = 0.1;

        var columnSeries_1 = chart.series.push(new am4charts.ColumnSeries());
        columnSeries_1.columns.template.width = am4core.percent(80);
        columnSeries_1.tooltipText = "{provider} -{realName}: [bold]{valueY}";
        columnSeries_1.dataFields.categoryX = "category";
        columnSeries_1.dataFields.valueY = "value1";
        columnSeries_1.name = options.serie1_name;
        columnSeries_1.stroke = am4core.color('#FFEAC9');
        columnSeries_1.fill = options.serie1_color


        var columnSeries_2 = chart.series.push(new am4charts.ColumnSeries());
        columnSeries_2.columns.template.width = am4core.percent(80);
        columnSeries_2.tooltipText = "{provider} -{realName}: [bold]{valueY}";
        columnSeries_2.dataFields.categoryX = "category";
        columnSeries_2.dataFields.valueY = "value2";
        columnSeries_2.name = options.serie2_name;
        columnSeries_2.stroke = am4core.color('#FFEAC9');
        columnSeries_2.fill = options.serie2_color

        if (title=="NPT Vs PT Per Well") columnSeries_2.columns.template.adapter.add('tooltipHTML', function(html, target) {
            var data = target.tooltipDataItem.dataContext;
            Object.keys(_NPT_details_grouped).forEach(function (well) {
                if (data.realName == well ) {
                var templateHTML = 
                '<table id="npt-details" style="border-collapse: collapse; width: 280px;" border="1" bordercolor="white">\n'+
                '<tr>\n'+
                '<td style="width: 100%; text-align: center;" colspan="2"><span style="color: #000000;">{provider} -{realName}: <b>{valueY}</b></span></td>\n'+
                '</tr>\n'+
                '<tr>\n'+
                '<td style="width: 80%; text-align: center; font-weight: bold;"><span style="color: #000000;">NPT Detail</td>\n'+
                '<td style="width: 20%; text-align: center; font-weight: bold;"><span style="color: #000000;">NPT</td>\n'+
                '</tr>\n'+
                '<tbody>\n';
            (_NPT_details_grouped[well]).forEach((el) => {
                if (el.name!==null&&el.npt!==null)
                templateHTML += 
                '<tr>\n'+
                '<td style="width: 80%; text-align: center;"><span style="color: #ffffff;">\n'+el.name+'</span></td>\n'+
                '<td style="width: 20%; text-align: center;"><span style="color: #ffffff;">\n'+el.npt+'</span></td>\n'+
                '</tr>\n';
                });
            templateHTML += 
                '</tbody>\n'+
                '</table>\n';
            columnSeries_2.tooltipHTML=templateHTML;
            }
        });
        });


        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95
        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.renderer.opposite = true;
        valueAxis2.syncWithAxis = valueAxis;
        valueAxis2.tooltip.disabled = true;
        // columnSeries.clustered = true;

        var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis3.renderer.opposite = true;
        valueAxis3.syncWithAxis = valueAxis;
        valueAxis3.tooltip.disabled = true;
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;

        let valueLabel = columnSeries_1.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = (container=='drilled_vs_monitored')?"[bold]{value1} ":"[bold]{value1}";
        valueLabel.label.dy = -10;

        let valueLabe2 = columnSeries_2.bullets.push(new am4charts.LabelBullet());
        valueLabe2.label.text = "[bold]{value2}";
        valueLabe2.label.dy = -10;
        if (container=='drilled_vs_monitored'){
            valueLabe2.label.adapter.add("text", function(text, target) {
                var dataItem = target.dataItem;
                chart.data.forEach(function (obj) {
                    if (obj.category==dataItem.categoryX) {
                        var percentage = isNaN(Math.floor(obj.value2/obj.value1 * 100))?0:Math.floor(obj.value2/obj.value1 * 100)
                        text = "[bold]" + obj.value2 
                    }
                });   
                return text
            });}


        if (title.includes('NPT', 0)) {
            columnSeries_2.stacked = true;
            columnSeries_1.stacked = true;
            valueLabel.locationY = 0.5;
            valueLabe2.locationY = 0.5;


        }

        var rangeTemplate = categoryAxis.axisRanges.template;
        rangeTemplate.tick.disabled = false;
        rangeTemplate.tick.location = 0;
        rangeTemplate.tick.strokeOpacity = 0.6;
        rangeTemplate.tick.length = 60;
        rangeTemplate.grid.strokeOpacity = 0.5;
        var rangeLabel = rangeTemplate.label;

        rangeLabel.tooltip = new am4core.Tooltip();
        rangeLabel.tooltip.dy = -10;
        rangeLabel.cloneTooltip = false;
        rangeLabel.color = am4core.color("red");

        var chartData = [];
        var data = data;

        for (var providerName in data) {
            var providerData = data[providerName];

            var tempArray = [];
            var count = 0;
            for (var itemName in providerData) {
                
                if (itemName != "quantity") {

                        count++;
                        tempArray.push({
                            category: providerName + " " + itemName,
                            realName: itemName,
                            value1: providerData[itemName][options.provide_data1],
                            value2: providerData[itemName][options.provide_data2],
                            provider: providerName
                        })
        
                }
            }
            tempArray.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1;
                } else if (a.value < b.value) {
                    return -1
                } else {
                    return 0;
                }
            })
            var lineSeriesDataIndex = Math.floor(count / 2);
            tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
            tempArray[lineSeriesDataIndex].count = count;
            am4core.array.each(tempArray, function (item) {
                chartData.push(item);
            })

            var range = categoryAxis.axisRanges.create();
            range.category = tempArray[0].category;
            range.endCategory = tempArray[tempArray.length - 1].category;
            range.label.text = tempArray[0].provider;
            range.label.dy = 30;
            range.label.truncate = true;
            range.label.fontWeight = "bold";
            range.label.tooltipText = tempArray[0].provider;

        }
        chart.data = chartData;
        var range = categoryAxis.axisRanges.create();
        range.category = chart.data[chart.data.length - 1]?.category;
        range.label.disabled = true;
        range.tick.location = 1;
        range.grid.location = 1;

        chart.exporting.menu = new am4core.ExportMenu();
        let titles = chart.titles.create();
        titles.text = title;
        titles.fontSize = 25;
        titles.marginBottom = 60;


        chart.exporting.events.on("exportstarted", function (ev) {
            titles.disabled = false;
            titles.parent.invalidate();
        });
    }
}

export class NPT extends Chart
{
    buildChart(data, container, title, options){
        var chart = am4core.create(container, am4charts.XYChart);
            chart.exporting.menu = new am4core.ExportMenu();
            chart.data = data;
            chart.numberFormatter.numberFormat = "#.##";
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = options.cat;
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 30;
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.1;
            valueAxis.title.text = "Days"
            let label = categoryAxis.renderer.labels.template;
            label.maxWidth = 300;
            label.fontSize = 14;
            categoryAxis.events.on("sizechanged", function (ev) {
                let axis = ev.target;
                var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                label = axis.renderer.labels.template;
                var rangeTemplate = axis.axisRanges.template;
                var rangeLabel = rangeTemplate.label;
                if (cellWidth < label.maxWidth) {
                    rangeLabel.rotation = -45
                    rangeLabel.dy = 50;
                    rangeLabel.fontSize = 17;

                    label.dy = 1;
                    label.fontSize = 14;
                    label.rotation = -45;
                    label.horizontalCenter = "right";
                    label.verticalCenter = "left";
                } else {
                    label.fontSize = 14;
                    rangeLabel.rotation = 0
                    rangeLabel.dy = 40;
                    label.dy = 25;

                    label.rotation = 0;
                    label.horizontalCenter = "middle";
                    label.verticalCenter = "top";
                }
            });

            function createSeries(field, name, cat) {
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.name = name;
                series.dataFields.valueY = field;
                series.dataFields.categoryX = cat;
                series.sequencedInterpolation = true;

                series.stacked = true;
                series.columns.template.width = am4core.percent(80);
                series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:16px]{categoryX}: [bold][font-size:16px]{valueY}\n[bold][font-size:16px]";
                var labelBullet = series.bullets.push(new am4charts.LabelBullet());
                labelBullet.label.text = "{valueY} ";
                labelBullet.locationY = 0.5;
                if (title=="NPT Vs PT Per Weeks"){
                    labelBullet.label.adapter.add("text", function(text, target) {
                        var dataItem = target.dataItem;
                        chart.data.forEach(function (obj) {
                            if (obj.week==dataItem.categoryX&&obj.pt==dataItem.valueY) {
                                text = "[bold]" + parseFloat(obj.pt).toFixed(1) + " [normal](" + parseFloat((obj.pt/(obj.pt+obj.npt)) * 100).toFixed(1) + "%)"
                            } else if (obj.week==dataItem.categoryX&&obj.npt==dataItem.valueY){
                                text = "[bold]" + parseFloat(obj.npt).toFixed(1) + " [normal](" + parseFloat((obj.npt/(obj.pt+obj.npt)) * 100).toFixed(1) + "%)"
                            }
                        });   
                        return text
                    });
                }
                if (title=="NPT Per SONATRACH Departement"){
                    var tot = 0;
                    chart.data.forEach(function (obj) {
                        tot += obj.npt;
                    });  
                    labelBullet.label.adapter.add("text", function(text, target) {
                        var dataItem = target.dataItem;
                        chart.data.forEach(function (obj) {
                            if (obj.npt_comapny==dataItem.categoryX&&obj.npt==dataItem.valueY)
                                text = "[bold]" + parseFloat(obj.npt).toFixed(1) + " [normal](" + parseFloat((obj.npt/tot) * 100).toFixed(1) + "%)";
                        });   
                        return text
                    });
                }

                if (name == 'PT') {
                    series.stroke = am4core.color('#FFEAC9');
                    series.fill = am4core.color('#66DE93');
                } else {
                    series.stroke = am4core.color('#FFEAC9');
                    series.fill = am4core.color('#FF616D');
                }
                return series;
            }
            
            if (options.npt_only === false){
                var pt_serie = createSeries("pt", "PT", options.cat);
            }
            var npt_serie = createSeries("npt", "NPT", options.cat);

            let titles = chart.titles.create();
            titles.text = title;
            titles.fontSize = 25;
            titles.marginBottom = 60;

            chart.exporting.events.on("exportstarted", function (ev) {
                titles.disabled = false;
                titles.parent.invalidate();
            });
            chart.legend = new am4charts.Legend();
            categoryAxis.renderer.labels.template.paddingBottom = 40
    }
}

export class SemiCircle extends Chart
{
    buildChart(data, container, title, options){
            var chart = am4core.create(container, am4charts.PieChart);
            chart.hiddenState.properties.opacity = 0;
            chart.radius = am4core.percent(60);
            chart.innerRadius = am4core.percent(30);
            chart.startAngle = options.startAngle;
            chart.endAngle = 360;
            chart.responsive.enabled = true;
            chart.data = data;
            var series = chart.series.push(new am4charts.PieSeries());
            series.dataFields.value = 'value';
            series.dataFields.category = 'name';
            series.slices.template.cornerRadius = 10;
            series.slices.template.innerCornerRadius = 7;
            series.slices.template.draggable = true;
            series.slices.template.inert = true;

            series.slices.template.adapter.add('fill', function (fill, target) {
                var name = target.dataItem.properties.category;
                switch (name) {

                    case 'PT':
                        return am4core.color('#66DE93');
                        break;
                    case 'NPT':
                        return am4core.color('#FF616D');
                        break;
                    case 'NPT Contractor':
                        return am4core.color('#68FECA');
                        break;
                    case 'NPT Sonatrach':
                        return am4core.color('#EC9D6A');
                        break;
                    case 'NPT Service Companies':
                        return am4core.color('#8DABDD');
                        break;
                    default:
                        return am4core.color('#8DABDD');

                }
            });

            series.ticks.template.disabled = true;
            series.alignLabels = false;
            series.labels.template.text = '[bold]{value} days';
            series.labels.template.radius = am4core.percent(-25);
            series.labels.template.padding(0, 0, 0, 0);
            series.labels.template.fill = am4core.color('white');
            series.labels.template.disabled = false; // false: visible
            series.hiddenState.properties.startAngle = 90;
            series.hiddenState.properties.endAngle = 90;
            chart.legend = new am4charts.Legend();
            let titles = chart.titles.create();
            titles.text = title;
            titles.fontSize = 25;
            titles.marginBottom = 60;
            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.events.on("exportstarted", function (ev) {
                titles.disabled = false;
                titles.parent.invalidate();
            });
    }
}

export class NPT_SH_GroupedBarChart extends Chart
{
    buildChart(data, container, title, options){
            var chart = am4core.create(container, am4charts.XYChart);
            chart.responsive.enabled = true;
            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.menu.backgroundColor = "#F44336";
    
            chart.paddingBottom = 60;
            chart.numberFormatter.numberFormat = "#.##";
    
            chart.cursor = new am4charts.XYCursor();
            chart.scrollbarX = new am4core.Scrollbar();
    
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataItems.template.text = "{realName}";
            categoryAxis.renderer.minGridDistance = 30;
    
            categoryAxis.adapter.add("tooltipText", function(tooltipText, target) {
                return categoryAxis.tooltipDataItem.dataContext.realName;
            })
    
            let label = categoryAxis.renderer.labels.template;
            label.wrap = false;
            label.truncate = false;
            label.dy = 1;
            label.maxWidth = 200;
            label.fontSize = 14;
    
            categoryAxis.events.on("sizechanged", function(ev) {
                let axis = ev.target;
                var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
                var label = axis.renderer.labels.template;
                var rangeTemplate = axis.axisRanges.template;
                var rangeLabel = rangeTemplate.label;
                if (cellWidth < label.maxWidth) {
                    rangeLabel.rotation = -45
                    rangeLabel.dy = 50;
                    rangeLabel.fontSize = 17;
    
                    label.dy = 1;
                    label.fontSize = 14;
                    label.rotation = -45;
                    label.horizontalCenter = "right";
                    label.verticalCenter = "left";
                } else {
                    label.fontSize = 14;
                    rangeLabel.rotation = 0
                    rangeLabel.dy = 40;
                    label.dy = 25;
    
                    label.rotation = 0;
                    label.horizontalCenter = "middle";
                    label.verticalCenter = "top";
                }
            });
    
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.min = 0;
            valueAxis.title.text = "Days"
            var colors = {};
    
            var colorPalette = ["#174A64", "#008AB8", "#47D1FF", "#85E0EE",
                "#0288D1", "#388E3C", "#FBC02D", "#F44336", "#84DCC6",
                "#8E24AA", "#C7DBE6", "#731963", "#59AED9", "#29C8FF",
                '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
            ];
            chart.colors.list = colorPalette.map(function(color) {
                return new am4core.color(color);
            });
    
            var columnSeries = chart.series.push(new am4charts.ColumnSeries());
            columnSeries.columns.template.width = am4core.percent(80);
            columnSeries.columns.template.fillOpacity = 0.6;
            columnSeries.tooltipText = "{provider} -{realName}: [bold]{valueY}";
            columnSeries.dataFields.categoryX = "category";
            columnSeries.dataFields.valueY = "value";
    
            columnSeries.stacked = true;
            var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis2.renderer.opposite = true;
            valueAxis2.syncWithAxis = valueAxis;
            valueAxis2.tooltip.disabled = true;
    
            columnSeries.columns.template.adapter.add("fill", function(fill, target) {
                var name = target.dataItem.dataContext.realName;
                if (!colors[name]) {
                    colors[name] = chart.colors.next();
                }
                target.stroke = colors[name];
                return colors[name];
            })
            var labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY} ";
            labelBullet.locationY = 0.5;
    
            var rangeTemplate = categoryAxis.axisRanges.template;
            rangeTemplate.tick.disabled = false;
            rangeTemplate.tick.location = 0;
            rangeTemplate.tick.strokeOpacity = 0.6;
            rangeTemplate.tick.length = 60;
            rangeTemplate.grid.strokeOpacity = 0.5;
            var rangeLabel = rangeTemplate.label;
    
            rangeLabel.tooltip = new am4core.Tooltip();
            rangeLabel.tooltip.dy = -10;
            rangeLabel.cloneTooltip = false;
            rangeLabel.color = am4core.color("red");
    
            var chartData = [];
            var lineSeriesData = [];
    
            var data = data;
    
            for (var providerName in data) {
                var providerData = data[providerName];
    
                var tempArray = [];
                var count = 0;
                for (var itemName in providerData) {
                    if (itemName != "quantity") {
                        count++;
                        tempArray.push({ category: providerName + "_" + itemName, realName: itemName, value: providerData[itemName], provider: providerName })
                    }
                }
                tempArray.sort(function(a, b) {
                    if (a.value > b.value) {
                        return 1;
                    } else if (a.value < b.value) {
                        return -1
                    } else {
                        return 0;
                    }
                })
    
                var lineSeriesDataIndex = Math.floor(count / 2);
                tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
                tempArray[lineSeriesDataIndex].count = count;
                am4core.array.each(tempArray, function(item) {
                    chartData.push(item);
                })
    
                var range = categoryAxis.axisRanges.create();
                range.category = tempArray[0].category;
                range.endCategory = tempArray[tempArray.length - 1].category;
                range.label.text = tempArray[0].provider;
                range.label.dy = 30;
                range.label.truncate = true;
                range.label.fontWeight = "bold";
                range.label.tooltipText = tempArray[0].provider;
    
            }
            chart.data = chartData;
            
            var range = categoryAxis.axisRanges.create();
            range.category = chart.data[chart.data.length - 1].category;
            range.label.disabled = true;
            range.tick.location = 1;
            range.grid.location = 1;
    
            let titles = chart.titles.create();
            titles.text = title;
            titles.fontSize = 25;
            titles.marginBottom = 60;
    }
}

export class ILT extends Chart
{
    buildChart(data, container, title, options){
        let option_section = options.option=='well'?'well_section':'rig_section';
        var chart = am4core.create(container, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;

        chart.data = data;

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = option_section;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;

        var label = categoryAxis.renderer.labels.template;
        label.truncate = true;
        label.maxWidth = 200;
        label.tooltipText = options.option=='well'?'{well_section}':'{rig_section}';

        categoryAxis.events.on("sizechanged", function(ev) {
            var axis = ev.target;
            var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            if (cellWidth < axis.renderer.labels.template.maxWidth) {
              axis.renderer.labels.template.rotation = -45;
              axis.renderer.labels.template.horizontalCenter = "right";
              axis.renderer.labels.template.verticalCenter = "middle";
            }
            else {
              axis.renderer.labels.template.rotation = 0;
              axis.renderer.labels.template.horizontalCenter = "middle";
              axis.renderer.labels.template.verticalCenter = "top";
            }
          });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;
        valueAxis.extraMax = 0.1;
        valueAxis.title.text = "Hours";

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.width = am4core.percent(80);
        series1.name = "PT";
        series1.dataFields.categoryX = option_section;
        series1.dataFields.valueY = "data";
        series1.fill = am4core.color("#50B5FA");
        ;
        series1.dataItems.template.locations.categoryX = 0.5;
        series1.stacked = true;
        series1.tooltip.pointerOrientation = "vertical";

        var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
        bullet1.interactionsEnabled = false;
        bullet1.label.fill = am4core.color("#ffffff");
        bullet1.locationY = 0.5;
        bullet1.label.text = "{valueY.formatNumber('#.00')}";
        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.columns.template.width = am4core.percent(80);

        series2.name = "Saving";
        series2.dataFields.categoryX = option_section;
        series2.dataFields.valueY = "saving";
        series2.dataItems.template.locations.categoryX = 0.5;
        series2.stacked = true;
        series2.fill = am4core.color("#66DE93");
        series2.tooltip.pointerOrientation = "vertical";

        var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
        bullet2.interactionsEnabled = false;
        bullet2.locationY = 0.5;
        bullet2.label.fill = am4core.color("#ffffff");

        series2.columns.template.events.on("sizechanged", function (ev) {
            if (ev.target.dataItem && ev.target.dataItem.bullets) {
                var height = ev.target.pixelHeight;
                ev.target.dataItem.bullets.each(function (id, bullet2) {
                    if (height > 0) {
                        bullet2.label.text = "{valueY.formatNumber('#.00')}";
                    } 
                });
            }
        });
        var series3 = chart.series.push(new am4charts.ColumnSeries());
        series3.columns.template.width = am4core.percent(80);
        series3.name = "Lost";
        series3.dataFields.categoryX = option_section;
        series3.dataFields.valueY = "lost";
        series3.dataItems.template.locations.categoryX = 0.5;
        series3.stacked = true;
        series3.tooltip.pointerOrientation = "vertical";
        series3.fill = am4core.color("#FF616D");
        ;

        var bullet3 = series3.bullets.push(new am4charts.LabelBullet());
        bullet3.interactionsEnabled = false;
        bullet3.locationY = 0.5;
        bullet3.label.fill = am4core.color("#ffffff");

        series3.columns.template.events.on("sizechanged", function (ev) {
            if (ev.target.dataItem && ev.target.dataItem.bullets) {
                var height = ev.target.pixelHeight;
                ev.target.dataItem.bullets.each(function (id, bullet3) {
                    if (height > 0) {
                        bullet3.label.text = "{valueY.formatNumber('#.00')}";
                    }
                });
            }
        });
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarY = new am4core.Scrollbar();
        chart.exporting.menu = new am4core.ExportMenu();

        let titles = chart.titles.create();
        titles.text = title
        titles.fontSize = 25;
        titles.marginBottom = 60;
    }
}