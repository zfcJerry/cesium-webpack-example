import {
  Matrix4,
  Matrix3,
  Ion,
  Camera,
  Viewer,
  Transforms,
  HeadingPitchRoll,
  createWorldTerrain,
  createOsmBuildings,
  Cartesian3,
  Math,
  IonResource,
  GeoJsonDataSource,
  ClassificationType,
  Rectangle
} from "cesium";

import { AmapImageryProvider, CoordTransform } from './cesium-map'
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"

import $ from 'jquery';

import 'jquery-ui';



// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Mjc3MjlkYS03OTcyLTRjOGMtYWYwOC1hNzM4MjI3NWUyMTMiLCJpZCI6MTE0MDQ2LCJpYXQiOjE2Njc4NzI3Nzh9.hLyNLUZKhv2tkHKwPa-HXDOvuLVj3gZ9Z8z9xYaZPXE'

const ws=[114.191718,30.532629]
const en = [114.203294,30.527084]
const wsr = CoordTransform.GCJ02ToWGS84(...ws);
const enr = CoordTransform.GCJ02ToWGS84(...en);

const extent = Rectangle.fromDegrees(...wsr,...enr);
Camera.DEFAULT_VIEW_RECTANGLE = extent;
Camera.DEFAULT_VIEW_FACTOR = 0;




// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer('cesiumContainer', {
  // terrainProvider: createWorldTerrain()
  geocoder: false, //一种地理位置搜索工具，用于显示相机访问的地理位置。默认使用微软的Bing地图。
  homeButton: true, //首页位置，点击之后将视图跳转到默认视角。
  sceneModePicker: true, //切换2D、3D 和 Columbus View (CV) 模式。
  baseLayerPicker: false, //选择三维数字地球的底图（imagery and terrain）。
  navigationHelpButton: true, //帮助提示，如何操作数字地球。
  animation: false,//控制视窗动画的播放速度。
  creditsDisplay: false, //展示商标版权和数据源。
  timeline: false, //展示当前时间和允许用户在进度条上拖动到任何一个指定的时间。
  fullscreenButton: true, //视察全屏按钮,
  // terrainProvider: createWorldTerrain()//地形
});

viewer.scene.globe.enableLighting = true;//启用以太阳为光源的地球

window.viewer=viewer;

// var positionC;
//
// Sandcastle.addToolbarButton('Save', function() {
//   positionC = viewer.scene.camera.positionWC.clone();
// });
//
// Sandcastle.addToolbarButton('Load', function() {
//   viewer.scene.camera.setView({
//     destination:  positionC.clone()
//   });
// });

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
const ori = [114.197222, 30.529809]
const des = CoordTransform.GCJ02ToWGS84(...ori);
//  console.log(des);

// Fly the camera to 洪山广场 at the given longitude, latitude, and height.


//var datasource = viewer.dataSources.add(Cesium.GeoJsonDataSource.load("https://geo.datav.aliyun.com/areas_v2/bound/100000.json"));
// var datasource = viewer.dataSources.add(GeoJsonDataSource.load("/zzz-cesium/geojson/武汉市.json"));
// viewer.zoomTo(datasource);


const position = Cartesian3.fromDegrees(...des, 10);
let heading = Math.toRadians(-54);
let pitch = Math.toRadians(90);
let roll = Math.toRadians(0);
const hpr = new HeadingPitchRoll(heading, pitch, roll);
const orientation = Transforms.headingPitchRollQuaternion(
  position,
  hpr
);

const entityEnv = viewer.entities.add({
  name: 'znkysjzx',
  position: position,
  orientation: orientation,
  model: {
    // uri: '/zzz-cesium/znkyzjzx/Cesium_Air.glb',
    uri: '/zzz-cesium/znkyzjzx/env.gltf',
    minimumPixelSize: 128,
    maximumScale: 20000
  }
});

const entityNew = viewer.entities.add({
  name: 'znkysjzx',
  position: position,
  orientation: orientation,
  model: {
    // uri: '/zzz-cesium/znkyzjzx/Cesium_Air.glb',
    uri: '/zzz-cesium/znkyzjzx/new.gltf',
    minimumPixelSize: 128,
    maximumScale: 20000
  }
});
// viewer.trackedEntity = entity;


console.log($('toolbar'));

// viewer.camera.flyTo({
//   destination: Cartesian3.fromDegrees(...des, 15000),
//   // orientation : {
//   //   heading : Math.toRadians(0.0),
//   //   pitch : Math.toRadians(-15.0),
//   // }
// });



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
  // viewer.flyTo(dataSource);
}

addBuildingGeoJSON();


var clock = viewer.clock;



$(document).on('input', '.slider', function () {

  console.log($(this).next().attr('id'));

  $(this).next().val($(this).val());

  let RotateX = $('#valX').val();
  let RotateY = $('#valY').val()+90;
  let RotateZ = $('#valZ').val();
  // RotateX = Number(RotateX);
  // if (isNaN(RotateX)) {
  //     return;
  // }

  // console.log(entityEnv);
  // var m = entityEnv.modelMatrix; 

  // debugger;

  // var m1 = Matrix3.fromRotationX(Math.toRadians(RotateX));   
  // entityEnv.modelMatrix = Matrix4.multiplyByMatrix3(m,m1,new Matrix4());

  let heading = Math.toRadians(RotateX);
  let pitch = Math.toRadians(RotateY);
  let roll = Math.toRadians(RotateZ);

  const hpr = new HeadingPitchRoll(heading, pitch, roll);
  const orientation = Transforms.headingPitchRollQuaternion(
      entityNew.position.getValue(clock.currentTime),
    hpr
  );

  // entityEnv.position.getValue()

  console.log('entityNew',entityNew);

  entityNew.orientation=orientation;

  console.log($(this).val());





});




