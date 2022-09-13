import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { nest } from 'd3-collection';

class Chart 
{
    /**
     * Abstract class 
     * @param {*} data : Data to display in he chart
     * @param {*} container HTML div where to render the chart
     */
    constructor(data, container, title = ''){
        if(this.constructor === Chart){
            throw new Error("FYI: Abstract class 'Chart' cannot be instantiated");
        }

        am4core.options.autoDispose = true;
        this.chart = this.buildChart(data, container, title);
    }

    /**
     * Takes data and a container to render a chart in. Each sub objct should impliment this function
     * @param {*} data Chart data
     * @param {*} container html container to render the chart in
     */
    buildChart(data, container, title){
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

export class PieChart extends Chart
{   
    buildChart(data, container, title){
        
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
        
        let chart = am4core.create(container, am4charts.PieChart);
    
        // Create pie series
        let series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = params?.value;
        series.dataFields.category = params?.category;

        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 25;
        chartTitle.marginBottom = 30;
        
        // Add data
        chart.data = data;
        return chart;
      }
}

export class BarChart extends Chart
{
    buildChart(data, container, title){
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

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = params?.value;
        series.dataFields.categoryX = params?.category;
        series.name = params?.value;
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = -10;
            bullet.label.text = '[bold]{valueY}'
            bullet.label.fill = am4core.color('#555')
        

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
    
        var chartTitle = chart.titles.create();
        chartTitle.text = title;
        chartTitle.fontSize = 25;
        chartTitle.marginBottom = 30;

        // Add data
        chart.data = data;
        return chart;
      }
}

export class ClusteredBarChart extends Chart
{
    buildChart(data, container, title){
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

        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

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
            bullet.label.fill = am4core.color('#555')
            return series;
        }

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
        chartTitle.fontSize = 25;
        chartTitle.marginBottom = 30;


    }
}