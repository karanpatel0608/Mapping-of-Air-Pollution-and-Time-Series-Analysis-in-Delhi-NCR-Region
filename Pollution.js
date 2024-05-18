// Define visualization parameters for each dataset
// Mapping of Air Pollution and Time-Series Analysis in Delhi NCR Region

// Project Link- https://code.earthengine.google.com/e3dc49a32a57911c7c24ed4957cd9784

//Area of delhi NCR was choosen from Maps and then the coordinates were used to define the region of interest(Google Earth Engine)

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
      scale: 5000  // Adjust the scale for better clarity
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
      scale: 5000  // Adjust the scale for better clarity
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
      scale: 5000  // Adjust the scale for better clarity
    }
  };
  
  // Create charts and add layers for NO2, SO2, and Aerosol
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
  
    // Display the time-series chart on the console
    print('Time-series chart for ' + key + ':', chart);
  
    // Add the average concentration as a layer on the map
    Map.addLayer(monthlyMeans.mean().clip(Delhi), band_viz, 'Average ' + key + ' Concentration', false);
  });
  
  // Set the center of the map
  Map.setCenter(77.1025, 28.7041, 10); // Centered on Delhi
  