

/*
 * @Description: 电弧球体效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-04 15:57:40
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-04 16:20:31
 */

import createPropertyDescriptor from "cesium/Source/DataSources/createPropertyDescriptor.js";
import {Color, Material, Event, Property, defined} from "cesium";


export default class EllipsoidElectricMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Event();
        this._color = undefined;
        this._speed = undefined;
        this.color = options.color;
        this.speed = options.speed;
    }

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return Material.EllipsoidElectricMaterialType;
    }

    getValue(time, result) {
        if (!defined(result)) {
            result = {};
        }

        result.color = Property.getValueOrDefault(this._color, time, Color.RED, result.color);
        result.speed = Property.getValueOrDefault(this._speed, time, 10, result.speed);
        return result;
    }

    equals(other) {
        return (this === other ||
            (other instanceof EllipsoidElectricMaterialProperty &&
                Property.equals(this._color, other._color) &&
                Property.equals(this._speed, other._speed)))
    }
}

Object.defineProperties(EllipsoidElectricMaterialProperty.prototype, {
    color: createPropertyDescriptor('color'),
    speed: createPropertyDescriptor('speed')
})

EllipsoidElectricMaterialProperty = EllipsoidElectricMaterialProperty;
Material.EllipsoidElectricMaterialProperty = 'EllipsoidElectricMaterialProperty';
Material.EllipsoidElectricMaterialType = 'EllipsoidElectricMaterialType';
Material.EllipsoidElectricMaterialSource =
    `
	uniform vec4 color;
	uniform float speed;
	
	#define pi 3.1415926535
	#define PI2RAD 0.01745329252
	#define TWO_PI (2. * PI)
	
	float rands(float p){
	return fract(sin(p) * 10000.0);
	}
	
	float noise(vec2 p){
	float time = fract( czm_frameNumber * speed / 1000.0);
	float t = time / 20000.0;
	if(t > 1.0) t -= floor(t);
	return rands(p.x * 14. + p.y * sin(t) * 0.5);
	}
	
	vec2 sw(vec2 p){
	return vec2(floor(p.x), floor(p.y));
	}
	
	vec2 se(vec2 p){
	return vec2(ceil(p.x), floor(p.y));
	}
	
	vec2 nw(vec2 p){
	return vec2(floor(p.x), ceil(p.y));
	}
	
	vec2 ne(vec2 p){
	return vec2(ceil(p.x), ceil(p.y));
	}
	
	float smoothNoise(vec2 p){
	vec2 inter = smoothstep(0.0, 1.0, fract(p));
	float s = mix(noise(sw(p)), noise(se(p)), inter.x);
	float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
	return mix(s, n, inter.y);
	}
	
	float fbm(vec2 p){
	float z = 2.0;
	float rz = 0.0;
	vec2 bp = p;
	for(float i = 1.0; i < 6.0; i++){
	    rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
	    z *= 2.0;
	    p *= 2.0;
	}
	return rz;
	}
	
	czm_material czm_getMaterial(czm_materialInput materialInput)
	{
	czm_material material = czm_getDefaultMaterial(materialInput);
	vec2 st = materialInput.st;
	vec2 st2 = materialInput.st;
	float time = fract( czm_frameNumber * speed / 1000.0);
	if (st.t < 0.5) {
	    discard;
	}
	st *= 4.;
	float rz = fbm(st);
	st /= exp(mod( time * 2.0, pi));
	rz *= pow(15., 0.9);
	vec4 temp = vec4(0);
	temp = mix( color / rz, vec4(color.rgb, 0.1), 0.2);
	if (st2.s < 0.05) {
	    temp = mix(vec4(color.rgb, 0.1), temp, st2.s / 0.05);
	}
	if (st2.s > 0.95){
	    temp = mix(temp, vec4(color.rgb, 0.1), (st2.s - 0.95) / 0.05);
	}
	material.diffuse = temp.rgb;
	material.alpha = temp.a * 2.0;
	return material;
	}
	`

Material._materialCache.addMaterial(Material.EllipsoidElectricMaterialType, {
    fabric: {
        type: Material.EllipsoidElectricMaterialType,
        uniforms: {
            color: new Color(1.0, 0.0, 0.0, 1.0),
            speed: 10.0
        },
        source: Material.EllipsoidElectricMaterialSource
    },
    translucent: function(material) {
        return true;
    }
})