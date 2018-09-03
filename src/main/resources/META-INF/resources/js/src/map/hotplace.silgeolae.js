/**
 * @namespace hotplace.silgeolae
 */
(function(silgeolae, $) {
	var _dvSilgeolaeInfoWin = '#dvSilgeolaeInfoWin',
		_btnSilgeolaePano = '#btnSilgeolaePano',
		_btnSilgeolaeThumbClose = '#btnSilgeolaeThumbClose',
		_address = null;;
	
	
	function _getThumb(pnu, cbSucc) {
		if(pnu) {
			hotplace.ajax({
				url: 'silgeolae/thumb',
				method: 'GET',
				dataType: 'json',
				data: {pnu: pnu},
				loadEl: _dvSilgeolaeInfoWin,
				success: function(data, textStatus, jqXHR) {
					//hotplace.dom.createChart('canvas');
					console.log(data);
					if(data.success === false && data.errCode) {
						jqXHR.errCode = data.errCode;
					}
					else {
						cbSucc(data.datas[0]);
					}
				},
				error:function() {
					
				}
			});
		}
		else {
			cbSucc();
		}
		
	}
	/** 
	 * @memberof hotplace.silgeolae 
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 */
	silgeolae.markerClick = function(map, marker, win, pnu) {
		var data = marker._data;
		console.log(data);
		var tForm = hotplace.dom.getTemplate('silgeolaeForm');
		
		if(!tForm) {
			hotplace.dom.showLoginMsg();
		}
		else if(tForm == hotplace.error.DUP_LOGIN) {
			return;
		}
		else {
			_getThumb(pnu, function(d) {
				win.open(map, marker);
				if(data.info) {
					data.info.lng = data.location[0];
					data.info.lat = data.location[1];
				}
				
				//내 관심물건 보기에서 접근
				if(pnu) {
					win.setOptions('content', tForm(d));
				}
				else {
					win.setOptions('content', tForm(data.info || {}));
				}
				
				
				$(_btnSilgeolaeThumbClose)
				.off('click')
				.on('click', function() {
					win.close();
				});
				
				_bindGeoClickHandler(data.location[1], data.location[0]);
			});
		}
	}
	
	function _bindGeoClickHandler(x, y) {
		$(_btnSilgeolaePano)
		.off('click')
		.on('click', function() {
			hotplace.dom.showMulgeonPanoramaForm(null, null, {x:x, y:y, address:_address});
		});
	}
}(
	hotplace.silgeolae = hotplace.silgeolae || {},
	jQuery
));