var GMAPS = GMAPS || {};

GMAPS.call = {
	geocoder : '',
	appendMaps : function loadGmaps(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=GMAPS.call.callbackResponse&key=AIzaSyDOXBsxcH9pqCRm0NES6EU4wQvBDgql0ZI';
		document.body.appendChild(script);
	},
	callbackResponse : function initialize(){
		try{
			GMAPS.call.geocoder = new google.maps.Geocoder();
		}catch(err){
			console.log(erro);
		}
	}
}

window.onload = GMAPS.call.appendMaps();

var hotelz = (function(GMAPS){

	/*Objetos para el manejo de resize, tooltip y calendario*/
	var SENDZFORM = SENDZFORM || {};
	var DATEPICKER  = DATEPICKER || {};
	var TOOLTIPUI =  TOOLTIPUI || {};
	var MOREOPTIONS = MOREOPTIONS || {};
	var GEOPOINTADDRESS = GEOPOINTADDRESS || {};
	var DYNAMICELEMENTS = DYNAMICELEMENTS || {};

	DYNAMICELEMENTS.call = {
		url : "https://secure.rezserver.com/hotels/help/review/?",
		checkRangeTime : false,
		checkinOffset : 3,
		checkoutOffset : 4,
		title : '',
		numOfGuests : 2,
		numOfRooms : 1,
		refid : '',
		refclickid : '', 
		varid : '',
		queion : '',
		cname : 'http://booking.tripplanz.com',
		handler : function($){
			var flagTextHeader = false;
			var radius = false;
			var guest = false;
			var rooms = false;
			var textHeader = "BOOK HOTEL NEAR";
			var formContent = $("form#wdgt-z-htl-form");
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
					case "radius":
						if(element.value!="")
							radius = true;
						break;
					case "guests":
						if(element.value!=""){
							guest = true;
							DYNAMICELEMENTS.call.numOfGuests = element.value;
						}
						break;
				    case "rooms":
						if(element.value!=""){
							rooms = true;
							DYNAMICELEMENTS.call.numOfRooms = element.value;
						}
						break;
					case "poi_name":
						DYNAMICELEMENTS.call.title = element.value;
						break;
					case "check_in":
						if(element.value!==""){
						    DYNAMICELEMENTS.call.checkinOffset = element.value;
						}
						break;
					case "check_out":
						if(element.value!==""){
						    DYNAMICELEMENTS.call.checkoutOffset = element.value;
						}
						break;
					case 'cname':
						if(element.value!=""&&element.value!=" ")
							DYNAMICELEMENTS.call.cname = element.value;
						break;
				}

				if(element.key==="header_text"){
					flagTextHeader = true;
					textHeader = (element.value!="") ? element.value : textHeader;
					$("span#wdgt-z-htl-dynamic-header").append(textHeader);
				}
			});
			if(flagTextHeader==false)$("span#wdgt-z-htl-dynamic-header").append(textHeader);
			DYNAMICELEMENTS.call.url += "refid="+DYNAMICELEMENTS.call.refid+"&"+
											"refclickid="+DYNAMICELEMENTS.call.refclickid+"&"+
											"queion="+DYNAMICELEMENTS.call.queion+"&"+
											"varid="+DYNAMICELEMENTS.call.varid;
			if(!radius)
				widgetZVars[widgetZVars.length] = {"key":"radius","value":"5"};
			if(!guest)
				widgetZVars[widgetZVars.length] = {"key":"guests","value":"2"};
			if(!rooms)
				widgetZVars[widgetZVars.length] = {"key":"rooms","value":"1"};

			DYNAMICELEMENTS.call.appends($);
			(function(elements){
				var oldValue;
				$(elements).on("change",function(){
					selectOnVal = $(this).val();
					element = this.id.toString();
					selectOn = element.replace("wdgt-z-htl-for-select-","");
					if(selectOn=="adult"){
						oldValue = $("select#wdgt-z-htl-for-select-person").val();
						$('select#wdgt-z-htl-for-select-person [value="'+oldValue+'"]').attr('selected',false);
						$('select#wdgt-z-htl-for-select-person [value="'+selectOnVal+'"]').attr('selected',true);
					}else{
						oldValue = $("select#wdgt-z-htl-for-select-adult").val();
						$('select#wdgt-z-htl-for-select-adult [value="'+oldValue+'"]').attr('selected',false);
						$('select#wdgt-z-htl-for-select-adult [value="'+selectOnVal+'"]').attr('selected',true);
					}
				});
			})(formContent.find("select[id^='wdgt-z-htl-for-select-']"));
		},
		appends : function($){

			$("#wdgt-z-htl-container").addClass("line-gray");
			$("span#wdgt-z-link-trips a:first-child").attr("href",DYNAMICELEMENTS.call.url);
			$("span#wdgt-z-htl-title-header-right a:first-child").attr("href",DYNAMICELEMENTS.call.url);
			
			$('select#wdgt-z-htl-ineed-select').val(DYNAMICELEMENTS.call.numOfRooms).change();
			$('select#wdgt-z-htl-for-select-person').val(DYNAMICELEMENTS.call.numOfGuests).change();
		}
	}

	SENDZFORM.call = {
		url : DYNAMICELEMENTS.call.cname+'/hotels/results/?',
		flag :false,
		listener : function($){
			SENDZFORM.call.getData($);
		},
		getData : function($){
			var form;
			var elems;
			var guest = false;
			GEOPOINTADDRESS.call.handler($);
			$(document).on("mouseover","div#wdgt-z-htl-container",function(){
				var refid = "";
				var refclickid = "";
				var urlString = "";
				var dateString = "";

				if(SENDZFORM.call.flag==false){
					elems = $(this).find("input[id^='wdgt-z-htl-submit-button']");
					form = $(this).find("form#wdgt-z-htl-form");
					$(elems).click(function(){
						$.each(form[0].elements, function(key,element){
							if(element!=""&&element.type!="reset"&&element.name!=""){
								if(element.name==="guests"){
									guest = element.name+"="+element.value;
								}else if(element.name==="check_in"||element.name==="check_out"){
									var ctrl = $(element);
									if (ctrl.hasClass('hasDatepicker')){
										var date = ctrl.datepicker('getDate');
										dateString += element.name+"="+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"&";
									}
								 }else if(element.name==="chain_id"){
									if(element.value==="0"||element.value===0)
									urlString += element.name+"=&";
									else
									urlString += element.name+"="+element.value+"&";
								 }else if (element.name == "star_rating") {
								     if (element.value)
								         urlString += element.name + "=" + element.value + "&";
								     else
								         urlString += element.name + "="+widgetZGobals["hotel_stars"]+"&";
								 }else {
									urlString += element.name+"="+element.value+"&";
								}	
							}
						});

						refclickid = "refclickid="+encodeURIComponent(DYNAMICELEMENTS.call.refclickid);
						refid = "refid="+DYNAMICELEMENTS.call.refid;
						urlString += guest;
						$.each(widgetZVars,function(index,element){
							if(element.key==="latitude"
								||element.key==="longitude"||element.key==="currency"){
								//||element.key==="radius"){
								urlString += "&"+widgetZVars[index].key+"="+widgetZVars[index].value;
							}else if(element.key==="poi_name"){
								urlString += "&"+widgetZVars[index].key+"="+encodeURIComponent(widgetZVars[index].value);
							}
						});

						SENDZFORM.call.url += dateString+refid+"&"+refclickid+"&"+urlString;
						SENDZFORM.call.sendData($);
						dateString = '';
						refid = '';
						refclickid = '';
						urlString = '';
						SENDZFORM.call.url = DYNAMICELEMENTS.call.cname+'/hotels/results/?';
					});
					SENDZFORM.call.flag = true;
				}
			});
		},
		sendData : function($){
			var selectPlus = $("#wdgt-z-htl-ineed-select").val();
			if(selectPlus==5){
					window.open("https://tripplanz.groupize.com/","_blank");
					return false;
				}else{
					window.open(SENDZFORM.call.url,"_blank");
				}
		}
	}

	GEOPOINTADDRESS.call = {
		latIndex : 0,
		lngIndex : 0,
		address : '',
		flag : false,
		handler : function($){
					var cont = 0;
					$.each(widgetZVars,function(index,element){
						if(element.key=="address"||element.key=="city"||
							element.key=="stateprovince"||element.key=="postalcode"){
							GEOPOINTADDRESS.call.flag = true;
							GEOPOINTADDRESS.call.address += element.value+" ";
						}
						if(element.key==="latitude")
							GEOPOINTADDRESS.call.latIndex = cont;
						if(element.key==="longitude")
							GEOPOINTADDRESS.call.lngIndex = cont;
						cont ++;
					});
	                if(GEOPOINTADDRESS.call.flag)
	                	GEOPOINTADDRESS.call.getGeoPoint();
	        },
	    getGeoPoint : function(){
	    	try{
	    			GMAPS.call.geocoder.geocode({'address':GEOPOINTADDRESS.call.address},
	    								function(results,status){
	    									if(status == google.maps.GeocoderStatus.OK){
										       var latLng = results[0].geometry.location.toString();
										       console.log(latLng,status)
										       latLng = latLng.replace("(","");
										       latLng = latLng.replace(")","");
										       latLng = latLng.replace(" ","");
										       latLng = latLng.split(',')
										       if(GEOPOINTADDRESS.call.latIndex!=
										       	GEOPOINTADDRESS.call.lngIndex){
										       	widgetZVars[GEOPOINTADDRESS.call.latIndex].value = latLng[0];
										       	widgetZVars[GEOPOINTADDRESS.call.lngIndex].value = latLng[1];
										       }else{
													widgetZVars.push({"key":"latitude",
																	"value":latLng[0]});
													widgetZVars.push({"key":"longitude",
																	"value":latLng[1]})
										       }
										    }else{
										        console.log(status);
										    }
	    								});
	    		}catch(err){
	    			console.log("Gmaps not loaded: ",err)
	    		}
	    	}
	}

	DATEPICKER.call = {
		status : false,
		lastFocus : '',
		dateError : false,
		listener : function($){
			var content = $("div#wdgt-z-htl-form-second-colum");
			
			// creating datepicker calendars
			(function ($,elems,icons){
				elems.attr('readonly', true);
				elems.datepicker({
					numberOfMonths: 2,
					minDate: 0,
					onSelect: function () {
						var minDate = $('#wdgt-z-htl-calendar-from').datepicker("getDate");
						minDate.addDays(1);
						$("#wdgt-z-htl-calendar-to").datepicker("option", "minDate", minDate);
						$(document).trigger('broacast/calendars', this);
					},
					dateFormat: "ddMyy"
				});

				$(document).on("click", icons.selector, function (e) {
	                DATEPICKER.call.clickActions($,this);
	            });

	            $(document).on('broacast/calendars', function(event, who){
	            	console.log('broacast/calendars hotel handler');
					var ctrl = $(who);

					if (!ctrl.hasClass('hasDatepicker'))
						return;

					var date = ctrl.datepicker('getDate');

					if (ctrl.hasClass('wdgt-z-from-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-htl-calendar-from')
							$("#wdgt-z-htl-calendar-from").datepicker('setDate', date);
						$("#wdgt-z-htl-calendar-to").datepicker('setDate', date.addDays(1));
					} else if (ctrl.hasClass('wdgt-z-to-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-htl-calendar-to')
							$("#wdgt-z-htl-calendar-to").datepicker('setDate', date);
					}
				});
	        })($,content.find("input[id^='wdgt-z-htl-calendar-']"),content.find("span[id^='wdgt-z-htl-calendar-icon-']"));

	        // setting initial dates
			var checkin = travelingDates.from ? travelingDates.from : new Date().addDays(DYNAMICELEMENTS.call.checkinOffset);
			$("#wdgt-z-htl-calendar-from").datepicker("setDate", checkin);
				
			var checkout = travelingDates.to ? travelingDates.to : new Date().addDays(DYNAMICELEMENTS.call.checkoutOffset);
			$("#wdgt-z-htl-calendar-to").datepicker("setDate", checkout);
		},
		clickActions : function($,elem){
			if(elem.id != "wdgt-z-htl-calendar-icon-from" && elem.id != "wdgt-z-htl-calendar-icon-to")
				return;

			elem = elem.id.replace("wdgt-z-htl-calendar-icon", "#wdgt-z-htl-calendar");
			$(elem).datepicker("show");
		}
	}

	TOOLTIPUI.call = {
		listener: function ($) {
			
			var content = $(document).find("div#wdgt-z-htl-form-body");
			(function($,elems){
					var tooltipId, myPosition;
					var url = "http://booking.travelingtogive.com/hotels/help/terms/?refid="
								+DYNAMICELEMENTS.call.refid;
					$(elems).click(function () {
							tooltipId = this.id
							myPosition = "right+210 top+5";
							$("div.ui-inside-link a").attr("href",url);
							$('#hidden-tooltip').tooltip({
								content: $('#wdgt-z-htl-title-best-rate-tooltip').html(),
								position: { my: myPosition },
								tooltipClass: 'multi-wdgtz-popup'
							});
							if (!$(this).hasClass('open')){
								$('#hidden-tooltip').trigger('mouseover');
								$(this).addClass('open');
							}
							else {
								$('#hidden-tooltip').trigger('mouseout');
								$(this).removeClass('open');
							}
					});
					$(document).on("click", "span.tooltipClose", function () {
						$('#hidden-tooltip').tooltip('close');
						$('#tooltip').removeClass('open');
					});
			})($, content.find("a[id='tooltip']"));
		}
	}

	MOREOPTIONS.call = {
		status : false,
		toggle : function($){
			$(document).on("click","#wdgt-z-htl-more-option-button",function(){
				MOREOPTIONS.call.status = (MOREOPTIONS.call.status == true) ? false : true;
				if(MOREOPTIONS.call.status)
					MOREOPTIONS.call.windowDown($);
				else
					MOREOPTIONS.call.windowUp($);
			});
		},
		windowUp : function($){
				var element = $(document).find("#wdgt-z-htl-more-option-section");
				element.animate();
				element.animate({
								height: 0,
								}, 500,function(){
									$('.widget-z-htl-triangle-icon').css('background-position','-30px');
									$('#wdgt-z-htl-more-option-section').hide();
								});
		},
		windowDown : function($){
			var newHeight = MOREOPTIONS.resize.handler($);
			var element = $(document).find("#wdgt-z-htl-more-option-section");
			element.show().animate({
									height: newHeight,
									}, 500,function(){
										$('.widget-z-htl-triangle-icon').css('background-position','-41px');
									});
		}
	}

	MOREOPTIONS.resize = {
		listener : function($){
			$(window).resize(function(){
				if(MOREOPTIONS.call.status){
					var newHeight = MOREOPTIONS.resize.handler($);
					var element = $(document).find("#wdgt-z-htl-more-option-section");
					element.css('height',newHeight);
				}
			});
		},
		handler : function($){
			var newHeight = 0
			var element = $(document).find("#wdgt-z-htl-container");
			var width = element.css('width');
			width = width.replace('px','');
			width = parseInt(width);
			if(width>656){
				newHeight = 58;
			}else if(width <= 656&& width > 416){
			    newHeight = 105;
			} else if (width <= 416 && width > 345) {
			    newHeight = 145;
			}else if(width <= 345){
				newHeight = 145;
			}
			console.log(width + '>' + newHeight);
			return newHeight;
		}
	}

	return { call : function (jQuery,$,JQUERYUI,AUTOCOMPLETEZ) {
	    jQuery(document).ready(function($) {
		    	DYNAMICELEMENTS.call.handler($);
				JQUERYUI.call.listener($);
				TOOLTIPUI.call.listener($);
				MOREOPTIONS.call.toggle($);
				MOREOPTIONS.resize.listener($);
				DATEPICKER.call.listener($);
				SENDZFORM.call.listener($);
	    	});
		}
	}
})(GMAPS);