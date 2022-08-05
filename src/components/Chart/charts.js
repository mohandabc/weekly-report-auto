import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

class Chart 
{
    /**
     * Abstract class 
     * @param {*} data : Data to display in he chart
     * @param {*} container HTML div where to render the chart
     */
    constructor(data, container){
        if(this.constructor === Chart){
            throw new Error("FYI: Abstract class 'Chart' cannot be instantiated");
        }

        am4core.options.autoDispose = true;
        this.chart = this.buildChart(data, container);
    }

    buildChart(data, container){
        /*override this function to define a chart */
    }
}

export class PieChart extends Chart
{   
    buildChart(data, container){
        let chart = am4core.create(container, am4charts.PieChart);
    
        // Create pie series
        let series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "litres";
        series.dataFields.category = "country";
    
        // Add data
        chart.data = data;
        return chart;
      }
}

export class BarChart extends Chart
{
    buildChart(data, container){
        let chart = am4core.create(container, am4charts.XYChart);
    
        // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;

        categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
        if (target.dataItem && target.dataItem.index % 2 !== 0) {
            return dy + 25;
        }
        return dy;
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.name = "Visits";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
    
        // Add data
        chart.data = data;
        return chart;
      }
}