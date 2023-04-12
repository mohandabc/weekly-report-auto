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
        series.labels.template.text = '[bold]{value.formatNumber("#.#")}';
        series.labels.template.radius = am4core.percent(-25);
        series.labels.template.padding(0, 0, 0, 0);
        series.labels.template.fill = am4core.color('white');
        series.ticks.template.events.on("ready", hideSmall);
        series.ticks.template.events.on("visibilitychanged", hideSmall);
        series.labels.template.events.on("ready", hideSmall);
        series.labels.template.events.on("visibilitychanged", hideSmall);
        series.slices.template.tooltipText = "{category}: {value.formatNumber('#.#')}%";
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
        legend.position = "right";
        legend.labels.template.fontSize = 11;
        legend.valueLabels.template.fontSize = 11;
        chart.legend = legend;

        chart.exporting.menu = new am4core.ExportMenu();
        return chart;

        function hideSmall(ev) {
            if (ev.target.dataItem && (ev.target.dataItem.values.value.percent < 1.5)) {
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

        categoryAxis.renderer.labels.template.fill = options["label-color"];
        categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
        if (target.dataItem && data.length >= 8 && target.dataItem.index % 2 !== 0 ) {
            //if there are too much data, alternate the positions of names of bars
            return dy + 25;
        }
        return dy;
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
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = -15;
            bullet.label.text = '[bold]{valueY}';
            bullet.label.fill = am4core.color(options['value-color']);
        

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
    
        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fill = options["title-color"];
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

// Customized Charts for just one case

export class StackedBarChart extends Chart
{
    buildChart(data, container, title, options){
        var chart = am4core.create(container, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data = data
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;


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
        
        // Make it stacked
        series.stacked = true;
        
        // Configure columns
        series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
        
        // Add label
        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "[bold]{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;
        labelBullet.label.fill = "#FFFFFF";
        
        return series;
        }

        createSeries("value1", "PT");
        createSeries("value2", "NPT");


        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 24;
        chartTitle.fill = options["title-color"];
        chartTitle.marginBottom = 30;

    }
}

export class DateAxes extends Chart
{
    buildChart(data, container, title, options){
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
            series1.tensionX = 0.8;
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
            series2.tensionX = 0.8;
            series2.showOnInit = true;
            series2.stroke = color2;
            series2.tooltip.getFillFromObject = false;
            series2.tooltip.background.fill = color2;
            
            valueAxis.strictMinMax = false;
            let minValue = Infinity;
            let maxValue = -Infinity;
            let dataLength = chart.data.length;
            for (let i = 0; i < dataLength; i++) {
                let value1 = chart.data[i]?.[field1];
                let value2 = chart.data[i]?.[field2];

                if (typeof value2 === 'number' && value2 !== undefined && !isNaN(value2)) {
                    minValue = Math.floor(Math.min(minValue, value1, value2));
                    maxValue = Math.ceil(Math.max(maxValue, value1, value2));
                    
                }
              }
            valueAxis.min = minValue
            valueAxis.max = maxValue

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