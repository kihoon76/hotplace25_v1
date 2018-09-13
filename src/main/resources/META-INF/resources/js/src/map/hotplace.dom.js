/**
 * @namespace hotplace.dom
 * */
(function(dom, $) {
	
	var _loadEl,
		_loadTxt = '',//'로딩 중입니다';
		_loadEndCount = 0,
		_yearRangeMode = 'manual', //타임뷰 모드  manual(수동) auto(자동)
		_modalPopup = '#modalPopup',
		_$yearRange = $('#dvYearRange'),
		_$btnAutoYear = $('#btnAutoYear'),
		_$gnbLogin = $('#gnbLogin'),
		_$gnbLogout = $('#gnbLogout'),
		_$modalPopup = $(_modalPopup),
		_$momPopup = $('#momPopup'), //모달 위 모달
		_$alrtPopup = $('#alrtPopup'),
		_$imagePopup = $('#imagePopup'), //이미지 팝업
		_$gnbLogin = $('#gnbLogin'),
		_$gnbLogout = $('#gnbLogout'),
		_btnAlrt = '#btnAlrt',//alert 창버튼
		_btnConfirmOK = '#btnConfirmOK', //confirm 창 OK 버튼
		_btnConfirmCancel = '#btnConfirmCancel', //confirm 창 취소버튼
		_dvContextMenu = '#dvContextMenu',
		_infoWinCoordAddr = null, //context address infowin
		_markerCoord = null,
		_$btnCalcArea = $('#btnCalcArea'), //면적재기 버튼
		_$btnCalcDistance = $('#btnCalcDistance'), //거리재기 버튼
		_$btnStreetView = $('#btnStreetView'),
		_dvCommonPano = '#dvCommonPano', //물건보기에서 파노라마 컨테이너
		_dvCommonPanoInfo = '#dvCommonPanoInfo', //물건보기에서 파노라마 정보 컨테이너
		_dvHeatMapCapture = '#dvHeatMapCapture',
		_$mapArea = $('#mapArea'), 
		_mulgeonAcceptBuilding = '#mulgeonAcceptBuilding',  //물건보기 건축허가 체크박스
		_sliderGrp = {}; //slider 관리객체
	
	dom.onOffAcceptBuilding = function(onOff) {
		var $chk = $(_mulgeonAcceptBuilding);
		if(onOff == 'on') {
			$chk.removeAttr('disabled');
		}
		else {
			$chk.prop('disabled', true);
		}
	}
	
	dom.getModalPopId = function() {
		return _modalPopup;
	}
	
	dom.isActiveCalcArea = function() {
		return _$btnCalcArea.hasClass('active');
	}
	
	dom.isActiveCalcDistance = function() {
		return _$btnCalcDistance.hasClass('active');
	}
	
	dom.isActiveStreetview = function() {
		return _$btnStreetView.hasClass('active');
	}
	
	dom.triggerStreetview = function() {
		_$btnStreetView.trigger('click', true);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function toggleFullScreen
	 * @desc 전체화면 (F11 key can exit programmatic-fullscreen, but programmatic-exitFullscreen cannot exit F11-fullscreen.)
	 * @desc Esc key cannot exit F11-fullscreen, but does exit programmatic-fullscreen.
	 */
	dom.toggleFullScreen = function() {
		if(!document.fullscreenElement &&    // alternative standard method
		    !document.mozFullScreenElement &&
		    !document.webkitFullscreenElement) {  // current working methods
		        if(document.documentElement.requestFullscreen) {
		            document.documentElement.requestFullscreen();
		        } 
		        else if(document.documentElement.mozRequestFullScreen) {
		            document.documentElement.mozRequestFullScreen();
		        }
		        else if(document.documentElement.webkitRequestFullscreen) {
		            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		        }
		}
		else {
			if(document.cancelFullScreen) {
				document.cancelFullScreen();
		    }
			else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
		    }
			else if(document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
		    }
		}
	}
	
	/**
	 * @private
	 * @typedef {object} loadEffects
	 * @desc load mask type
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
	var _loadEffects = {
		bounce: 'bounce',
		rotateplane: 'rotateplane',
		stretch: 'stretch',
		orbit: 'orbit',
		roundBounce: 'roundBounce',
		win8: 'win8',
		win8_linear: 'win8_linear',
		ios: 'ios',
		facebook: 'facebook',
		rotation: 'rotation',
		timer: 'timer',
		pulse: 'pulse',
		progressBar: 'progressBar',
		bouncePulse: 'bouncePulse'
	};
	
	/**
	 * @private
	 * @type {object}
	 * @desc javascript template engine handlebar를 통해 서버에서 가져온 html을 저장
	 */
	var _templates = {};
	function _hasTemplates(name) {
		return !(_templates[name] === undefined);
	}
	
	/**
	 * @private
	 * @type {object}
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow
	 */
	var _infoWindowForCell = null;
	
	/**
	 * @private
	 * @desc cell layer에 기본적으로 표시할 데이터 연도 
	 */
	var _showCellYear = $('body').data('year');
	
	var _timeViewSliderMin = _showCellYear - 5;
	var _timeViewSliderMax = _showCellYear;
	
	/**
	 * @private
	 * @type {function}
	 * @desc 모달창이 닫힌후 실행되는 함수 
	 */
	var _modalCloseAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc alert창이 닫힌후 실행되는 함수 
	 */
	var _alertCloseAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc 모달창이 열린후 실행되는 함수 
	 */
	var _modalOpenAfterFn = function() {};
	
	var _imageModalOpenAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc 모달 위 모달 창이 열린후 실행되는 함수 
	 */
	var _modalOnModalOpenAfterFn = function() {};
	
	/**
	 * @private
	 * @type {function}
	 * @desc 모달 위 모달 창이 닫힌후 실행되는 함수 
	 */
	var _modalOnModalCloseAfterFn = function() {};
	
	/**
	 * @private
	 * @function _runWaitMe
	 * @param {object} loadEl loadmask를 적용할 jquery 객체
	 * @param {number} num loadmask style 선택(1|2|3)
	 * @param {loadEffects} effect loadmask effect type
	 * @param {string} msg 로딩 메시지
	 * @desc open source waitMe 설정
	 * {@link https://github.com/vadimsva/waitMe/blob/gh-pages/index.html waitMe}
	 */
	function _runWaitMe(loadEl, num, effect, msg){
		
		var fontSize = '';
		var maxSize = '';
		var loadTxt = msg || '';//'로딩 중입니다';
		var textPos = '';
		
		switch (num) {
			case 1:
			maxSize = '';
			textPos = 'vertical';
			fontSize = '25px';
			break;
			case 2:
			loadTxt = '';
			maxSize = 30;
			textPos = 'vertical';
			break;
			case 3:
			maxSize = 30;
			textPos = 'horizontal';
			fontSize = '18px';
			break;
		}
		
		_loadEl = loadEl;
		_loadEl.waitMe({
			effect: effect,
			text: loadTxt,
			bg: 'rgba(255,255,255,0.4)',//'rgba(255,255,255,0.4)',
			color: '#000',
			maxSize: maxSize,
			source: 'img.svg',
			textPos: textPos,
			fontSize: fontSize,
			onClose: function() {}
		});
	}
	
	/**
	 * @private
	 * @function _makeInfoWindowForCell
	 * @param {object} vender 맵 벤더객체
	 * @param {object} venderEvent 맵 벤더이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @returns {object} infoWindow
	 * @desc cell layer의 한 cell을 클릭했을때 나타나는 infoWindow를 생성함
	 *       생성후 전역변수 _infoWindowForCell에 저장
	 */
	function _makeInfoWindowForCell(vender, venderEvent, data, listeners) {
		var template = dom.getTemplate('cellForm');
		
		_infoWindowForCell = new vender.InfoWindow({
	        content: template(data),
	        borderWidth: 1
	        //zIndex: 1000
	    });
		
		_infoWindowForCell.setOptions('zIndex', 1000);
		
		if(listeners) {
			for(var eventName in listeners) {
				venderEvent.addListener(_infoWindowForCell, eventName, function($$eventName, $$infoWindowForCell) {
					return function(obj) {
						
						listeners[$$eventName]($$infoWindowForCell, obj);
					}
				}(eventName, _infoWindowForCell));
			}
		}
		
		
		
		return _infoWindowForCell;
	}
	
	/**
	 * @private
	 * @function _bindModalCloseEvent
	 * @param {function} closeFn close event handler
	 * @desc modal창이 닫힐때 실행될 함수를 저장
	 */
	function _bindModalCloseEvent(closeFn) {
		_modalCloseAfterFn = closeFn;
	}
	
	
	function _bindAlertCloseEvent(closeFn) {
		_alertCloseAfterFn = closeFn;
	}
	
	/**
	 * @private
	 * @function _bindModalOpenEvent
	 * @param {function} openFn close event handler
	 * @desc modal창이 열린직후 실행될 함수를 저장
	 */
	function _bindModalOpenEvent(openFn) {
		_modalOpenAfterFn = openFn;
		console.log(_modalOpenAfterFn)
	}
	
	function _bindImageModalOpenEvent(openFn) {
		_imageModalOpenAfterFn = openFn;
	}
	
	
	function _bindModalOnModalOpenEvent(openFn) {
		_modalOnModalOpenAfterFn = openFn;
	}
	
	function _bindModalOnModalCloseEvent(closeFn) {
		_modalOnModalCloseAfterFn = closeFn;
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function getCurrentFnAfterModalClose
	 * @returns {function}
	 * @desc modal창이 닫힐때 실행될 함수를 반환
	 */
	dom.getCurrentFnAfterModalClose = function() {
		return _modalCloseAfterFn;
	}
	
	
	
	/**
	 * @memberof hotplace.dom
	 * @function openInfoWindowForCell
	 * @param {object} 
	 * @param {object} location 맵벤더 LatLng 객체
	 * @param {object} vender 맵벤더 객체(naver.maps, daum.maps)
	 * @param {object} venderEvent 맵벤더 이벤트객체
	 * @param {*} data handlebars를 통해 template에 전달할 데이터
	 * @param {object} listeners 리스너 객체
	 * @param {function} listeners.eventName 리스너
	 * @desc cell 정보를 보여줄 infoWindow를 생성하고 open한다
	 */
	dom.openInfoWindowForCell = function(map, location, vender, venderEvent, data, listeners) {
		_infoWindowForCell = _makeInfoWindowForCell(vender, venderEvent, data, listeners);
		_infoWindowForCell.open(map, location);
		
		//event handler가 걸려있는지 확인
		var ev = $._data(document.getElementById('btnCellClose'), 'events');
		if(!ev || !ev.click) {
			$('#btnCellClose').on('click', function(e) {
				dom.closeInfoWindowForCell();
			});
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function closeInfoWindowForCell
	 * @desc cell 정보를 나타내는 infoWindow를 닫은후 제거한다.
	 */
	dom.closeInfoWindowForCell = function() {
		if(_infoWindowForCell) {
			_infoWindowForCell.close();
			_infoWindowForCell = null;
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function openModal
	 * @param {string} title  modal창 헤더부분에 표시할 title
	 * @param {string} modalSize modal창 사이즈('bigsize'|'fullsize') 
	 * @param {function} closeFn modal창 close handler
	 * @desc 모달창 open
	 */
	dom.openModal = function(title, modalSize, closeFn, openFn) {
		_bindModalCloseEvent(closeFn  || function() {});
		_bindModalOpenEvent(openFn || function() {});
		
		_commonModal(_$modalPopup, modalSize);
	}
	
	dom.openModalOnModal = function(title, modalSize, closeFn, openFn) {
		_bindModalOnModalOpenEvent(openFn || function() {});
		_bindModalOnModalCloseEvent(closeFn || function() {});
		_commonModal(_$momPopup, modalSize);
	}
	
	dom.openImageModalOnModal = function(modalSize, closeFn, openFn) {
		_bindImageModalOpenEvent(openFn || function() {});
		_commonModal(_$imagePopup, modalSize, closeFn, openFn);
	}
	
	dom.openAlrtModal = function(modalSize, closeFn) {
		_bindAlertCloseEvent(closeFn  || function() {});
		_commonModal(_$alrtPopup, modalSize);
	} 
	
	dom.isOpenedAlrtModal = function() {
		return _$alrtPopup.is(':visible');
	}
	
	function _commonModal($element, modalSize, closeFn, openFn) {
		
		//modal popup인지 검사 
		if(_modalPopup == '#' + $element.attr('id')) {
			//modal full size시 height도 fullsize로 만든다.
			if(modalSize) {
				$element.find('.modal-dialog').removeClass('fullWidth');
			}
			else {
				$element.find('.modal-dialog').addClass('fullWidth');
			}
		}
		
		$element.removeClass('in').data('bs.modal', null);
		$element
		.modal({
			backdrop: 'static', 
			keyboard: false
		})
		.find('.modal-dialog')
		.css({
			width: modalSize ? modalSize.width : '96%'
		});
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function createChart
	 * @desc chart 생성
	 */
	dom.createChart = function() {
		hotplace.chart.showEchartBar();
		hotplace.chart.showEchartScatter();
		hotplace.chart.showEchartPie();
		hotplace.chart.showEchartLine();  
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showMask
	 * @param {string} loadEl loadmask element selector  
	 * @param {string} msg 마스크 로딩시 보여질 메시지
	 * @desc waitMe mask show
	 */
	dom.showMask = function(loadEl, msg) {
		if(loadEl) {
			loadEl = $(loadEl);
		}
		else {
			loadEl = $('body');
		}
		_runWaitMe(loadEl, 1, _loadEffects.ios, msg);
	};
	
	/**
	 * @memberof hotplace.dom
	 * @function showMaskTransaction
	 * @param {number} count 하나의 마스크로 처리할 ajax 처리갯수  
	 * @param {string} loadEl loadmask element selector
	 * @param {string} msg 마스크 로딩시 보여질 메시지  
	 * @desc waitMe mask show
	 */
	dom.showMaskTransaction = function(count, loadEl, msg) {
		_loadEndCount = count || 0;
		dom.showMask(loadEl, msg);
	}
	
	dom.discountLoadEndCount = function() {
		if(_loadEndCount > 0) {
			_loadEndCount--;
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideMaskTransaction
	 * @desc waitMe mask hide
	 */
	dom.hideMaskTransaction = function() {
		--_loadEndCount;
		if(_loadEndCount == 0) {
			dom.hideMask();
		}
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideMask
	 * @desc waitMe mask hide
	 */
	dom.hideMask = function() {
		_loadEl.waitMe('hide');
	};
	
	/**
	 * @memberof hotplace.dom
	 * @function getTemplate
	 * @param {string} name 저장할 template의 키값
	 * @returns {object} - Handlebars.compile() 결과값
	 */
	dom.getTemplate = function(name, notUseCache, fn, customUrl) {
		if(_templates[name] === undefined || notUseCache) {
			if(fn) {
				//fn은 반드시 동기로 처리
				try {
					_templates[name] = fn();
				}
				catch(e) {}
			}
			else {
				var url = customUrl || 'resources/templates/' + name + '.handlebars';
				
				hotplace.ajax({
					url : url,
					async : false,
					dataType : 'html',
					method : 'GET',
					activeMask : false,
					success : function(data, textStatus, jqXHR) {
						
						//security check
						if(data.indexOf('{') == 0) {
							var jo = $.parseJSON(data);
							if(!jo.success) {
								if(jo.errCode == hotplace.error.DUP_LOGIN) {
									_templates[name] = hotplace.error.DUP_LOGIN;
									jqXHR.errCode = hotplace.error.DUP_LOGIN;
								}
								else if(jo.errCode == hotplace.error.LOGIN) {
									//_templates[name] = hotplace.error.LOGIN;
									jqXHR.errCode = hotplace.error.LOGIN;
								}
							}
							else {
								_templates[name] = undefined;
							}
							
						}
						else {
							_templates[name] = Handlebars.compile(data);
						}
					},
					error: function(jqXHR, textStatus, e) {
						//throw new Error('html template error');
					}
				});
			}
		}
		
		return _templates[name];
	}
	
	
	dom.checkSession = function(cb) {
		hotplace.ajax({
			url: 'checkSession',
			method: 'GET',
			dataType: 'text',
			activeMask: false,
			success: function(data, textStatus, jqXHR) {
				var jo = $.parseJSON(data);
				cb(jo.success);
			}
		});
	}
	
	
	/**
	 * @memberof hotplace.dom
	 * @function enableYearRangeDiv
	 * @param {boolean} enabled 타임시리얼 DIV 활성화 여부
	 * @desc 타임시리얼 DIV 활성화 여부
	 */
	dom.enableYearRangeDiv = function(enabled) {
		_$yearRange.rangeSlider({enabled:enabled});
		
		if(enabled) {
			_$btnAutoYear.removeAttr('disabled');
		}
		else {
			_$btnAutoYear.prop('disabled', true);
		}
	}
	
	/** 
	 * @memberof hotplace.dom
	 * @name captureImage 
	 * @type {function}
	 * @param {object} $element - 캡쳐할 요소
	 * @param {object} $target - 캡쳐한 이미지를 넣을 요소 혹은 캡쳐한 이미지를 저장한 배열
	 * @param {function} completeFn - 캡쳐이후 실행할 함수
	 * @desc  히트맵을 이미지로 캡쳐해서 보여준다 (ie, safari 지원안됨)
	 * {@link https://github.com/tsayen/dom-to-image dom-to-image}
	 */
	dom.captureImage = function($element, $target, completeFn, errFn) {
		//completeFn();
		domtoimage.toPng($element[0])
	    .then(function(dataUrl) {
	        var img = new Image();
	        
	        img.src = dataUrl;
	        img.style.width = '100%';
	        img.style.height = '400px';
	        
	        if($.isArray($target)) {
	        	$target.push(img);
	        }
	        else {
	        	$target.append(img);
	        }
	        
	        if(completeFn) completeFn();
	    })
	    .catch(function (error) {
	    	if(errFn) errFn();
	        //throw error;
	    });
	}
	
	
	dom.showHeatmapCapturedImages = function(arr) {
		var currYear = $('body').data('year');
		_appendModalPopup('mapCaptureForm', null, {title: hotplace.maps.getActiveCellTypeName(), year:currYear});
		var len = arr.length;
		for(var i = 0; i < len; i++) {
			$('#' + (currYear - 4 + i) + 'Map').append(arr[i]);
		}
		
		arr.length = 0;
		
		$(_dvHeatMapCapture + ' img')
		.off('click')
		.on('click', function() {
			var $td = $(this).parent();
			var captureYear = $td.data('captureYear');
			
			dom.showHeatMapCaptureImagePop({width:1000}, {title:captureYear, src:$(this).prop('src')});
			
		});
		
		dom.openModal('', {width: 1000}, null);
	}
	
	dom.showNoticeList = function() {
		var ok = _appendModalPopup('noticeListForm');
		if(ok) {
			hotplace.notice.showPage();
			
			dom.openModal('', {width: 1000}, function() {
				hotplace.notice.clear();
			});
		}
		else {
			_showLoginMsg();
		}
		
	}
	
	dom.showPopupAlarmForm = function(param, closeFn) {
		_appendModalPopup('popupAlarmForm', _$momPopup, param);
		dom.openModalOnModal('', {width: 900}, closeFn, function() {
			hotplace.payment.popupNotice();
		});
	}
	
	dom.showSite = function() {
		_appendModalPopup('introSiteForm');
		dom.openModal('', {width: 1000});
	}
	
	dom.showSujiTojiUseLimitHistory = function() {
		_appendModalPopup('spotSujibunseogTojiHistoryForm', _$momPopup);
		dom.openModalOnModal('', {width: 1000});
	}
	
	dom.showTutorial = function() {
		_appendModalPopup('tutorialForm');
		var $tuto1 = $('#tuto1'),
			$tuto2 = $('#tuto2'),
			$tuto3 = $('#tuto3'),
			$tuto4 = $('#tuto4'),
			$tuto5 = $('#tuto5');
		
		dom.openModal('', {width: 1000}, function() {
			$tuto1.attr('src', '');
			$tuto2.attr('src', '');
			$tuto3.attr('src', '');
			$tuto4.attr('src', '');
			$tuto5.attr('src', '');
		}, function() {
			//$("#s1").attr("src", 'http://hotplace.ddns.net/resources/video/use1.mp4');
			//동영상을 다시 load 함
			//$("#tutoV").load();
			//load한 동영상을 재생
			//document.getElementById("tutoV").play();
			
			//https://developers.google.com/youtube/player_parameters?hl=ko
			$tuto1.attr('src', 'https://www.youtube.com/embed/7RdSsO-AMmc?vq=hd1080&rel=0');
			$tuto2.attr('src', 'https://www.youtube.com/embed/Vop21AvrMP0?vq=hd1080&rel=0');
			$tuto3.attr('src', 'https://www.youtube.com/embed/cLFH1UOo4z0?vq=hd1080&rel=0');
			$tuto4.attr('src', 'https://www.youtube.com/embed/NEq9V8rU2_4?vq=hd1080&rel=0');
			$tuto5.attr('src', 'https://www.youtube.com/embed/_rJ4oAw7XkY?vq=hd1080&rel=0');
		});
	}
	
	dom.showAcceptBuildingDetail = function(fn, param) {
		var ok = _appendModalPopup('acceptbuildingDetailForm', null ,param);
		if(ok) dom.openModal('', {width: '800'}, null, fn);
		
		return ok;
	}
	
	dom.showGyeongmaeDetail = function(fn, param) {
		var ok = _appendModalPopup('gyeongmaeDetailForm', null ,param);
		if(ok) dom.openModal('', null, null, fn);
		
		return ok;
	}
	
	dom.showGyeongmaeImage = function(modalSize, param) {
		_appendModalPopup('gyeongmaeImageForm', _$imagePopup, param);
		dom.openImageModalOnModal(modalSize);
	}
	
	dom.showSujiLurisDrawing = function(modalSize, param) {
		_appendModalPopup('spotSujibunseogImageForm', _$imagePopup, param);
		dom.openImageModalOnModal(modalSize);
	}
	
	dom.showHeatMapCaptureImagePop = function(modalSize, param) {
		_appendModalPopup('mapCaptureImageForm', _$imagePopup, param);
		
		dom.openImageModalOnModal(modalSize, null, function() {
			$('#dvEnlargeHeatmapImageModalSource').zoom();
		});
	}
	
	dom.showGongmaeDetail = function(fn, param) {
		var ok = _appendModalPopup('gongmaeDetailForm', null ,param);
		if(ok) dom.openModal('', null, null, fn);
		return ok;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 bar DIV
	 * {@link http://ghusse.github.io/jQRangeSlider/documentation.html jQRangeSlider} 
	 */
	dom.showYearRangeDiv = function(mx, mn) {
		var max = _timeViewSliderMax, min = _timeViewSliderMin, i = 0, step = 1;
		var range = max - min;
		var capturedImgs = [];
		/*
		 * Auto
		 * */
		var runFn = hotplace.maps.showCellLayer;
		var callback = function() {
			i++;
			if(i<=range) {
				try {
					//ms 브라우저는 캡쳐하지 않는다.
					if(hotplace.browser.msie || hotplace.browser.msedge) {
						setTimeout(function() {
							_$yearRange.rangeSlider('scrollRight', step);
							
							if(i == range) {
								i = 0;
								_triggerAutoYearRangeDiv();
								dom.removeBodyAllMask();
								hotplace.dom.showAlertMsg(null, '크롬브라우저를 사용하시면 캡쳐된 이미지를 제공합니다.', {width:550});
							}
						}, 2000);
					}
					else {
						dom.captureImage($('body'), capturedImgs, function() {
							_$yearRange.rangeSlider('scrollRight', step);
							if(i == range) {
								i = 0;
								_triggerAutoYearRangeDiv();
								dom.showHeatmapCapturedImages(capturedImgs);
								dom.removeBodyAllMask();
							}
						});
					}
				}
				catch(e) {
					console.log(e);
					dom.initYearRangeDiv();
					hotplace.processAjaxError(hotplace.error.HEATMAP_CAPTURE);
					dom.removeBodyAllMask();
					throw e;
				}
			}
		};
		
		_$yearRange.rangeSlider({
			arrows: false,
			enabled: false,
			bounds: {min: min, max: max},
			defaultValues: {min: max-1, max: max},
			step: 1,
			range:{min:1, max:1},
			formatter: function(val) {
				if(val == max) {
					val = '오늘'; 
				}
				else {
					val = (max - val) + '년전';
				}
				return val;
			}
		});
		
		/********************************************************
		* valuesChange 이벤트를 사용하면 안됨
		* 중간에 오류가 났을경우 dom.initYearRangeDiv 메소드를 호출하는데
		* range 초기값을 다시 설정할때 valuesChange는 호출이 되지만 
		* userValuesChanged 이벤트는 호출되지 않는다.
		*********************************************************/
		_$yearRange.on('userValuesChanged', function(e, data){
			//auto mode에서 slider가 처음위치에 있었을때 trigger로 들어왔을 경우
			_showCellYear = (data == undefined) ? _timeViewSliderMin + (_$yearRange.rangeSlider('option', 'step')) : data.values.max;
			
			dom.addBodyAllMask();
			setTimeout(function() {
				if(_yearRangeMode == 'auto') {
					runFn(callback);
				}
				else {
					runFn();
					dom.removeBodyAllMask();
				}
			}, 100);
		});
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function showAutoYearRangeDiv
	 * @param {number} mx 보여줄 최근연도
	 * @param {number} mn 보여줄 지난연도
	 * @desc 타임시리얼 자동재생 button DIV
	 */
	dom.showAutoYearRangeDiv = function() {
		_$btnAutoYear.on('change', function(e, p) {
			if(p) {
				var b = $(this).prop('checked');
				$(this).prop('checked', !b);
			}
			
			if($(this).prop('checked')) {
				_yearRangeMode = 'auto';
				
				//현재 slider의 위치가 처음부분에 있으면  userValuesChanged 이벤트가 발생하지 않는다. 
				if(_$yearRange.rangeSlider('min') == _timeViewSliderMin) {
					//이벤트 강제발생
					_$yearRange.trigger('userValuesChanged');
				}
				else {
					_$yearRange.rangeSlider('scrollLeft', 100);
				}
			}
			else {
				_yearRangeMode = 'manual';
			}
		});
	}
	
	function _triggerAutoYearRangeDiv() {
		_$btnAutoYear.trigger('change', ['refresh']);
	}
	
	dom.initYearRangeDiv = function() {
		if(_yearRangeMode == 'auto') {
			_triggerAutoYearRangeDiv();
		}
		
		dom.initYearRangeValue();
	}
	
	dom.initYearRangeValue = function() {
		_showCellYear = $('body').data('year');
		_$yearRange.rangeSlider('values', _showCellYear - 1, _showCellYear);
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function getShowCellYear
	 * @returns {number} 보이는 cell의 데이터 연도
	 * @desc 보이는 cell의 데이터 연도를 가져온다
	 */
	dom.getShowCellYear = function() {
		return _showCellYear;
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function hideYearRangeDiv
	 * @desc 타임시리얼 bar DIV 를 감춘다.
	 */
	dom.hideYearRangeDiv = function() {
		_$yearRange.hide();
		_$yearRange.rangeSlider('destroy');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function addBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적으로 mask를 씌운다
	 */
	dom.addBodyAllMask = function() {
		$('#dimScreen').show();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function removeBodyAllMask
	 * @desc body위에 사용자의 action을 차단할 목적의 mask를 제거한다
	 */
	dom.removeBodyAllMask = function() {
		$('#dimScreen').hide();
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function loadScript
	 * @param {string} url - script 경로
	 * @param {function} loadFn - script onload handler
	 * @desc 스크립트를 동적으로 로딩한다
	 */
	dom.loadScript = function(url, loadFn) {
		var script = document.createElement('script');
		
		if(loadFn) 	script.onload = loadFn;
		script.src = hotplace.getContextUrl() + url;
		document.body.appendChild(script);
	}
	
	dom.showAlertMsg = function(fn, msg, modalSize, btnText) {
		_appendModalPopup('alertForm', _$alrtPopup);
		_$alrtPopup.find('p.alertText').html(msg || '');
		
		if(btnText) $(_btnAlrt).text(btnText);
		dom.openAlrtModal(modalSize, fn);
	}
	
	dom.showConfirmBox = function(okFn, msg, modalSize, cancelFn) {
		_appendModalPopup('confirmForm', _$alrtPopup);
		_$alrtPopup.find('p.alertText').html(msg || '');
		
		$(_btnConfirmOK)
		.off('click')
		.on('click', function() {
			if(okFn) okFn();
			_$alrtPopup.modal('hide');
		});
		
		$(_btnConfirmCancel)
		.off('click')
		.on('click', function() {
			if(cancelFn) cancelFn();
			_$alrtPopup.modal('hide');
		});
		
		dom.openAlrtModal(modalSize);
	}
	
	function _appendModalPopup(formName, $element, param) {
		var tForm = dom.getTemplate(formName);
		if(!tForm) return false;
		($element || _$modalPopup).html(tForm(param));
		
		return true;
	}
	
	function _showLoginMsg() {
		if(!hotplace.dom.isOpenedAlrtModal())
		hotplace.processAjaxError(hotplace.error.LOGIN);
		
		//로그인후 세션 만료로 로그인창이 나타났을때 메인 페이지 로그인/아웃 변경
		//_changeLogout();
	}
	
	function _changeLogout() {
		if(_$gnbLogout.css('display') !== 'none') {
			_$gnbLogin.show();
			_$gnbLogout.hide();
		}
	}
	
	dom.showLoginMsg = _showLoginMsg;
	
	dom.showExpireMsgForm = function(fn, param) {
		var ok = _appendModalPopup('remainingDurationForm', null, param);
		
		if(ok) {
			dom.openModal('', {width:'610'}, fn, function() {
				$('#btnRemainingClose')
				.off('click')
				.on('click', function() {
					if($('#chkViewRemainingCookie').is(':checked')) {
						$.cookie('remain', 'N', {expires:1, path: '/'});
					}
					
					dom.closeModal();
				});
			});
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.goPaymentFromExpireMsgForm = function() {
		dom.closeModal();
		dom.showPaymentForm();
	}
	
	
	dom.showLoginForm = function(fn) {
		_appendModalPopup('loginForm');
		dom.openModal('', {width: '410'}, fn);
	}
	
	dom.showSpotSujibunseogForm = function(fn, param) {
		var ok = _appendModalPopup('spotSujibunseogForm', null, param);
		
		if(ok) {
			dom.openModal('', null, null, fn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showSujiGongsiHistory = function(fn, param) {
		var ok = _appendModalPopup('spotSujibunseogGongsiHistoryForm', _$momPopup, param);
		
		if(ok) {
			dom.openModalOnModal('', {width: 400}, null, fn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showSpotGwansimRegForm = function(param, closefn, openFn) {
		var ok = _appendModalPopup('spotGwansimRegForm', null, param);
		if(ok) {
			dom.openModal('', {width: '500'}, closefn, openFn);
		}
		else {
			_showLoginMsg();
		}
		
	}
	
	dom.showSpotMaemulRegForm = function(fn, param) {
		var ok = _appendModalPopup('spotMaemulRegForm', null, param);
		if(ok) {
			dom.openModal('', {width: '500'}, fn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showSpotConsultingForm = function(closeFn, openFn, param) {
		var ok = _appendModalPopup('spotConsultingForm', null, param);
		if(ok) {
			dom.openModal('', {width: '500'}, closeFn, openFn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showSpotTojiUseLimitForm = function(closeFn, openFn, param) {
		var ok = _appendModalPopup('spotTojiUseLimitForm', null, param);
		if(ok) {
			dom.openModal('', {width: '1000'}, closeFn, openFn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showSpotTojiDefaultForm = function(closeFn, openFn, param) {
		var ok = _appendModalPopup('spotTojiDefaultInfoForm', null, param);
		if(ok) {
			dom.openModal('', {width: '700'}, closeFn, openFn);
		}
		else {
			_showLoginMsg();
		}
	}
	
	dom.showMulgeonPanoramaForm = function(closeFn, openFn, param) {
		_appendModalPopup('mulgeonPanoForm', null, {address:param.address});
		
		hotplace.panomaps.createPanomaps(hotplace.panomaps.MULGEON_MODE, _dvCommonPano.substring(1), param.x, param.y, true, function(location, msg, pano) {
			pano.zoomIn();
			$(_dvCommonPanoInfo).html(msg);
		});
		
		dom.openModal('', {width:'500'});
	}
	
	dom.showPwSearchForm = function(closeFn, openFn) {
		_appendModalPopup('searchPwForm', _$momPopup);
		dom.openModalOnModal('', {width: 400});
	}
	
	dom.showSelectRadioForm = function(closeFn) {
		_appendModalPopup('selectGyeongGongForm', _$alrtPopup);
		dom.openAlrtModal({width: '400px'}, closeFn);
	}
	
	dom.showMypage = function(openFn) {
		//template 저장 안하고 계속 새로 로딩 
		if(true/*_templates['mypageForm'] == undefined*/) {
			hotplace.ajax({
				async: true,
				url: 'handlebar/mypage',
				dataType : 'html',
				method : 'GET',
				success : function(data, textStatus, jqXHR) {
					if(data.indexOf('{') == 0) {
						jqXHR.errCode = hotplace.error.LOGIN;
						return;
					}
					
					_templates['mypageForm'] = Handlebars.compile(data);
					_appendModalPopup('mypageForm');
					dom.openModal('', {width:'800'}, null, openFn);
				},
				error: function() {
					throw new Error('html template error')
				}
			});
		}
	}
	
	dom.showMypageGwansimPop = function(param, fn) {
		hotplace.ajax({
			url: 'spot/my/gwansim?gwansimNum=' + param,
			dataType : 'html',
			method : 'GET',
			success : function(data, textStatus, jqXHR) {
				_templates['mypageGwansimForm'] = Handlebars.compile(data);
				_appendModalPopup('mypageGwansimForm', _$momPopup);
				
				if(fn) fn();
				dom.openModalOnModal('', {width:'500'});
			},
			error: function() {
				throw new Error('html template error')
			}
		});
	}
	
	dom.showIntroMain = function() {
		_appendModalPopup('introMainForm', null, {});
		dom.openModal('', {width:'600'}, null, function() {
			$('#btnIntroMainClose')
			.off('click')
			.on('click', function() {
				if($('#chkIntroCookie').is(':checked')) {
					$.cookie('intro', 'N', {expires:36500, path: '/'});
				}
				
				dom.closeModal();
			});
		});
	}
	
	dom.showUpdateInfo = function(updateInfo) {
		var formName = '',
			closeBtn = '';
		
		if(updateInfo.tempNum == '1') {
			formName = 'updateAlarmForm';
			closeBtn = '#btnUpdateInfoClose';
		}
		else {
			formName = 'updateAlarmForm2';
			closeBtn = '#btnUpdateInfoClose2';
		}
		
		_appendModalPopup(formName, null, updateInfo);
		dom.openModal('', {width:'600'}, null, function() {
			$(closeBtn)
			.off('click')
			.on('click', function() {
				$.cookie('update', updateInfo.version, {expires:10, path: '/'});
				
				dom.closeModal();
			});
		});
	}
	
	dom.showLogoutForm = function(fn) {
		dom.showConfirmBox(function() {
			dom.addBodyAllMask();
			dom.logout(fn);
		}, '로그아웃 하시겠습니까?', {width: '410'});
	}
	
	dom.showPaymentForm = function() {
		_templates['paymentForm'] = null;
		if(_templates['paymentForm'] == undefined) {
			hotplace.ajax({
				async: false,
				url: 'handlebar/payment',
				dataType : 'html',
				method : 'GET',
				activeMask : false,
				success : function(data, textStatus, jqXHR) {
					//security check
					if(data.indexOf('{') == 0) {
						var jo = $.parseJSON(data);
						if(!jo.success) {
							jqXHR.errCode = jo.errCode;
						}
					}
					else {
						_templates['paymentForm'] = Handlebars.compile(data);
					}
				},
				error: function() {
					throw new Error('html template error')
				}
			});
		}
		
		if(_templates['paymentForm']) {
			_appendModalPopup('paymentForm', null, {});
			
			dom.openModal('', {width:'700px'}, null, function() {
				hotplace.payment.init();
				hotplace.payment.addPayment();
			});
		}
	
	}
	
	dom.showPaymentDetailForm = function(param) {
		_appendModalPopup('paymentDetailForm', _$momPopup, param);
		dom.openModalOnModal('', {width:'700px'});
	}
	
	dom.showInicisForm = function(param, closeFn, openFn) {
		_appendModalPopup('inicisPaymentForm', _$momPopup, param);
		dom.openModalOnModal('', {width:'842px'}, closeFn, openFn);
	}
	
	dom.toggleLogin = function() {
		if(_$gnbLogin.is(':visible')) {
			_$gnbLogin.hide();
			_$gnbLogout.show();
		}
		else {
			_$gnbLogout.hide();
			_$gnbLogin.show();
		}
	}
	
	dom.showJoinForm = function(modalSize, fn) {
		if(_templates['joinForm'] == undefined) {
			hotplace.ajax({
				async: false,
				url: 'handlebar/join',
				dataType : 'html',
				method : 'GET',
				activeMask : false,
				success : function(data, textStatus, jqXHR) {
					_templates['joinForm'] = Handlebars.compile(data);
				},
				error: function() {
					throw new Error('html template error')
				}
			});
		}
		
		_appendModalPopup('joinForm');
		
		//이메일 && 연락처 dom 생성
		$('#joinUserPhoneF').html(hotplace.util.getPhoneOptions());
		$('#joinUserEmail2').html(hotplace.util.getEmailOptions());
		dom.openModal('', modalSize, fn);
	}
		
	dom.logout = function(fn) {
		hotplace.ajax({
			url: 'logout',
			method: 'POST',
			dataType: 'text',
			async: false,
			success: function(data, textStatus, jqXHR) {
				console.log(data);
				var jo = $.parseJSON(data);
				if(jo.success) {
					if(fn) fn();
				}
			},
			error: function() {
				
			}
		});
	}
	
	dom.closeModal = function() {
		_$modalPopup.modal('hide');
	}
	
	dom.closeMom = function() {
		_$momPopup.modal('hide');
	}
	
	function _setModalMaxHeight($element) {
		var $content = $element.find('.modal-content');
		var $dialog = $element.find('.modal-dialog');
		var $body = $element.find('.modal-body');
		
		var borderWidth   = $content.outerHeight() - $content.innerHeight();
	    var dialogMargin  = $(window).width() < 768 ? 20 : 60;
	    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
	    var headerHeight  = $element.find('.modal-header').outerHeight() || 0;
	    var footerHeight  = $element.find('.modal-footer').outerHeight() || 0;
	    var maxHeight     = contentHeight - (headerHeight + footerHeight);

		$content.css({'overflow':'hidden'});
	  
		if($dialog.hasClass('fullWidth')) {
			$body
			.css({
				'max-height': maxHeight,
				'min-height': maxHeight,
				'overflow-y': 'auto'
			});
		}
		else {
			$body
			.css({
				'max-height': maxHeight,
				'overflow-y': 'auto'
			});
		}
		
		/*$element
		.find('.modal-body')
		.css({'max-height': maxHeight, 'overflow-y': 'auto'});*/
	}
	
	function _setModalMarginTop($element) {
		var $dialog      = $element.find('.modal-dialog');
		var dialogHeight  = $dialog.height();
		
		$dialog.css({
			'margin-top' : -dialogHeight/2
		});
	}

	function _initModalSize($modal) {
		_setModalMaxHeight($modal);
		_setModalMarginTop($modal);
	}
	
	dom.initModalPosition = _initModalSize;
	
	/*************************************************************
	 * 모달창 열린후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$modalPopup.on('shown.bs.modal', function(e) {
		_initModalSize($(this));
		$('.modal-backdrop').remove();
		_modalOpenAfterFn();
	});
	
	/*************************************************************
	 * 이미지 모달창 열린후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$imagePopup.on('shown.bs.modal', function(e) {
		_initModalSize($(this));
		$('.modal-backdrop').remove();
		_imageModalOpenAfterFn();
	});
	
	/*************************************************************
	 * 모달의 모달창 열린후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$momPopup.on('shown.bs.modal', function(e) {
		_initModalSize($(this));
		$('.modal-backdrop').remove();
		_modalOnModalOpenAfterFn();
	});
	
	_$momPopup.on('hidden.bs.modal', function(e) {
		_modalOnModalCloseAfterFn();
	});
	
	/*************************************************************
	 * 모달창 닫힌후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$modalPopup.on('hidden.bs.modal', function(e) {
		_modalCloseAfterFn();
	});
	
	/*************************************************************
	 * alert창 열린후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$alrtPopup.on('shown.bs.modal', function(e) {
		_initModalSize($(this));
		$('.modal-backdrop').remove();
	});
	
	/*************************************************************
	 * alert창 닫힌후 발생하는 이벤트 핸들러
	 ************************************************************/
	_$alrtPopup.on('hidden.bs.modal', function(e) {
		_alertCloseAfterFn();
	});
	

	
	//로그인 메시지에서 로그인 화면으로 전환
	$(document).on('click', '#btnDirectLogin', function() {
		//이전에 설정된 동작은 마무리한다.
		_modalCloseAfterFn();
		
		_modalCloseAfterFn = function() {
			$('#rmenu_user').trigger('click', {
				callbackOn: dom.rightMenuUserCallback
			});
		};
		
		dom.closeModal();
	});

	dom.showLnbContent = function($element) {
		var $parent   = $element.parent('li');		
		var data      = $element.data('name');
		var isNewDom  = $element.data('new');
		//메인화면 로드시 미리 같이 로드되어야 하는지 여부
		var isFirstLoad = $element.data('firstLoad');
		
		
		var isLoginErr = _bindLnbMenu(data, isNewDom);
		if(isLoginErr == -1) return;
		
		var showBeforeFn;
		var showAfterFn = hotplace.menu.initMenuDom(data);
		
		/*************************************************************
		* 초기에는 lnb가 열린후에 실행될 함수만 리턴했는데 열리기전 실행될 함수가 추가됨
		* showAfterFn type이 function이면 기존대로 show이후 실행
		* {before:function, after:function}
		**************************************************************/
		if(showAfterFn) {
			if($.isPlainObject(showAfterFn)) {
				showBeforeFn = showAfterFn.before;
				showAfterFn = showAfterFn.after;
			}
		}
		
		if(showBeforeFn) showBeforeFn();
		
		if(isFirstLoad) {
			$element.data('firstLoad', false);
			return;
		}
		
		$parent.addClass('active');
		$parent.siblings('li').removeClass('active');

		$('#lnbCont > .lnbContWrap').hide();
		$('#lnbCont > #' + data).show();
		
		//map area position
		var contWidth  = $('#lnbCont > #' + data).outerWidth();
		var lnbWidth   = $('#lnbArea').outerWidth();
		var totalWidth = lnbWidth + contWidth

		$('.mapArea').animate({
			'left': totalWidth - 1
		},100);

		var minWidth = 964 - contWidth
		$('.mapArea').css({'min-width':minWidth});
		
		if(showAfterFn) showAfterFn();
	}
	
	// 좌메뉴 컨텐츠 하단 footerEtcText 있을시 해당 bodyArea의 bottom재설정
	dom.setLnbContentBodyArea = function() {
		if ($('.footerEtcText').length != 0){
			$('.footerEtcText').each(function() {
				var thisBody = $(this).parents('.lnbContWrap').find('.bodyArea');
				var footerH = $(this).parents('.lnbContWrap').find('.footArea').outerHeight();
				var thisH = $(this).outerHeight();

				thisBody.css({'bottom': thisH + footerH});
			});
		}
	}
	
	dom.getLnbContentBodyAreaHeight = function(dvMenu) {
		return $('#' + dvMenu + ' .bodyArea').outerHeight();
	}
	
	function _bindLnbMenu(menuName, isNew) {
		var dir = 'menu/';
		var menus = hotplace.config.menus;
		var tForm = null;
		var param = {
			menuName: menuName	
		}
		//기존폼(dom에서 detach을 안하고 재사용)
		if(!isNew) {
			//로딩된 폼이 있는지 검사
			if(_hasTemplates(dir + menuName)) return;
		}
		
		//jsp일경우
		if(menuName == 'myGwansimMenu') {
			tForm = dom.getTemplate(dir + menuName, true, null, 'handlebar/myGwansimMenu');
		}
		else {
			tForm = dom.getTemplate(dir + menuName);
		}
		
		if(!tForm) return -1;
		
		switch(menuName) {
		case menus.TOOJA_SEARCH:
		case menus.GYEONGGONG_SEARCH:
			param.codes = hotplace.config.codes;
			break;
		}
		
		$('#' + menuName).html(tForm(param));
	}
	
	dom.hideLnbContent = function($obj) {
		var $menu = $obj.parent().parent();
		$menu.hide();
		$('#memuList > li').removeClass('active');

		
		var lnbWidth   = $('#lnbArea').outerWidth();
		$('.mapArea').animate({
			'left': lnbWidth 
		},50);
		$('.mapArea').css({'min-width':'964px'});
		
		//
		//$(window).trigger('resize');
	}
	
	/**
	 * @memberof hotplace.dom
	 * @function activeButton
	 * @param {string} onOff - 버튼 active or inactive 여부('on'|'off')
	 * @param {object} $btn - 버튼객체
	 * @desc 버튼
	 */
	dom.activeButton = function(onOff, $btn) {
		if(onOff == 'on') {
			$btn.data('switch', 'off');
			$btn.removeClass('active');
		}
		else {
			$btn.data('switch', 'on');
			$btn.addClass('active');
		}
	}
	
	dom.isActiveMenu = function(menuClassNum) {
		var $a = $('#memuList a.' + menuClassNum);
		//console.log($('#memuList'))
		if($a.get(0)) {
			if($a.parent().hasClass('active')) {
				return true;
			}
			
			return false;
		}
		
		return false;
	}
	
	dom.triggerMenu = function(menuClassNum) {
		var $a = $('#memuList a.' + menuClassNum);
		if($a.get(0)) {
			$a.trigger('click');
		}
	}
	
	dom.listExpandCollapse = function(parentId) {
		$(parentId + ' button[data-role="slideShow"], a[data-role="slideShow"]')
		.off('click')
		.on('click', function() {
			var $this = $(this);
			var $target = $($this.attr('href'));
			
			if($this.hasClass('stateOn')){
				$this.removeClass('stateOn');
				$target.slideUp(100);
			} 
			else {
				$this.addClass('stateOn');
				$target.slideDown(100);

				_rangeSliderResize($target); // rangeSlider Resize 스크립트
			}
		});
	}
	
	
	dom.getSliderValues = function(gName, targetId) {
		if(_sliderGrp[gName]) {
			var len = _sliderGrp[gName].length;
			if(len>0) {
				for(var i=0; i<len; i++) {
					if(_sliderGrp[gName][i].attr('id') == targetId) {
						return _sliderGrp[gName][i].rangeSlider("values");
					}
				}
			}
		}
		
		throw new Error('slider가 존재하지 않습니다.');
	}
	
	dom.initSlider = function(gName, isNew, obj) {
		if(!isNew && _sliderGrp[gName]) return;
		_sliderGrp[gName] = [];
		var len = obj.length;
		
		for(var i=0; i<len; i++) {
			_sliderGrp[gName].push($(obj[i].targetId));
			
			var t = $(obj[i].targetId);
			
			_sliderGrp[gName][_sliderGrp[gName].length - 1].rangeSlider({
				  bounds: obj[i].bounds || {min: -10, max: -1},
				  step: 1,
				  defaultValues: obj[i].defaultValues || {min:-4, max:-1},
				  formatter: function(val) {
					  //console.log(val)
					  return Math.abs(val) + '등급';
				  }
			});
			
			_sliderGrp[gName][_sliderGrp[gName].length - 1].bind('valuesChanged', function(e, data) {
				var id = e.currentTarget.id;
				var values = data.values;
				
				/*_hpGradeParam[id].min = Math.abs(values.max);
				_hpGradeParam[id].max = Math.abs(values.min);*/
			});
		}
	}
	
	dom.resizeSliderGrp = function(gName) {
		if(_sliderGrp[gName]) {
			
			for(var i=_sliderGrp[gName].length-1; i>=0; i--) {
				_sliderGrp[gName][i].rangeSlider('resize');
			}
		}
	}
	
	dom.hideContextMenu = function() {
		$(_dvContextMenu).hide();
	}
	
	dom.createTabulatorNoEdit = function(cell) {
		 var data = cell.getRow().getData();
		 return data.pseudo !== undefined; 
	}
	
	dom.createTabulator = function(tableId, param, tbData, initialSort) {
		var $table = $(tableId);
		param = param || {};
		
		if(initialSort) {
			param.initialSort = initialSort; 
		}
		
		$table.tabulator($.extend({
		    height:'826',//826, // set height of table (높이가 설정되지 않으면 virtual dom 동작안함)
		    fitColumns:true, //fit columns to width of table (optional)
		    autoResize:true,
		    rowClick:function(e, row){ //trigger an alert message when the row is clicked
		       var data = row.getData();
		       hotplace.dom.showAlertMsg();
		       
		       /*var formName, icon = '', callbak = null;
		       
		       if(data.gubun == 'G') {
		    	   formName = 'gyeongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GYEONGMAE;
		    	   callback = function(map, marker, win) {
			    	   marker._data = {info:{unu:data.unu}};
			    	   hotplace.gyeongmae.markerClick(map, marker, win);
			       }
		       }
		       else {
		    	   formName = 'gongmaeForm';
		    	   icon = hotplace.maps.MarkerTypes.GONGMAE;
		       }
		       
		       _moveMulgeon(data.lng, data.lat, data.address, formName, callback, icon);
		       */
		    },
		}, param));
		
		$table.tabulator('setData', tbData);
	}
	
	dom.getTabulatorSelectFilter = function(arr) {
		return function(cell, onRendered, success, cancel, editorParams) {
			
			var len = arr.length;
			
			var htmlStr = '';
				
			for(var i=0; i<len; i++) {
				htmlStr += '<option value="' + arr[i].value + '">' + arr[i].name + '</option>';
				//console.log(htmlStr);
			}
				
			var editor = $('<select><option value="">전체</option>' + htmlStr + '</select>');
			editor.css({
				'padding':'3px',
		        'width':'100%',
		        'box-sizing':'border-box',
		    });
			 
			//Set value of editor to the current value of the cell
			editor.val(cell.getValue());
			  
			//set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
			onRendered(function(){
				editor.focus();
				editor.css('height','100%');
			});
			 
			//when the value has been set, trigger the cell to update
			editor.on('change blur', function(e){
				success(editor.val());
			});
			
			editor.on('focus', function(e) {
//				console.log(e);
//				e.preventDefault();
//				$(e.currentTarget).blur();
			});
			
	
			//return the editor element
			return editor;
		}
	};
	
	function _rangeSliderResize($target) {
		var length = $target.find('.rangeSlider').length;
	   
		if (!length == '0')	{
			//alert(length + tId);
			$target.find('.rangeSlider').each(function(index) {
				var id = $(this).attr('id');
				$('#' + id).rangeSlider().resize();
			});
		}
	}
	
	dom.closeCoordWindow = function() {
		if(_infoWinCoordAddr) _infoWinCoordAddr.close();
	}
	

	dom.searchCoordToAddress = function(coord, tm128) {
		/*if(!_markerCoord) {
			_markerCoord = new naver.maps.Marker({
			    position: coord,
			    map: hotplace.maps.getMap()
			});
			
			var content = '<img src="'+ hotplace.getContextUrl() +'resources/img/marker/' + options.icon + '" alt="" ' +
	 			  		  'style="margin: 0px; padding: 0px; border: 0px solid transparent; display: block; max-width: none; max-height: none; ' +
	 			  		  '-webkit-user-select: none; position: absolute; width: ' + x + 'px; height: ' + y + 'px; left: 0px; top: 0px;">';
		}*/
		
		if(!_infoWinCoordAddr) {
			_infoWinCoordAddr = new naver.maps.InfoWindow({
				backgroundColor: 'transparent',
				borderColor: '#666',
				borderWidth: 0,
				anchorSize: new naver.maps.Size(0, 0),
				anchorSkew: false,  
				pixelOffset: new naver.maps.Point(0, -12)
			})
		}
		
		naver.maps.Service.reverseGeocode({
	        location: tm128,
	        coordType: naver.maps.Service.CoordType.TM128
	    }, function(status, response) {
	    	
	    	function __show(addr) {
	    		_infoWinCoordAddr.setContent([
     	            '<div class="mapInnerBox onlyText">',
     	            '   <div class="mibBody">',
     	            		addr,
     	            ' 		<button class="closeBtn" onclick="hotplace.dom.closeCoordWindow()"><span class="hidden">닫기</span></button>',
     	            '   </div>',
     	            '</div>'
     	            ].join(''));

     	        _infoWinCoordAddr.open(hotplace.maps.getMap(), coord);
	    	}
	    	
	        if (status === naver.maps.Service.Status.ERROR) {
	            return hotplace.processAjaxError(hotplace.error.COORD);
	        }

	        var items = response.result.items,
	        	address = [],
	            htmlAddresses = [];

	        for (var i=0, ii=items.length, item, addrType; i<ii; i++) {
	            item = items[i];
	            addrType = item.isRoadAddress ? '[도로명 주소]' : '[지번 주소]';

	            if(item.isRoadAddress) continue;
	            
	            address.push(item.address);
	            htmlAddresses.push(/*(i+1) +'. '+ */addrType +' '+ item.address);
	        }

	        if(address.length == 0) return;
	        
	        //검색된 주소로 PNU가져오기
	        hotplace.ajax({
	        	url: 'search/addrToPnu',
				method: 'POST',
				contentType: 'application/json; charset=UTF-8',
				data: JSON.stringify({address: address[0]}),
				dataType: 'text',
				activeMask: true,
				success: function(data, textStatus, jqXHR) {
					console.log(coord);
					
					if(data) {
						//PNU 존재
						hotplace.maps.destroyMarkerType(hotplace.maps.MarkerTypes.ADDRESS_SEARCH);
						hotplace.maps.destroyMarkerWindow(hotplace.maps.MarkerTypes.ADDRESS_SEARCH);
						
						var lng = coord.x;
						var lat = coord.y;
						
						if(!lng || !lat) {
							hotplace.processAjaxError(hotplace.error.MISS_LATLNG);
							return;
						}
						
						
						hotplace.maps.panToLikeAddressSearch(lat, lng, null, {address:address[0], pnu:data, lng:lng, lat:lat}, null, null, hotplace.maps.getCurrentLevel());
					}
					else {
						 /*_infoWinCoordAddr.setContent([
               	            '<div class="mapInnerBox onlyText">',
               	            '   <div class="mibBody">',
               	            		htmlAddresses[0],
               	            ' 		<button class="closeBtn" onclick="hotplace.dom.closeCoordWindow()"><span class="hidden">닫기</span></button>',
               	            '   </div>',
               	            '</div>'
               	            ].join(''));

               	        _infoWinCoordAddr.open(hotplace.maps.getMap(), coord);*/
						__show(htmlAddresses[0]);
					}
				},
				error: function() {
					__show(htmlAddresses[0]);
				}
	        });
	    });
	}
	
	dom.adjustMapZindex = function(z) {
		_$mapArea.css('z-index', z || '0');
	}
	
	dom.initTooltip = function(containerId, options) {
		var defaultOpt = {html:true};
		options = options || {};
		
		$(containerId + ' .TOOLTIP').tooltip($.extend({
			html:true
		}, options.config || {}));
		
		if(options.events) {
			for(eventName in options.events) {
				$(containerId + ' .TOOLTIP')
				.off(eventName)
				.on(eventName, options.events[eventName]);
			}
		}
	}
	
	dom.changeTooltipText = function($el, tooltipStr) {
		$el
		.tooltip('hide')
	    .attr('data-original-title', tooltipStr);
	}
	
	dom.showServiceReady = function(msg) {
		hotplace.processAjaxError(hotplace.error.SERVICE_READY, msg);
	}
	
	/*************************************************************
	 * 브라우저창 사이즈가 변할때 발생하는 이벤트 핸들러
	 * hotplace.streetview.resize : 거리뷰의 파노라마 사이즈를 변경함
	 ************************************************************/
	$(window).resize(function() {
		if ($('.modal.in').length != 0) {
			_initModalSize($('.modal.in'));
		}
		
		hotplace.menu.redrawMyGwansim();
		hotplace.streetview.resize();
	});
	
	$(window).contextmenu(function(e) {
		return false;
	});
	
	var _timer;
	
	dom.timerStart = function(start, $container) {
		var _start = start || 60; 
		_timer = setTimeout(function() {
			_start--;
			$container.html(_start + '초');
			if(_start <= 0) {
				clearTimeout(_timer);
			}
			else {
				dom.timerStart(_start, $container);
			}
			
		}, 1000);
	}
	
	dom.timerStop = function() {
		if(_timer) {
			clearTimeout(_timer);
			_timer = null;
		}
	}
	
}(
	hotplace.dom = hotplace.dom || {},
	jQuery
));