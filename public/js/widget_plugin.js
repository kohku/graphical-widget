jQuery(document).ready(function(){
  jQuery(function() {
    checkPlaceholderImage();
    loadImageAndContents();
    initContainerSize();
    setAddThisOptions();
  }); // End Ready Function

  // Other Functions
  function loadImageAndContents() {
    var checkExist = setInterval(function() {
      if (jQuery('#multi-wdgtz-1').length) {
        var fullAddress = getAddress();
        var imagePreviewHtml = '' +
          '<div id="image-map-content">' +
          '<img class="mapz-icon" src="http://getmywidget.com/graphicalwidget/images/mapz-icon.png" />' +
          '<div class="wdgt_image-map-wrapper">' +
          '<div class="wdgt_image-map-container">' +
          '<div class="wdgt_image-map-holder">' +
          '<div class="image-preview">' +
          '<a class="image-link" href="' + wdgt_link_URL + '"><img class="wdgt_image" src="' + wdgt_image_URL + '" /></a>' +
          '</div>' +
          '<div id="wdgt_map"></div>' +
          '</div>' +
          '<div class="wdgt_link-holder">' +
          '<a class="wdgt_change_address_click" href="javascript:void(0)">Click to view map/change address</a><a class="wdgt_save_changes" href="javascript:void(0)">Click to accept changes</a><div class="wdgt-triangle"></div>' +
          '</div>' +
          '</div>' +
          '<input type="text" value="' + fullAddress + '" placeholder="Change Address" id="change_address_input" name="to_place" />' +
          '<div class="clear"></div>' +
          '</div>' +
          '</div>' +
          '</div>';

        jQuery('#wdgt-z-htl-header').after(imagePreviewHtml);

        setNewListeners();

        var container = jQuery('#container').width();
        if (container < 1000) {
          jQuery('#wdgt-z-htl-form-first-colum').css('display', 'block');
          jQuery('#wdgt-z-htl-form-sekond-colum').css('display', 'block');
        }
        if (container < 780) {
          jQuery('#wdgt-z-htl-form-first-colum').css('display', 'block');
          jQuery('#wdgt-z-htl-form-sekond-colum').css('display', 'block');
        }

        clearInterval(checkExist);
      }

    }, 200);
    setTimeout(function() {
      clearInterval(checkExist);
    }, 2000);

  }

  function setNewListeners() {
    // Variables
    var wdgtChangeAddressClick = jQuery('.wdgt_change_address_click');
    var changeAddressInput = jQuery('#change_address_input');
    var wdgtSaveChanges = jQuery('.wdgt_save_changes');
    var wdgtTriangle = jQuery('.wdgt-triangle');
    var mapsDiv = jQuery('#wdgt_map');
    var wdgtHotelHref = jQuery('#multi-wdgtz-a-hotel');
    var wdgtCarHref = jQuery('.multi-wdgtz-background-img-car');
    var wdgtFlightHref = jQuery('#multi-wdgtz-a-flight');
    var mapzIcon = jQuery('.mapz-icon');
    var imageMapContent = jQuery('#image-map-content');
    var widgetContainer = jQuery('#graphical-wdgtz-container');

    jQuery(window).resize(function() {
      if (widgetContainer.width() < 1000) {
        imageMapContent.addClass('add_white_bg');
        mapzIcon.show();
      }
      else {
        if(mapzIcon.is(':hidden')){
          imageMapContent.removeClass('add_white_bg')
        }
      }

    });
    if (widgetContainer.width() < 1000) {
      imageMapContent.addClass('add_white_bg');
    }
    wdgtChangeAddressClick.click(function() {

      jQuery(this).hide();
      console.log(wdgt_image_URL);
      if (wdgt_image_URL == ''){
        jQuery('.wdgt_image-map-container').addClass('clear-margin');
        if(widgetContainer.width() < 1000) {
          jQuery('#change_address_input').addClass('clear-margin');
        }
      }
      wdgtSaveChanges.show();
      changeAddressInput.slideDown("slow");
      wdgtTriangle.css({
        backgroundPosition: '-41px 50%'
      });
      imageMapContent.addClass('add_white_bg');

      mapsDiv.slideDown(function() {
        if(changeAddressInput.val() != ''){
          initMap('wdgt_map');
        }else {
          mapsDiv.hide();
        }
      });
      mapzIcon.slideDown("slow");
      // --- end ->>
    });


    wdgtSaveChanges.click(function() {
      if (wdgt_image_URL == ''){
        jQuery('.image-preview').removeClass('clear-margin');
        if(widgetContainer.width() < 1000) {
          jQuery('#change_address_input').removeClass('clear-margin');
        }
      }
      jQuery(this).hide();
      wdgtChangeAddressClick.show();
      changeAddressInput.slideUp();


      wdgtTriangle.css({
        backgroundPosition: '-30px -1px'
      });
      if (widgetContainer.width() > 1000) {
        imageMapContent.removeClass('add_white_bg');
        mapzIcon.slideUp("slow");
      }

      mapsDiv.slideUp();
      // --- end ->>
      var new_input = jQuery('#change_address_input').val();
      var target = jQuery('#wdgt-z-car-to-input');
      target.val(new_input);
      initMap('wdgt_map');

      // jQuery.each(widgetZVars,function(index,element){
      //   if(element.key=="address"||element.key=="city"||
      //     element.key=="stateprovince"||element.key=="postalcode"){
      //       element.value = new_input;
      //   }
      // });
    });

    //Im Driving Tab Click
    wdgtCarHref.click(function() {
      jQuery('#image-map-content').hide();
      jQuery('#car-map-content').show();
      var checkNewExist = setInterval(function() {

        if (jQuery('#wdgt-z-car-container').length) {
          if (jQuery('#wdgt_car_map').length == 0) {
            jQuery('#wdgt-z-htl-header').after('<div id="car-map-content"><img class="car-mapz-icon" src="http://getmywidget.com/graphicalwidget/images/mapz-icon.png" /><div id="wdgt_car_map_wrapper"><div id="wdgt_car_map"></div></div></div><div class="clear"></div>');
            // jQuery('#wdgt-z-car-form-third-colum').prepend('<div class="clear"></div>');
          }
          if(changeAddressInput.val() != ''){
            initMap('wdgt_car_map');
          }
          clearInterval(checkNewExist);

          var new_input = jQuery('#change_address_input').val();
          var target = jQuery('#wdgt-z-car-to-input');
          target.val(new_input);

          target.change (function() {
            jQuery('#change_address_input').val(target.val());
          });
          var container = jQuery('#container').width();
          if (container < 1000) {
            jQuery('#wdgt-z-car-form-elements-to').css('display', 'block');
            jQuery('#wdgt-z-car-form-elements-from').css('display', 'block');
          }
        }
      }, 200);
      setTimeout(function() {
        clearInterval(checkNewExist);
      }, 20000);


    });

    //Im Staying Tab Click
    wdgtHotelHref.click(function() {
      jQuery('#image-map-content').show();
      jQuery('#car-map-content').hide();
      initMap('wdgt_map');
    });
    //Im Staying Tab Click
    // TODO: Why is full address inserted in Flight "TO" field?
    /*wdgtFlightHref.click(function() {
      jQuery('#image-map-content').hide();
      jQuery('#car-map-content').hide();
      var new_input = jQuery('#change_address_input').val();
      var target = jQuery('#wgt-z-auto-complete-flight-to-input');
      target.val(new_input);
    });*/


  }

  function getAddress() {
    var fullAddress = '';
    widgetZVars.forEach(function(object) {

      switch (object.key) {
        case 'address':
          if (object.value){
            fullAddress += (object.value + ', ')
          }
          break;
        case 'city':
          if (object.value){
            fullAddress += (object.value + ', ')
          }
          break;
        case 'stateprovince':
          fullAddress += (object.value + ' ')
          break;
        case 'postalcode':
          fullAddress += (object.value)
          break;
      }
    });
    return fullAddress;
  }


  // See https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
  function initMap(div) {
    var map = new google.maps.Map(document.getElementById(div), {
      zoom: 8,
    });
    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);
  }

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('change_address_input').value;
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
        });
        marker.setMap(resultsMap);
        resultsMap.setCenter(results[0].geometry.location);
        var newlatLng = results[0].geometry.location.toString();
        newlatLng = newlatLng.replace("(","");
        newlatLng = newlatLng.replace(")","");
        newlatLng = newlatLng.replace(" ","");
        newlatLng = newlatLng.split(',');
        jQuery.each(widgetZVars, function(index, element) {
            if (element.key=="latitude") {
              element.value = newlatLng[0];
              console.log(element.value);
            } else if (element.key=="longitude") {
              element.value = newlatLng[1];
              console.log(element.value);
            }
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  function initContainerSize() {
    var widgetContainer = jQuery('#graphical-wdgtz-container'),
        sizeClassesMin = [
          {className: 'wdgtz-size-xs', size: 320},
          {className: 'wdgtz-size-sm', size : 375},
          {className: 'wdgtz-size-smmd', size : 480},
          {className: 'wdgtz-size-md', size : 768},
          {className: 'wdgtz-size-lg', size : 1001}
        ],
        sizeClassesMax = [
          {className: 'wdgtz-size-mxlg', size : 1000},
          {className: 'wdgtz-size-mxmd', size : 768}
        ];

    if (widgetContainer.length === 0) {
      return;
    }

    jQuery(window).resize(onContainerResize);

    onContainerResize();

    function onContainerResize() {
      var widgetContainerWidth = widgetContainer.outerWidth(true);

      // Loop by min-widht breakpoints
      jQuery.each(sizeClassesMin, function(index, value) {
        if (widgetContainerWidth >= value.size) {
          !widgetContainer.hasClass(value.className) && widgetContainer.addClass(value.className);
        }else {
          widgetContainer.removeClass(value.className);
        }
      });

      // Loop by max-widht breakpoints
      jQuery.each(sizeClassesMax, function(index, value) {
        if (widgetContainerWidth <= value.size) {
          !widgetContainer.hasClass(value.className) && widgetContainer.addClass(value.className);
        }else {
          widgetContainer.removeClass(value.className);
        }
      });
    }
  }

  function setAddThisOptions() {
    var title = 'Tripplanz Widget';
    var poi_name = '';

    $.each(widgetZVars, function(index, object) {
      switch (object.key) {
        case 'header_text':
          if (object.value.length !== 0) {
            title = object.value;
          }
          break;
        case 'poi_name':
          if (object.value.length !== 0) {
            poi_name = object.value;
          }
          break;
        case 'append_poi':
          if (object.value !== 'N' && poi_name.length !== 0){
            title += ' ' + poi_name;
          }
          break;
      }
    });

    window.addthis_share = {
      title: title,
      media: wdgt_image_URL
    }
  }

  // check image src
  function checkPlaceholderImage() {
    var placeholderImage = 'http://getmywidget.com/graphicalwidget/images/tripplanz_icon.png';

    if (!wdgt_image_URL && wdgt_image_URL.trim() === '') {
      window.wdgt_image_URL = placeholderImage;
    }
  }
})