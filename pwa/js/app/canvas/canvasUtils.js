export default {
  // TODO: detect automatically if image or canvas object.
  // For now assume first is image, second canvas
  combineVideoOverlay: function(video, overlay, callback) {
    const canvas = document.createElement("canvas");
    var scale = 2;

    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    // canvas.width = video.clientWidth * scale;
    // canvas.height = video.clientHeight * scale;
    // var ratio = video.videoWidth / video.videoHeight;
    // var overlayRatio = overlay.width / overlay.height;
    // canvas.width = overlay.width;
    // canvas.height = overlay.height;

    var ctxt = canvas.getContext("2d");
    ctxt.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctxt.drawImage(overlay, 0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.onload = function() {
      callback(this);
    };
    image.src = canvas.toDataURL("image/jpeg", 1.0);
  },

  getVideoScreenshot: function(video, callback) {
    const canvas = document.createElement("canvas");
    var scale = 1;

    // canvas.width = video.videoWidth * scale;
    // canvas.height = video.videoHeight * scale;
    canvas.width = video.clientWidth * scale;
    canvas.height = video.clientHeight * scale;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.onload = function() {
      callback(this);
    };
    image.src = canvas.toDataURL("image/jpeg", 1.0);
  }
};
