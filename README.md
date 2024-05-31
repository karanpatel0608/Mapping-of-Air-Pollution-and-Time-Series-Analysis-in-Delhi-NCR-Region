# Air Pollution and Time-Series Analysis in Delhi NCR Region Using Sentinel-5P Data

This repository contains a script to analyze the air pollution concentration (SO2, NO2, and Aerosols) over the Delhi NCR region using Sentinel-5P data. The script filters, processes, and visualizes the pollutant data from 2019 to 2022.

## Description

The script performs the following steps:

1. **Define the Delhi NCR Region**: A polygon is defined to represent the geographic boundaries of the Delhi NCR region.
2. **Set the Time Frame**: The analysis covers the period from January 1, 2019, to December 31, 2022.
3. **Load Sentinel-5P Data**: The script loads the Sentinel-5P SO2, NO2, and Aerosol data and filters it for the defined region and time frame.
4. **Visualize Pollutant Concentrations**: The mean concentrations of SO2, NO2, and Aerosols are calculated and visualized on a map.
5. **Generate Time Series**: The mean pollutant concentrations are mapped over time and time series charts are generated.
6. **Display Charts**: The time series charts are printed, showing the mean pollutant concentrations over the specified time period.

## Installation

To run this script, you need access to Google Earth Engine. Follow these steps:

1. Sign up for a Google Earth Engine account at [Google Earth Engine](https://earthengine.google.com/).
2. Create a new repository in the Google Earth Engine Code Editor.
3. Copy and paste the provided script into the Code Editor.

## Usage

```javascript
var Delhi = /* color: #d63000 */ ee.Geometry.Polygon(
    [[[77.08671678482938, 29.045496966211243],
    [76.04301561295438, 28.486930812729636],
    [76.18583787857938, 27.380437741680847],
    [77.59208787857938, 27.048252928722075],
    [77.96562303482938, 27.867135944057168],
    [78.41606248795438, 28.997462660356984],
    [77.71293748795438, 29.381109913313846]]]);

var vizParameters = {
    SO2: {
      collection: ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_SO2")
        .filterBounds(Delhi)
        .filterDate('2019-01-01', '2022-12-31')
        .select('SO2_column_number_density'),
      viz: {
        min: 0.0,
        max: 0.0005,
        palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
      },
      scale: 5000
    },
    NO2: {
      collection: ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
        .filterBounds(Delhi)
        .filterDate('2019-01-01', '2022-12-31')
        .select('tropospheric_NO2_column_number_density'),
      viz: {
        min: 0,
        max: 0.0002,
        palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
      },
      scale: 5000
    },
    Aerosol: {
      collection: ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_AER_AI")
        .filterBounds(Delhi)
        .filterDate('2019-01-01', '2022-12-31')
        .select('absorbing_aerosol_index'),
      viz: {
        min: -1,
        max: 2.0,
        palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
      },
      scale: 5000
    }
};

Object.keys(vizParameters).forEach(function(key) {
    var dataset = vizParameters[key].collection;
    var band_viz = vizParameters[key].viz;
    var scale = vizParameters[key].scale;

    var monthlyMeans = ee.ImageCollection.fromImages(
      ee.List.sequence(0, 35).map(function(month) {
        var startDate = ee.Date('2019-01-01');
        var startMonth = startDate.advance(month, 'month');
        var endMonth = startMonth.advance(1, 'month');
        var datasetOfMonth = dataset.filterDate(startMonth, endMonth);
        var meanValue = datasetOfMonth.mean().set('system:time_start', startMonth);
        return meanValue.set('month', startMonth.format('YYYY-MM'));
      })
    );

    var chart = ui.Chart.image.seriesByRegion({
      imageCollection: monthlyMeans,
      regions: Delhi,
      reducer: ee.Reducer.mean(),
      scale: scale,
      xProperty: 'system:time_start',
      seriesProperty: 'month'
    }).setOptions({
      title: 'Monthly Mean ' + key + ' Concentration (2019-2022)',
      hAxis: { title: 'Time' },
      vAxis: { title: key + ' Concentration' }
    });

    print('Time-series chart for ' + key + ':', chart);

    Map.addLayer(monthlyMeans.mean().clip(Delhi), band_viz, 'Average ' + key + ' Concentration', false);
});

Map.setCenter(77.1025, 28.7041, 10); // Centered on Delhi
```
## Results

The script will generate time series charts displaying the mean concentrations of SO2, NO2, and Aerosols over Delhi NCR from 2019 to 2022. The visualizations use a color palette to indicate varying concentrations of pollutants, with the charts providing a detailed temporal analysis.

## Contributing

If you would like to contribute to this project, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact `Karanp0608@gmail.com`
