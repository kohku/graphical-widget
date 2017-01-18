var flightz = (function(){

	var MOREOPTIONS = MOREOPTIONS || {};
	var EVENTS = EVENTS || {};
	var DATEPICKER = DATEPICKER || {};
	var DYNAMICELEMENTS = DYNAMICELEMENTS || {};
	var SENDZFORM = SENDZFORM || {};

	MOREOPTIONS.call = {
		status : false,
		toggle : function($){
			$(document).on("click","#wdgt-z-flight-more-option-button",function(){
			    MOREOPTIONS.call.status = !MOREOPTIONS.call.status;
				if(MOREOPTIONS.call.status)
					MOREOPTIONS.call.windowDown($);
				else
					MOREOPTIONS.call.windowUp($);
			});
		},
		windowUp : function($){
				$("#wdgt-z-flight-more-option-section").animate();
				$("#wdgt-z-flight-more-option-section").animate({
								height: 0,
								}, 500,function(){
									$('.widget-z-flight-triangle-icon').css('background-position','-30px');
									$('#wdgt-z-flight-more-option-section').hide();
								});
		},
		windowDown : function($){
			var newHeight = MOREOPTIONS.resize.handdler($);
			$("#wdgt-z-flight-more-option-section").show().animate({
									height: newHeight,
									}, 500,function(){
										$('.widget-z-flight-triangle-icon').css('background-position','-41px');
									});
		}
	}

	MOREOPTIONS.resize = {
		listener : function($){
			$(window).resize(function(){
				if(MOREOPTIONS.call.status){
				    var newHeight = MOREOPTIONS.resize.handdler($);
				    var element = $(document).find("#wdgt-z-flight-more-option-section");
				    element.css('height', newHeight);
				}
			});
		},
		handdler : function($){
			var newHeight = 0
			var element = $(document).find("#wdgt-z-flight-container");
			var width = element.css('width');
			width = width.replace('px','');
			width = parseInt(width);
			if(width>731){
				newHeight = 150;
			}
			else if(width<=731&&width>719){
				newHeight = 270;
			}
			else if(width<=719&&width>345){
				newHeight = 230;
			}else if(width<=345){
				newHeight = 230;
			}

			return newHeight;
		}
	}

	EVENTS.call = {
		checkBoxStatus : false,
		clickCheckBox : function($){
			$(document).on("click","label#wdgt-z-flight-form-wrapper-mask-checkbox",function(){
				var value;
				if(!EVENTS.call.checkBoxStatus){
					$(this).addClass("squaredThree");
					EVENTS.call.checkBoxStatus = true;
					value = 0;
				}else{
					$(this).removeClass("squaredThree");
					EVENTS.call.checkBoxStatus = false;
					value = '';
				}
				$("input#wdgt-z-flight-form-checkbox").val(value);
			});
		},
		hideRequired : function($){
			$("#wgt-z-auto-complete-flight-from-input").on("keypress",function(){
				$("div#wdgt-z-flight-form-from label.wdgt-z-val").hide();
			});
		},
		listener : function($){
			EVENTS.call.clickCheckBox($);
			EVENTS.call.hideRequired($);
		}
	}

	DATEPICKER.call = {
		minDate : 1,
		listener : function($){
			var content = $("form#wdgt-z-flight-form");

			// creating datepicker calendars
			(function ($,elems,icons){
				elems.attr('readonly', true);
				elems.datepicker({
					numberOfMonths: 2,
					minDate: 0,
					onSelect: function () {
						var minDate = $('#wdgt-z-flight-calendar-from').datepicker("getDate");
						minDate.addDays(1);
						$("#wdgt-z-flight-calendar-to").datepicker("option", "minDate", minDate);
						$(document).trigger('broacast/calendars', this);
					},
					dateFormat: "ddMyy"
				});

	            $(document).on("click", icons.selector,function (e) {
	                DATEPICKER.call.clickActions($,this);
	            });

   	            $(document).on('broacast/calendars', function(event, who){
	            	console.log('broacast/calendars flight handler');
					var ctrl = $(who);

					if (!ctrl.hasClass('hasDatepicker'))
						return;

					var date = ctrl.datepicker('getDate');

					if (ctrl.hasClass('wdgt-z-from-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-flight-calendar-from')
							$("#wdgt-z-flight-calendar-from").datepicker('setDate', date);
						$("#wdgt-z-flight-calendar-to").datepicker('setDate', date.addDays(1));
					} else if (ctrl.hasClass('wdgt-z-to-calendar')){
						if (ctrl.attr('id') != 'wdgt-z-flight-calendar-to')
							$("#wdgt-z-flight-calendar-to").datepicker('setDate', date);
					}
				});
	        })($,content.find("input[id^='wdgt-z-flight-calendar-']"),content.find("span[id^='wdgt-z-flight-calendar-icon-']"));

			// setting initial dates
			var checkin = travelingDates.from ? travelingDates.from : new Date().addDays(DYNAMICELEMENTS.call.departureOffset);
			$("#wdgt-z-flight-calendar-from").datepicker("setDate", checkin);

			var checkout = travelingDates.to ? travelingDates.to : new Date().addDays(DYNAMICELEMENTS.call.returnOffset);
			$("#wdgt-z-flight-calendar-to").datepicker("setDate", checkout);
		},
		clickActions : function($,elem){
			if(elem.id != "wdgt-z-flight-calendar-icon-from" && elem.id != "wdgt-z-flight-calendar-icon-to")
				return;

			elem = elem.id.replace("wdgt-z-flight-calendar-icon", "#wdgt-z-flight-calendar");
			$(elem).datepicker("show");
		}
	}

	DYNAMICELEMENTS.call = {
		url : "http://secure.rezserver.com/vp/home/?",
		checkRangeTime : false,
		departureOffset : 3,
		returnOffset : 4,
		numOfGuessts : 2,
		refid : '',
		refclickid : '',
		varid : '',
		queion : '',
		cname : 'http://booking.tripplanz.com',
		handdler : function($){
			var flagTextHeader = false;
			var guest = false;
			var formContent = $("form#wdgt-z-flight-form");
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
					case "departure":
						if(element.value!==""){
						    DYNAMICELEMENTS.call.departureOffset = element.value;
						}
						break;
					case "return":
						if(element.value!==""){
						    DYNAMICELEMENTS.call.returnOffset = element.value;
						}
						break;
					case 'cname':
					if(element.value!=""&&element.value!=" ")
						DYNAMICELEMENTS.call.cname = element.value;
					break;
				}
				var flight_target = $('input#wgt-z-auto-complete-flight-to-input');
				var address_target = $('input#change_address_input').val();
				// flight_target.val(address_target);


			});
			DYNAMICELEMENTS.call.url += "refid="+DYNAMICELEMENTS.call.refid+"&"+
											"refclickid="+DYNAMICELEMENTS.call.refclickid+"&"+
											"queion="+DYNAMICELEMENTS.call.queion+"&"+
											"varid="+DYNAMICELEMENTS.call.varid;
		}
	}

	SENDZFORM.call = {
		url : DYNAMICELEMENTS.call.cname+"/flights/search/?",
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
				var dateString = "";
				var stringAirCode = "";
				var send = true;
				if(SENDZFORM.call.flag==false){
					$(document).on("click","input[id^=wdgt-z-flight-submit-button]",function(){
						form = $(document).find("form[id='wdgt-z-flight-form']");
						$.each(form[0].elements,function(index,element){
							if(element.name==="rs_chk_in"||element.name==="rs_chk_out"){
								var ctrl = $(element);
								if (ctrl.hasClass('hasDatepicker')){
									var date = ctrl.datepicker('getDate');
									dateString += element.name+"="+(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear()+"&";
								}
							}else if(element.name==="rs_adults"||element.name==="cabin_class"||element.name==="preferred_stops"){
								urlString += element.name+"="+element.value+"&";
							}else if(element.name==="rs_o_aircode"){
								if(element.value === "" || element.value===" " ||element.value === "undefined") {
									$("div#wdgt-z-flight-form-from label.wdgt-z-val").show();
									$("#wgt-z-auto-complete-flight-from-input").focus();
									send = false;
									return send;
								}
								stringAirCode += "rs_o_city="+($(element).data("code").length>2 ? $(element).data("code") : element.value)+"&";
								send = true;
							}else if(element.name==="rs_d_aircode"){
								stringAirCode += "rs_d_city="+($(element).data("code").length>2 ? $(element).data("code") : element.value)+"&";
							}else if(element.name==="preferred_airline"){
								var code = '';
								code = $(element).data("code");
								if(typeof(code)==="undefined")
									code = '';
								urlString += element.name+"="+code+"&";
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

						SENDZFORM.call.url += dateString+refid+"&"+refclickid+"&"+stringAirCode+urlString;
						if(send)
							SENDZFORM.call.sendData($);
						dateString = '';
						refid = '';
						refclickid = '';
						urlString = '';
						stringAirCode = '';
						SENDZFORM.call.url = DYNAMICELEMENTS.call.cname+"/flights/search/?";
					});
					SENDZFORM.call.flag = true;
				}

			})();
		},
		sendData : function(){
			window.open(SENDZFORM.call.url,"_blank");
		}
	}

	return{call : function(jQuery,$,JQUERYUI){
					jQuery(document).ready(function(){
					    DYNAMICELEMENTS.call.handdler($);
					    MOREOPTIONS.call.toggle($);
					    MOREOPTIONS.resize.listener($);
						EVENTS.call.listener($);
						DATEPICKER.call.listener($);
						SENDZFORM.call.listener($);
						//$("#multi-wdgtz-3").trigger("rendered");
					});
				}
		}
})();
