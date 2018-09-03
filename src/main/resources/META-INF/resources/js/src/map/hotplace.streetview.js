/**
 * @namespace hotplace.streetview
 * */
(function(streetview, $) {
	var _streetMarker = null;
	var _fixedMarker = false;
	var _isStarted = false;
	var _streetviewMinimapAreaId = 'dvStreetMini';
	var _streetviewPanoramaAreaId = 'dvStreet';
	var _streetviewContainerAreaId = 'dvStreetView';
	var _$dvStreetViewPanorama = $('#' + _streetviewPanoramaAreaId);
	var _$dvStreetViewContainer = $('#' + _streetviewContainerAreaId);
	var _$dvStreetViewMinimap = $('#' + _streetviewMinimapAreaId);
	
	$('.pano-close').on('click', function(e) {
		_$dvStreetViewContainer.hide();
		_$dvStreetViewMinimap.hide();
		hotplace.panomaps.clear();
		hotplace.minimaps.panoClear();
		hotplace.maps.getMap().setOptions('scaleControl', true);
		
		//clear 시키지않으면 타임뷰에서 캡쳐시 오류발생
		_$dvStreetViewPanorama.html('');
		_$dvStreetViewMinimap.html('');
	});
	
	function _createMarker(map, coord) {
		_streetMarker = new naver.maps.Marker({
			position: new naver.maps.LatLng(coord.y, coord.x),
			icon: {
				url: hotplace.getContextUrl() + 'resources/img/marker/marker_search.png', //50, 68 크기의 원본 이미지
				size: new naver.maps.Size(25, 34),
				scaledSize: new naver.maps.Size(25, 34),
				origin: new naver.maps.Point(0, 0),
				anchor: new naver.maps.Point(12, 34)
			},
			map: map ,
			clickable: false
		});
	}
	
	function _destroyMarker() {
		if(_streetMarker) {
			_streetMarker.setMap(null);
			_streetMarker = null;
		}
	}
	
	streetview.start = function(map, coord) {
		if(!_isStarted) {
			_isStarted = true;
			_fixedMarker = false;
			_createMarker(map, coord);
		}
		
		hotplace.dom.adjustMapZindex('10');
	
	}
	
	streetview.moveMarker = function(coord) {
		if(_streetMarker && !_fixedMarker) _streetMarker.setPosition(coord);
	}
	
	streetview.stop = function() {
		_isStarted = false;
		_destroyMarker();
		hotplace.dom.adjustMapZindex();
	}
	
	streetview.fixedMarker = function() {
		_fixedMarker = true;
	}
	
	streetview.startPanorama = function(map, coord) {
		map.setOptions('scaleControl', false);
		_$dvStreetViewContainer.css({width:($(window).width()) + 'px'});
		_$dvStreetViewContainer.show();
		_$dvStreetViewMinimap.show();
		
		hotplace.panomaps.createPanomaps(hotplace.panomaps.STREET_MODE, _streetviewPanoramaAreaId, coord.y, coord.x, false, null, function(pano) {
			console.log(pano.getPosition())
			hotplace.minimaps.setPanoMarkerPosition(pano.getPosition());
		});
		
		hotplace.minimaps.create(map, _streetviewMinimapAreaId, coord, function(coord) {
			hotplace.panomaps.setPosition(coord);
		});
	}
	
	streetview.resize = function() {
		hotplace.panomaps.resize(_$dvStreetViewContainer);
	}
}(
	hotplace.streetview = hotplace.streetview || {},
	jQuery
));