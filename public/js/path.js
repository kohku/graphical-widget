var Path = (function() {
  var noop = function() {};

  var messages = {
    NOT_FOUND: "We cannot calculate driving directions for these two points, as they span water and/or continents. It may be that flying is your only logical option for this trip.",
    EMPTY_ATTRIBUTES: "Enter from and to fields"
  };

  var appendScript = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=Path.__gMapReadyCallback';
    document.body.appendChild(script);
  };

  var activateGMap = [];
  var gMap = function gMap(loaded) {
    if (google.maps) return loaded(google.maps);
    if (!gMap.appended) {
      gMap.appended = true;
      appendScript();
    }
    activateGMap.push(loaded);
  };

  var find = function(from, to, matched, failed) {
    matched = matched || noop;
    failed = failed || noop;

    if (!from || !to) return failed(messages.EMPTY_ATTRIBUTES);

    gMap(function(maps) {
      var directionsService = new maps.DirectionsService();
      var request = {
        origin: decodeURIComponent(from),
        destination: decodeURIComponent(to),
        travelMode: maps.TravelMode.DRIVING
      };
      directionsService.route(request, function(result, status) {
        if (status == maps.DirectionsStatus.OK) matched(result);
        else failed(messages.NOT_FOUND);
      });
    });
  };

  var gMapReadyCallback = function() {
    var cb;
    while (cb = activateGMap.pop()) {
      cb(google.maps);
    }
  };

  return {
    find: find,
    __gMapReadyCallback: gMapReadyCallback
  };
})();
