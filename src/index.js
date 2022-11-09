import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math,IonResource,GeoJsonDataSource,ClassificationType } from "cesium";

import {AmapImageryProvider,CoordTransform} from './cesium-map'
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"  

 

 
// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Mjc3MjlkYS03OTcyLTRjOGMtYWYwOC1hNzM4MjI3NWUyMTMiLCJpZCI6MTE0MDQ2LCJpYXQiOjE2Njc4NzI3Nzh9.hLyNLUZKhv2tkHKwPa-HXDOvuLVj3gZ9Z8z9xYaZPXE'

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
  // terrainProvider: createWorldTerrain()
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
// viewer.scene.primitives.add(createOsmBuildings());   


//WGS84 下模型位置正确
//视点的高德纠偏 CoordTransform.GCJ02ToWGS84(...ori);

const options = {
  style: 'elec', // style: img、elec、cva
  crs: 'WGS84' // 使用84坐标系，默认为：GCJ02 WGS84
}

 //中南路地铁站
viewer.imageryLayers.addImageryProvider(new AmapImageryProvider(options))
const ori=[114.332956,30.537535]
const des=CoordTransform.GCJ02ToWGS84(...ori);
//  console.log(des);

// Fly the camera to 洪山广场 at the given longitude, latitude, and height.
viewer.camera.flyTo({
  destination :  Cartesian3.fromDegrees(...des,1500),
  // orientation : {
  //   heading : Math.toRadians(0.0),
  //   pitch : Math.toRadians(-15.0),
  // }
});


// STEP 3 CODE
async function addBuildingGeoJSON() {
  // Load the GeoJSON file from Cesium ion.
  const geoJSONURL = await IonResource.fromAssetId(1394429);
  // Create the geometry from the GeoJSON, and clamp it to the ground.
  const geoJSON = await GeoJsonDataSource.load(geoJSONURL, { clampToGround: true });
  // Add it to the scene.
  const dataSource = await viewer.dataSources.add(geoJSON);
  // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
  // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
  for (const entity of dataSource.entities.values) {
    // entity.polygon.classificationType = ClassificationType.TERRAIN;
  }
  // Move the camera so that the polygon is in view.
  viewer.flyTo(dataSource);
}

addBuildingGeoJSON();
 



