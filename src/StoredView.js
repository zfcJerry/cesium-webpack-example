import {Cartesian3} from "cesium";

var StoredView = function() {
    this.position = undefined;
    this.heading = undefined;
    this.pitch = undefined;
    this.roll = undefined;

};

StoredView.prototype.save = function(camera) {
    this.position = Cartesian3.clone(camera.positionWC, this.position);
    this.heading = camera.heading;
    this.pitch = camera.pitch;
    this.roll = camera.roll;
};

StoredView.prototype.load = function(camera) {
    camera.setView({
        destination : this.position,
        orientation: {
            heading : this.heading,
            pitch : this.pitch,
            roll : this.roll
        }
    });
};

StoredView.prototype.loadDefault = function(camera,camInfo) {
    camera.setView({
        destination : camInfo.position,
        orientation: {
            heading : camInfo.heading,
            pitch : camInfo.pitch,
            roll : camInfo.roll
        }
    });
};



export default StoredView;
