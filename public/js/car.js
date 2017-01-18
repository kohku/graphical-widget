var carz = (function(){
	var EVENTS = EVENTS || {};
	var GOOGLEMAPS = GOOGLEMAPS || {};
	var MOREOPTIONS = MOREOPTIONS || {};
	var DATEPICKER = DATEPICKER || {};
	var SENDZFORM = SENDZFORM || {};
	var DYNAMICELEMENTS = DYNAMICELEMENTS || {};
	var absolute_url;

  var getOriginInput = function($){
    return $("input#wdgt-z-car-from-input");
  };

  var getDestinationInput = function($){
    return $("input#wdgt-z-car-to-input");
  };

  var showDirectionsError = function($, msg){
    $("#wdgt-z-car-form-elements-error")
      .text(msg).show();
  };

  var hideDirectionsError = function($){
    $("#wdgt-z-car-form-elements-error").hide();
  };

	EVENTS.call = {
		checkBoxStatus : false,
		changeAddress : false,
		displayDialog : true,
		dialogDisplayed : false,
		openDrivingTime : function($){
			$(document).on("click","input#wdgt-z-car-submit-button-two",function(){
				var spinnerOverLay = $('.multi-wdgtz-loader');
				var from = getOriginInput($).val();
        var to = getDestinationInput($).val();

				spinnerOverLay.show();

        Path.find(
          from, to,
          function() {
			spinnerOverLay.hide();
            $("div#wdgt-z-car-form-elements-from, div#wdgt-z-car-form-elements-to").hide();
            $("div#wdgt-z-car-driving-time").show();
            GOOGLEMAPS.call.getTravelTime($);
          },
          function(errMsg) {
			spinnerOverLay.hide();
            showDirectionsError($, errMsg);
          }
        );
        
				return false;
			});
		},

		closeDrivingTime : function($){
			$(document).on("click","span#wdgt-z-car-driving-time-change",function(){
				$("div#wdgt-z-car-driving-time").hide();
				$("div#wdgt-z-car-form-elements-from, div#wdgt-z-car-form-elements-to").show();
				return false;
			});
		},

		openGetDirections : function($){
      var viewDirections = function(from, to) {
        var url = absolute_url + "templates/gmaps.html?from=" + from + "&to=" + to;
        window.open(url);
      };

			$(document).on("click","div#wdgt-z-car-driving-get-directions",function(){
				var from = getOriginInput($).val();
        var to = getDestinationInput($).val();
        viewDirections(from, to);
      });

			$(document).on("click","input#wdgt-z-car-submit-button",function(e){
				e.preventDefault();
				var spinnerOverLay = $('.multi-wdgtz-loader');
				var from = getOriginInput($).val();
        var to = getDestinationInput($).val();
				spinnerOverLay.show();

        Path.find(
          from, to,
          function() {
			spinnerOverLay.hide();
            viewDirections(from, to);
          },
          function(errMsg) {
			spinnerOverLay.hide();
            showDirectionsError($, errMsg);
          }
        );
			});
		},

		hideRequired : function($){
			$("#wgt-z-auto-complete-car-pick-up").on("keypress",function(){
				$("div#wdgt-z-car-more-options-pickup label.wdgt-z-val").hide();
			});
		},

		clickCheckBox : function($){
			var autoVisible='notSetted';
			$(document).on("click","label#wdgt-z-car-form-wrapper-mask-checkbox",function(){
				if(autoVisible==="notSetted"||autoVisible===false)
					autoVisible = $("#wgt-z-auto-complete-car-drop-off").is(":visible");
				if(!EVENTS.call.checkBoxStatus){
					$(this).addClass("squaredThree");
					$("#wdgt-z-car-drop-off").hide();
					$("#wgt-z-auto-complete-car-drop-off").hide();
					$("#wdgt-z-car-drop-off-lbl").hide();
					EVENTS.call.checkBoxStatus = true;
					value = true;
				}else{
					if(autoVisible)
						$("#wgt-z-auto-complete-car-drop-off").show();
					else
						$("#wdgt-z-car-drop-off").show();
					$("#wdgt-z-car-drop-off-lbl").show();
					$(this).removeClass("squaredThree");
					EVENTS.call.checkBoxStatus = false;
					value = false;
				}
				$("input#wdgt-z-car-form-checkbox").val(value);
			});
		},
    fromFieldFocus : function($){
			getOriginInput($).focus(function(){
        hideDirectionsError($);
      });
    },
		toFieldFocus : function($){
			var address, response;
			getDestinationInput($).focus(function(){
        hideDirectionsError($);
				address = $(this).val();
				$(this).val('');

				if(EVENTS.call.displayDialog&&!EVENTS.call.dialogDisplayed)						
					response = confirm("Are you sure you want to change the address for "+
										widgetZGobals['poi_name']+"?");

				if (response==true&&EVENTS.call.displayDialog==true) {
				    EVENTS.call.changeAddress = true;
				    EVENTS.call.displayDialog = false;
				} else if(response==false&&EVENTS.call.displayDialog==true){
					$(this).val(address);
				    EVENTS.call.changeAddress = false;
				    EVENTS.call.displayDialog = true;
				    EVENTS.call.dialogDisplayed = true;
				}
				
				if(!EVENTS.call.changeAddress){
					$(this).attr("readonly","readonly");
				}else{
					$(this).removeAttr("readonly");
				}

			});
			$(document).click(function(){
				EVENTS.call.dialogDisplayed = false;
			});
		},
		listener : function($){
			EVENTS.call.openDrivingTime($);
			EVENTS.call.closeDrivingTime($);
			EVENTS.call.openGetDirections($);
			EVENTS.call.clickCheckBox($);
			EVENTS.call.fromFieldFocus($);
			EVENTS.call.toFieldFocus($);
			EVENTS.call.hideRequired($);
		}
	}

	MOREOPTIONS.call = {
		status : false,
		toggle : function($){
			$(document).on("click","#wdgt-z-car-more-options-button",function(){
				MOREOPTIONS.call.status = (MOREOPTIONS.call.status == true) ? false : true;
				if(MOREOPTIONS.call.status)
					MOREOPTIONS.call.windowDown($);
				else
					MOREOPTIONS.call.windowUp($);
			});
		},
		windowUp : function($){
				$("#wdgt-z-car-more-option-section").animate();
				$("#wdgt-z-car-more-option-section").animate({
								height: 0,
								}, 500,function(){
									$('.widget-z-car-triangle-icon').css('background-position','-30px');
									$('#wdgt-z-car-more-option-section').hide();
								});
		},
		windowDown : function($){
			var newHeight = MOREOPTIONS.resize.handdler($);
			$("#wdgt-z-car-more-option-section").show().animate({
									height: newHeight,
									}, 500,function(){
										$('.widget-z-car-triangle-icon').css('background-position','-41px');
									});
		}
	}

	MOREOPTIONS.resize = {
		listener : function($){
			$(window).resize(function(){
				if(MOREOPTIONS.call.status){
					var newHeight = MOREOPTIONS.resize.handdler($);
					var element = $(document).find("#wdgt-z-car-more-option-section");
					element.css('height', newHeight);
				}
			});
		},
		handdler : function($){
			var newHeight = 0
			var width = $("#graphical-wdgtz-container").css('width');
			width = width.replace('px','');
			width = parseInt(width);
			if(width>712){
				newHeight = 400;
			}
			else if(width <= 712&&width > 708){
			    newHeight = 480;
			} else if (width <= 708 && width > 431) {
			    newHeight = 580;
			} else if (width <= 431 && width >= 428) {
		        newHeight = 720;
			} else if (width < 428) {
			    newHeight = 550;
			}

			return newHeight;
		}
	}

	GOOGLEMAPS.call = {
		getTravelTime : function($){
			var directionsService = new google.maps.DirectionsService();
			var request, origin, destination;
			origin = getOriginInput($).val();
			destination = getDestinationInput($).val();
			$("span#wdgt-z-car-driving-time-from span.thin").text(" "+origin);
			$("span#wdgt-z-car-driving-time-to span.thin").text(" "+destination);
			request = {
		              origin:origin,
		              destination:destination,
		              travelMode: google.maps.TravelMode.DRIVING
		            };
			directionsService.route(request, function(result, status) {
	              if (status == google.maps.DirectionsStatus.OK) {
	              	var drivingTime = result.routes[0].legs[0].duration.text.replace("horas","hrs")
	              						.replace("hours","hrs");
	              	$("#wdgt-z-car-driving-time-text").text(drivingTime);
	              	$("#wdgt-z-car-driving-miles-text").text(result.routes[0].legs[0].distance.text.replace("mi","miles"));
	              }
            });
		}
	}

	DATEPICKER.call = {
		minDate : 1,
		listener : function($){
			var content = $("div#wdgt-z-car-more-option-section");
			
			// creating datepicker calendars
			(function ($,elems,icons){
				elems.attr('readonly', true);
				elems.datepicker({
					numberOfMonths: 2,
					minDate: 0,
					onSelect: function () {
						var minDate = $('#wdgt-z-car-calendar-from').datepicker("getDate");
						minDate.addDays(1);
						$("#wdgt-z-car-calendar-to").datepicker("option", "minDate", minDate);
						$(document).trigger('broacast/calendars', this);
					},
					dateFormat: "ddMyy"
				});

				$(document).on("click", icons.selector, function (e) {
	                DATEPICKER.call.clickActions($,this);
	            });

   	            $(document).on('broacast/calendars', function(event, who){
	            	console.log('broacast/calendars car handler');
					var ctrl = $(who);

					if (!ctrl.hasClass('hasDatepicker'))
						return;

					var date = ctrl.datepicker('getDate');

					if (ctrl.hasClass('wdgt-z-from-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-car-calendar-from')
							$("#wdgt-z-car-calendar-from").datepicker('setDate', date);
						$("#wdgt-z-car-calendar-to").datepicker('setDate', date.addDays(1));
					} else if (ctrl.hasClass('wdgt-z-to-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-car-calendar-to')
							$("#wdgt-z-car-calendar-to").datepicker('setDate', date);
					}
				});
	        })($,content.find("input[id^='wdgt-z-car-calendar-']"),content.find("span[id^='wdgt-z-car-calendar-icon-']"));

	        // setting initial dates
			var checkin = travelingDates.from ? travelingDates.from : new Date().addDays(DYNAMICELEMENTS.call.pickUpOffset);
			$("#wdgt-z-car-calendar-from").datepicker("setDate", checkin);
				
			var checkout = travelingDates.to ? travelingDates.to : new Date().addDays(DYNAMICELEMENTS.call.dropOffOffset);
			$("#wdgt-z-car-calendar-to").datepicker("setDate", checkout);
		},
		clickActions : function($,elem){
			if(elem.id != "wdgt-z-car-calendar-icon-from" && elem.id != "wdgt-z-car-calendar-icon-to")
				return;

			elem = elem.id.replace("wdgt-z-car-calendar-icon", "#wdgt-z-car-calendar");
			$(elem).datepicker("show");
		}
	}

	DYNAMICELEMENTS.call = {
		cname : 'http://booking.tripplanz.com',
		url : '/car_rentals/results/?',
		checkRangeTime : false,
		pickUpOffset : 3,
		dropOffOffset : 4,
		numOfGuessts : 2,
		refid : '',
		refclickid : '', 
		varid : '',
		queion : '',
		address : '',
		handdler : function($){
			var flagTextHeader = false;
			var guest = false;
			var formContent = $("form#wdgt-z-car-form");
			widgetZVars[widgetZVars.length] = {"key":"queion","value":"084e7964af2b458a641aa3b3bbea1516"};
			widgetZVars[widgetZVars.length] = {"key":"varid","value":"1b2a3b4a5a6a7a8b9a10a"};

			$.each(widgetZVars,function(index,element){
				switch(element.key){
					case "refid":
						DYNAMICELEMENTS.call.refid = element.value;
						break;
					case "refclickid":
						DYNAMICELEMENTS.call.refclickid = element.value;
						break;
					case "queion":
						DYNAMICELEMENTS.call.queion = element.value;
						break;
					case "varid":
						DYNAMICELEMENTS.call.varid = element.value;
						break;
					case "pick_up":
						if(element.value!=""){
						    DYNAMICELEMENTS.call.pickUpOffset = element.value;
						}
						break;
					case "drop_off":
						if(element.value!=""){
						    DYNAMICELEMENTS.call.dropOffOffset = element.value;
						}
						break;
					case 'cname':
						if(element.value!=""&&element.value!=" ")
							DYNAMICELEMENTS.call.cname = element.value;
					break;
					case 'address':
						DYNAMICELEMENTS.call.address = element.value;
				}

			});
			DYNAMICELEMENTS.call.url = DYNAMICELEMENTS.call.cname+DYNAMICELEMENTS.call.url
			DYNAMICELEMENTS.call.url += "refid="+DYNAMICELEMENTS.call.refid+"&"+
											"refclickid="+DYNAMICELEMENTS.call.refclickid+"&"+
											"queion="+DYNAMICELEMENTS.call.queion+"&"+
											"varid="+DYNAMICELEMENTS.call.varid;
			getDestinationInput($).on("change",function(){
				DYNAMICELEMENTS.call.address = this.value;
			});
		}
	}

	SENDZFORM.call = {
		url : DYNAMICELEMENTS.call.cname+'/car_rentals/results/?',
		flag :false,
		listener : function($){
			SENDZFORM.call.getData($);
		},
		getData : function($){
			var form;
			(function(){
				var refid = "";
				var refclickid = "";
				var urlString = "";
				var puString = "";
				var doString= "";
				var dateString = "";
				var send = true;
				var doSamePlace;
				if(SENDZFORM.call.flag==false){
					$(document).on("click","input#wdgt-z-car-form-search",function(){
						form = $(document).find("form[id='wdgt-z-car-form']");
						$.each(form[0].elements,function(index,element){
							if(element.name==="rs_pu_date"||element.name==="rs_do_date"){
								var ctrl = $(element);
								if (ctrl.hasClass('hasDatepicker')){
									var date = ctrl.datepicker('getDate');
									dateString += element.name+"="+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"&";
								}
							}else if(element.name==="rs_pu_airport"){
							    //Validate not empty
							    if (element.value === "" || element.value===" " || 
							    	element.value === "undefined") {
							        $("div#wdgt-z-car-more-options-pickup label.wdgt-z-val").show();
							        $("#wgt-z-auto-complete-car-pick-up").focus();
							        send = false;
							        return send;
							    }else{
							    	type = $(element).data("type");
									code = $(element).data("code");
									switch(type){
										case 'AIR':
											puString += "rs_pu_airport="+code+
														"&rs_pu_city="+element.value+"+("+code+")"+"&";
										break;
										case 'CITY':
											puString += "rs_pu_cityid="+code+
														"&rs_pu_city="+element.value+"&";
										break;
									}
									send = true;
							    }
							}else if(element.name==="rs_do_airport"){
								type = $(element).data("type");
								code = $(element).data("code");
								switch(type){
									case 'AIR':
										doString += "rs_do_airport="+code+
													"&rs_do_city="+element.value+"+("+code+")"+"&";
									break;
									case 'CITY':
										doString += "rs_do_cityid="+code+
													"&rs_do_city="+element.value+"&";
									break;
								}
							}else if(element.name==="rs_pu_time"||element.name==="rs_do_time"
								||element.name==="rs_company"){
								urlString += element.name+"="+element.value+"&";
							}else if(element.name==="dropoff"){
								doSamePlace = element.value;
							}
						});

						$.each(widgetZVars,function(index,element){
							if(element.key==="poi_name"){
								urlString += element.key+"="+encodeURIComponent(element.value)+"&";
							}else if(element.key==="refid"){
								refid = "refid="+element.value;
							}else if(element.key==="refclickid"){
								refclickid = "refclickid="+element.value;
							}
						});
						if(doSamePlace=="true"){
							doString=puString.split('_pu_').join('_do_');
						}
							
						SENDZFORM.call.url += dateString+refid+"&"+refclickid+"&"
												+puString+doString+urlString;

						if(send)
							SENDZFORM.call.sendData($);
						dateString = '';
						refid = '';
						refclickid = '';
						urlString = '';
						doString = '';
						puString = '';
						SENDZFORM.call.url = DYNAMICELEMENTS.call.cname+'/car_rentals/results/?';
					});
					SENDZFORM.call.flag = true;
				}

			})();
		},
		sendData : function(){
			window.open(SENDZFORM.call.url,"_blank");
		}
	}

	return{call : function(jQuery,$,JQUERYUI,url){
					absolute_url = url;
					jQuery(document).ready(function(){
						DYNAMICELEMENTS.call.handdler($);
						EVENTS.call.listener($);
						MOREOPTIONS.call.toggle($);
						MOREOPTIONS.resize.listener($);
						DATEPICKER.call.listener($);
						SENDZFORM.call.listener($);
					});
				}
		}
})();
