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
    defined,
    IonResource,
    GeoJsonDataSource,
    ClassificationType,
    Rectangle,
    Color,
    VerticalOrigin,
    Quaternion,
    HeadingPitchRange,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Cesium3DTileset, Cartographic
} from "cesium";


import {AmapImageryProvider, CoordTransform, GoogleImageryProvider, TdtImageryProvider} from './cesium-map'
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"
import StoredView from "./StoredView"
import $ from 'jquery';

import 'jquery-ui';
import EllipsoidElectricMaterialProperty from "./ellipsoidElectricMaterialProperty";



$(document).ready(function () {

// Your access token can be found at: https://com/ion/tokens.
// This is the default access token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Mjc3MjlkYS03OTcyLTRjOGMtYWYwOC1hNzM4MjI3NWUyMTMiLCJpZCI6MTE0MDQ2LCJpYXQiOjE2Njc4NzI3Nzh9.hLyNLUZKhv2tkHKwPa-HXDOvuLVj3gZ9Z8z9xYaZPXE'


    const ws = [114.191718, 30.532629]
    const en = [114.203294, 30.527084]
    const wsr = CoordTransform.GCJ02ToWGS84(...ws);
    const enr = CoordTransform.GCJ02ToWGS84(...en);

    const extent = Rectangle.fromDegrees(...wsr, ...enr);
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
    viewer.cesiumWidget.creditContainer.style.display = "none";  // 隐藏Logo

    window.viewer = viewer;


// Add Cesium OSM Buildings, a global 3D buildings layer.
// viewer.scene.primitives.add(createOsmBuildings());   


//WGS84 下模型位置正确
//视点的高德纠偏 CoordTransform.GCJ02ToWGS84(...ori);

    const optionsGD = {
        style: 'img', // style: img、elec、cva
        crs: 'WGS84' // 使用84坐标系，默认为：GCJ02 WGS84
    }
    viewer.imageryLayers.addImageryProvider(new AmapImageryProvider(optionsGD))

    // var optionsTdt = {
    //     style: 'vec', //style: vec、cva、img、cia、ter
    //     key: ''
    // }
    // viewer.imageryLayers.addImageryProvider(new TdtImageryProvider(optionsTdt))

    // var optionsGoogle = {
    //     style: 'img' ,//style: img、elec、ter
    // }
    // viewer.imageryLayers.addImageryProvider(new GoogleImageryProvider(optionsGoogle))


    const ori = [114.197222, 30.529809]
    const des = CoordTransform.GCJ02ToWGS84(...ori);

// Fly the camera to 中南科研设计中心 at the given longitude, latitude, and height.
// viewer.zoomTo(datasource);


    const posZnkysjzx = Cartesian3.fromDegrees(...des, 10);
    let heading = Math.toRadians(-54);
    let pitch = Math.toRadians(90);
    let roll = Math.toRadians(0);
    const hpr = new HeadingPitchRoll(heading, pitch, roll);
    const orientation = Transforms.headingPitchRollQuaternion(
        posZnkysjzx,
        hpr
    );

    let hprCal = new HeadingPitchRoll();

    HeadingPitchRoll.fromQuaternion(orientation, hprCal);

    console.log('hpr', hpr, 'hprCal:', hprCal, 'hpr.equals:', hpr.equals(hprCal));


    const entityEnv = viewer.entities.add({
        name: 'znkysjzx',
        position: posZnkysjzx,
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
        position: posZnkysjzx,
        orientation: orientation,
        model: {
            // uri: '/zzz-cesium/znkyzjzx/Cesium_Air.glb',
            uri: '/zzz-cesium/znkyzjzx/new.gltf',
            minimumPixelSize: 128,
            maximumScale: 20000
        }
    });
// viewer.trackedEntity = entityNew;// 缩放时候始终居中显示模型


    console.log($('toolbar'));

// viewer.camera.flyTo({
//   destination: Cartesian3.fromDegrees(...des, 15000),
//   // orientation : {
//   //   heading : Math.toRadians(0.0),
//   //   pitch : Math.toRadians(-15.0),
//   // }
// });


//var datasource = viewer.dataSources.add(GeoJsonDataSource.load("https://geo.datav.aliyun.com/areas_v2/bound/100000.json"));
// var datasource = viewer.dataSources.add(GeoJsonDataSource.load("/zzz-cesium/geojson/武汉市.json"));


// STEP 3 CODE
    async function addBuildingGeoJSON() {
        // Load the GeoJSON file from Cesium ion.
        const geoJSONURL = await IonResource.fromAssetId(1394429);
        // Create the geometry from the GeoJSON, and clamp it to the ground.
        const geoJSON = await GeoJsonDataSource.load(geoJSONURL, {clampToGround: true});
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


    var origin = new Cartesian3.fromDegrees(...wsr, 10);
    var target = new Cartesian3.fromDegrees(...enr, 20);

// Origin point
    viewer.entities.add({
        position: origin,
        point: {
            color: Color.LIGHTBLUE,
            pixelSize: 2,
            outlineColor: Color.WHITE,
            outlineWidth: 1
        },
        label: {
            text: 'Origin',
            pixelOffset: {x: 0, y: 20},
            verticalOrigin: VerticalOrigin.TOP
        }
    });

// Target point
    viewer.entities.add({
        position: target,
        point: {
            color: Color.GREENYELLOW,
            pixelSize: 2,
            outlineColor: Color.WHITE,
            outlineWidth: 1
        },
        label: {
            text: 'Target',
            pixelOffset: {x: 0, y: 20},
            verticalOrigin: VerticalOrigin.TOP
        }
    });

// Cone should point to 'target' from 'origin'
    var direction = Cartesian3.subtract(target, origin, new Cartesian3());
    Cartesian3.normalize(direction, direction);

    var hprdemo = HeadingPitchRoll.fromQuaternion(
        Quaternion.fromRotationMatrix(
            Transforms.rotationMatrixFromPositionVelocity(origin, direction)
        )
    );

    viewer.entities.add({
        position: origin,
        orientation: Transforms.headingPitchRollQuaternion(origin, hprdemo),
        cylinder: {
            length: 1,
            topRadius: 0,
            bottomRadius: 5,
            material: Color.LIGHTBLUE.withAlpha(0.8)
        }
    });

// Visualize direction
    var directionRay = Cartesian3.multiplyByScalar(direction, 1000, new Cartesian3());
    Cartesian3.add(origin, directionRay, directionRay);

    viewer.entities.add({
        polyline: {
            positions: [origin, directionRay],
            width: 1,
            material: Color.WHITE
        }
    });


    var clock = viewer.clock;


    let camHelper = new StoredView();

    const deafultView = {
        "position": {"x": -2253224.177909685, "y": 5016391.577905813, "z": 3221055.568733604},
        "heading": 0.5956001667469932,
        "pitch": -0.5860326391454347,
        "roll": 6.283170639418247
    };


    camHelper.loadDefault(viewer.scene.camera, deafultView);



    // 电弧球体效果
    viewer.entities.add({
        position: Cartesian3.fromDegrees(112.257925,31.998067),
        name: '电弧球体',
        ellipsoid: {
            radii: new Cartesian3(1000.0, 1000.0, 1000.0),
            material: new EllipsoidElectricMaterialProperty({
                color: new Color(1.0, 1.0, 0.0, 1.0),
                speed: 10.0
            })
        }
    })



    $("#btnSaveCam").click(function () {
        if (viewer) {
            camHelper.save(viewer.scene.camera)
            console.log(JSON.stringify(camHelper));
        }
    });

    $("#btnRestoreCam").click(function () {
        if (camHelper?.position) {
            camHelper.load(viewer.scene.camera)
        } else {
            alert("btnSaveCam before restore")
        }
    })


    $("#btnShowRotateTool").click(function () {

        $("#toolbar").toggle();

        if ($("#toolbar").css('display') === "none")
            $("#btnShowRotateTool").html('ShowRotateTool');
        else
            $("#btnShowRotateTool").html('HideRotateTool');

    })

    $('input[type=range]').on("input", function () {
        console.log($(this).next().attr('id'));
        $(this).next().val($(this).val());
        let RotateX = $('#valX').val();
        let RotateY = $('#valY').val() + 90;
        let RotateZ = $('#valZ').val();

        let heading = Math.toRadians(RotateX);
        let pitch = Math.toRadians(RotateY);
        let roll = Math.toRadians(RotateZ);

        const hpr = new HeadingPitchRoll(heading, pitch, roll);
        const orientation = Transforms.headingPitchRollQuaternion(
            entityNew.position.getValue(clock.currentTime),
            hpr
        );
        console.log('entityNew', entityNew);
        entityNew.orientation = orientation;
        console.log($(this).val());
    })


    $('#btnGoHQC').click(function () {


        var hqcView = {
            "position": {"x": -2051892.3609135228, "y": 5014106.451680679, "z": 3362764.757320823},
            "heading": 0.0247780790743537,
            "pitch": -1.5289612952233589,
            "roll": 0
        };

        camHelper.loadDefault(viewer.scene.camera, hqcView);


    });
    $('#btnLoadHQC').click(function () {

        console.log('btnLoadHQC');

        var hqcView = {
            "position": {"x": -2051892.3609135228, "y": 5014106.451680679, "z": 3362764.757320823},
            "heading": 0.0247780790743537,
            "pitch": -1.5289612952233589,
            "roll": 0
        };

        camHelper.loadDefault(viewer.scene.camera, hqcView);

        function changeHeight(height) {
            height = Number(height);
            if (isNaN(height)) {
                return;
            }

            var cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            var offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
            tileset.modelMatrix = Matrix4.fromTranslation(translation);
        }


        var params = {

            tx: 112.257925-0.0038,  //模型中心X轴坐标（经度，单位：十进制度）//天地图 112.257925-0.0038

            ty: 31.998067+0.0038,    //模型中心Y轴坐标（纬度，单位：十进制度）//天地图31.998067+0.0038

            tz: 0,    //模型中心Z轴坐标（高程，单位：米）

            rx: 0,    //X轴（经度）方向旋转角度（单位：度）

            ry: 0,    //Y轴（纬度）方向旋转角度（单位：度）

            rz: 0,       //Z轴（高程）方向旋转角度（单位：度）

            scale: 1   //缩放比例

        };

        //平移、贴地、旋转模型

        function update3dtilesMaxtrix(tileset) {

            //旋转

            var mx = Matrix3.fromRotationX(Math.toRadians(params.rx));

            var my = Matrix3.fromRotationY(Math.toRadians(params.ry));

            var mz = Matrix3.fromRotationZ(Math.toRadians(params.rz));

            var rotationX = Matrix4.fromRotationTranslation(mx);

            var rotationY = Matrix4.fromRotationTranslation(my);

            var rotationZ = Matrix4.fromRotationTranslation(mz);

            //平移

            var position = Cartesian3.fromDegrees(params.tx, params.ty, params.tz);

            var m = Transforms.eastNorthUpToFixedFrame(position);

            //旋转、平移矩阵相乘

            Matrix4.multiply(m, rotationX, m);

            Matrix4.multiply(m, rotationY, m);

            Matrix4.multiply(m, rotationZ, m);

            //赋值给tileset

            tileset._root.transform = m;

            //缩放

            zoom3dtiles(tileset);

        }

        function  zoom3dtiles(tileset) {

            var scale = (params.scale || 1) * 1;

            tileset._root.customTransform = {

                matrix: {

                    origin: tileset._root.transform.clone(),

                    rotation: Matrix4.IDENTITY,

                    translation: Matrix4.IDENTITY,

                }

            };

            var m1 = Matrix4.fromScale(new Cartesian3(scale, scale, scale));

            tileset._root.customTransform.matrix.scale = m1;

            tileset._root.customTransform.scale = scale;

            var m2 = new Matrix4();

            Matrix4.multiply(tileset._root.customTransform.matrix.origin, tileset._root.customTransform.matrix.rotation, m2);

            Matrix4.multiply(m2, tileset._root.customTransform.matrix.scale, m2);

            Matrix4.multiply(m2, tileset._root.customTransform.matrix.translation, tileset._root.transform);

        }





        function zoomToTileset() {
            let boundingSphere = tileset.boundingSphere;
            viewer.camera.viewBoundingSphere(boundingSphere, new HeadingPitchRange(0, -2.0, 0));
            viewer.camera.lookAtTransform(Matrix4.IDENTITY);

            changeHeight(0);
        }

        // var tileset = new AmapMercatorTilingScheme({
        var tileset = new Cesium3DTileset({
            url: '/hqc/tileset.json',
            maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
            maximumScreenSpaceError: 2, //最大的屏幕空间误差


        });
        tileset.readyPromise.then(function (tileset) {

            viewer.scene.primitives.add(tileset);
            // 建立从局部到世界的坐标矩阵
            // var position = Cartesian3.fromDegrees(0.0001,0,0);
            // var mtx = Transforms.eastNorthUpToFixedFrame(position);
            // Matrix4.multiplyByUniformScale(mtx,1,mtx);
            // tileset._root.transform = mtx;

            // viewer.zoomTo(tileset, new HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0));

            zoomToTileset();

            update3dtilesMaxtrix(tileset);



        }).catch(function (error) {
            console.log(error);
        });


    })


    var handler = new ScreenSpaceEventHandler(viewer.canvas);

    $('#btnListenClickPt').click(function () {
        handler.setInputAction(function (event) {
            //event.position为屏幕坐标
            console.log(event.position);
            //获取包含了地形、倾斜摄影表面、模型的世界坐标
            //解决在没有3dTile模型下的笛卡尔坐标不准问题,viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
            var pickedPosition = viewer.scene.pickPosition(event.position);
            if (defined(pickedPosition)) {
                console.log('1获取包含了地形、倾斜摄影表面、模型的世界坐标:', pickedPosition);
            }
            //获取地球表面的世界坐标，包含地形，不包含其他模型
            //Create a ray from the camera position through the pixel at windowPosition in world coordinates.
            var ray = viewer.camera.getPickRay(event.position);
            //Find an intersection between a ray and the globe surface that was rendered. The ray must be given in world coordinates.
            var position2 = viewer.scene.globe.pick(ray, viewer.scene);
            console.log('2获取地球表面的世界坐标:', position2);
            //获取参考椭球的世界坐标
            var position3 = viewer.scene.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
            console.log('3获取参考椭球的世界坐标:', position3);


            var pick = viewer.scene.pick(event.position);
            if (pick && pick.id) {
                //点击物体的属性都存在pick.id内部
                alert("点击到了：" + pick.id._id);
                console.log(pick);
            }


        }, ScreenSpaceEventType.LEFT_CLICK);
    })

    $('#btnRemoveCLickPt').click(function () {
        handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
        console.log('关闭了取点');
    })


});


