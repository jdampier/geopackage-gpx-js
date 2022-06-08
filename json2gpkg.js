const { GeoJSONToGeoPackage } = require('@ngageoint/geopackage-geojson-js');
const geoJSONFile = 'files/test.json';
const geoPackageFile = 'files/test.gpkg';
const tableName = 'features';

// Convert GeoJSON to GeoPackage feature table
const converter = new GeoJSONToGeoPackage();
converter.convert({ geoJson: geoJSONFile, geoPackage: geoPackageFile, tableName: tableName }).then(() => {
  console.log('File conversion complete');
});

// // Extract GeoJSON from GeoPackage feature table
// converter.extract(geoPackageFile, tableName).then(geoJSON => {
//   console.log('Extracted GeoJSON - %s features.', geoJSON.features.length);
// })