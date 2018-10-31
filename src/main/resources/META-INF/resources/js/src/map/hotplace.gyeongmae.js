/**
 * @namespace hotplace.gyeongmae
 */
(function(gyeongmae, $) {
	var _btnGyeongmaeDetail = '#btnGyeongmaeDetail',
		_btnGyeongmaeThumbClose = '#btnGyeongmaeThumbClose',
		_btnGyeongmaePano = '#btnGyeongmaePano',
		_dvGyeongmaeInfoWin = '#dvGyeongmaeInfoWin',
		_enlargeImageModalTitle = '#enlargeImageModalTitle',
		_address = null,
		_gDimages = '#gDimages';
	
	//인근진행물건
	function _makeGyeongmaeJinhaengmulgeons(jinhaengmulgeons) {
		var cnt = jinhaengmulgeons.length;
		var html = [];
		
		if(cnt >= 1) {
			html = [];
			
	    	var num, yongdo, maegaggiil, damdang;
			for(var i=0; i<cnt; i++) {
				num = jinhaengmulgeons[i].numyongdo.match(/\s*^[0-9]+/g);
				yongdo = jinhaengmulgeons[i].numyongdo.match(/[^0-9]+\d*/g);
				maegaggiil = jinhaengmulgeons[i].damdangmaegaggiil.match(/\s*[0-9]+\.\d*\.\d+/g);
				damdang = jinhaengmulgeons[i].damdangmaegaggiil.match(/\s*[^0-9\.]+\d*\W*/g);
				
				html.push('<tr>');
				html.push('<td>' + jinhaengmulgeons[i].sageonbeonho + '</td>');
				html.push('<td>' + num + '<br/>' + yongdo + '</td>');
				html.push('<td>' + jinhaengmulgeons[i].sojaejinaeyeog + '</td>');
				html.push('<td>' + jinhaengmulgeons[i].bigo + '</td>');
				html.push('<td>' + jinhaengmulgeons[i].gamjeongpyeongga.money() + '원<br/>' + jinhaengmulgeons[i].minmaegaggagyeog.money() + '원</td>');
				html.push('<td>' + damdang + '<br/>' + maegaggiil + '</td>');
				html.push('<td>' + jinhaengmulgeons[i].status + '</td>');
				html.push('</tr>');
			}
			
			html = html.join('');
		}
		else {
			html = '<tr><td colspan="7">정보가 존재하지 않습니다.</td></tr>';
		}
		
		$('#gDjinhaengmulgeon').html(html);
	}
	
	//인근매각물건
	function _makeGyeongmaeMaegagmulgeons(maegagmulgeons) {
		var cnt = maegagmulgeons.length;
		var html = null;
		
		if(cnt >= 1) {
			
			//검색 결과가 없을경우 사건번호에 '검색결과가 없습니다.' 로 표시되는 경우가 발생
			//예외처리
			if(cnt == 1 && (maegagmulgeons[0].sageonbeonho == '검색결과가 없습니다.' || maegagmulgeons[0].soonbeon == '')) {
				html = '<tr><td colspan="6">정보가 존재하지 않습니다.</td></tr>';
			}
			else {
				html = [];
				
				for(var i=0; i<cnt; i++) {
					html.push('<tr>');
					html.push('<td>' + maegagmulgeons[i].sageonbeonho + '</td>');
					html.push('<td>' + maegagmulgeons[i].yongdo + '</td>');
					html.push('<td>' + maegagmulgeons[i].sojaeji + '</td>');
					html.push('<td>' + maegagmulgeons[i].gamjeongpyeongga.money() + ' 원</td>');
					html.push('<td>' + maegagmulgeons[i].maegagmonth + '</td>');
					html.push('<td>' + maegagmulgeons[i].maegagdaegeum.money() + ' 원</td>');
					html.push('</tr>');
				}
				
				html = html.join('');
			}
		}
		else {
			html = '<tr><td colspan="6">정보가 존재하지 않습니다.</td></tr>';
		}
		
		$('#gDmaegagmulgeon').html(html);
	}
	
	//인근매각통계
	function _makeGyeongmaeTonggyes(tonggyes) {
		var cnt = tonggyes.length;
		var html = null;
		
		if(cnt >= 1) {
			html = [];
			for(var i=0; i<cnt; i++) {
				html.push('<tr>');
				html.push('<td>' + tonggyes[i].gigan + '</td>');
				html.push('<td>' + tonggyes[i].maegaggeonsu + ' 건</td>');
				html.push('<td>' + tonggyes[i].avggamjeongga.money() + ' 원</td>');
				html.push('<td>' + tonggyes[i].avgmaegagga.money() + ' 원</td>');
				html.push('<td>' + tonggyes[i].maegaggaratio + ' %</td>');
				html.push('<td>' + tonggyes[i].avgyuchal + ' 회</td>');
				html.push('</tr>');
			}
			
			html = html.join('');
		}
		else {
			html = '<tr><td colspan="6">정보가 존재하지 않습니다.</td></tr>';
		}
		
		$('#gDmaegagTonggyes').html(html);
	}
	
	
	//목록내역
	function _makeGyeongmaeLists(lists) {
		var cnt = lists.length;
		var html = null;
		if(cnt >= 1) {
			html = [];
			for(var i=0; i<cnt; i++) {
				html.push('<tr>');
				html.push('<td>' + lists[i].listnum + '</td>');
				html.push('<td>' + lists[i].listgubun + '</td>');
				html.push('<td>' + lists[i].detailhistory + '</td>');
				html.push('</tr>');
			}
			
			html = html.join('');
		}
		else {
			html = '<tr><td colspan="3">목록내역이 없습니다.</td></tr>';
		}
		
		$('#gDlisthistory').html(html);
	}
	
	//기일내역
	function _makeGyeongmaeGiils(giils) {
		var cnt = giils.length;
		var html = null;
		if(cnt >= 1) {
			html = [];
			for(var i=0; i<cnt; i++) {
				html.push('<tr>');
				html.push('<td>' + giils[i].giil + '</td>');
				html.push('<td>' + giils[i].giiljonglyu + '</td>');
				html.push('<td>' + giils[i].giiljangso + '</td>');
				html.push('<td>' + ((giils[i].minmaegaggagyeog != undefined) ? giils[i].minmaegaggagyeog.money() : '') + '</td>');
				html.push('<td>' + giils[i].giilresult + '</td>');
				html.push('</tr>');
			}
			
			html = html.join('');
		}
		else {
			html = '<tr><td colspan="6">기일내역이 없습니다.</td></tr>';
		}
		
		$('#gDgiilhistory').html(html);
	}
	
	
	function _bindImageClick() {
		$(_gDimages + ' li > a')
		.off('click')
		.on('click', function() {
			var $img = $(this).children();
			var imgSrc = $img.prop('src');
			var title = $img.data('gubun');
			
			hotplace.dom.showGyeongmaeImage({width:700}, {src:imgSrc, title:title});
		});
	}
	
	function _bindGeoClickHandler(x, y) {
		$(_btnGyeongmaePano)
		.off('click')
		.on('click', function() {
			hotplace.dom.showMulgeonPanoramaForm(null, null, {x:x, y:y, address:_address});
		});
	}
	
	function _makeGyeongmaeBosangPyeonib(bosangPyeonib) {
		var $gBosangPyeonib = $('#gDBosangPyeonib');
		
		var html = [];
		html.push('<tr>');
		html.push('<td>' + bosangPyeonib.mulgeonsojaeji + '</td>');
		html.push('<td>' + bosangPyeonib.gonggogigwan + '</td>');
		html.push('<td>' + bosangPyeonib.gonggoil + '</td>');
		html.push('<td>' + bosangPyeonib.saeobname + '</td>');
		html.push('<td>' + bosangPyeonib.gonggobeonho + '</td>');
		html.push('<td>' + bosangPyeonib.siseolkind + '</td>');
		html.push('<td>' + bosangPyeonib.saeobsihaengja + '</td>');
		html.push('</tr>');
		$gBosangPyeonib.html(html.join(''));
	}
	function _makeGyeongmaeImages(images) {
		var $gDimages = $(_gDimages);
		var cnt = images.length;
		var currentRow = 0;
		var html = [];
		var gwanlyeonsajin = 0;
		var jeongyeongdo = 0;
		var wichido = 0;
		var jijeogdo = 0;
		var naebugujo = 0;
		var etc = 0;
		
		if(cnt >= 1) {
			html.push('<ul>');
			for(var i=0; i<cnt; i++) {
				//사진구분
				switch(images[i].gubun) {
				case '관련사진':
					gwanlyeonsajin++;
					break;
				case '전경도':
					jeongyeongdo++;
					break;
				case '지적도':
					jijeogdo++;
					break;
				case '위치도':
					wichido++;
					break;
				case '내부구조도':
					naebugujo++;
					break;
				default : 
					etc++;
					break;
				}
				
				html.push('<li><a href="#"><img src="' + images[i].image + '" data-gubun="' + images[i].gubun + '"></a></li>');
			}
			
			html.push('</ul>');
			
			$('#gDjeongyeongdo').text(jeongyeongdo);
			$('#gDjijeogdo').text(jijeogdo);
			$('#gDwichido').text(wichido);
			$('#gDgwanlyeonsajin').text(gwanlyeonsajin);
			$('#gDnaebugujo').text(naebugujo);
			$('#gDetc').text(etc);
			
			$gDimages.html(html.join(''));
			_initImageSlider();
			_bindImageClick();
		}
	}
	
	function _initImageSlider() {
		var $touchSlider = $(_gDimages);
		$touchSlider.touchSlider({
			autoplay : {
				enable : true,
				pauseHover : true,
				interval : 3500
			},	
			view : 4,
			btn_prev : $touchSlider.next().find('.btn_prev'),
			btn_next : $touchSlider.next().find('.btn_next'),
		});
	}
	
	function _bindDetailClickHandler(win) {
		
		//경매 물건상세보기 handler
		$(btnGyeongmaeDetail)
		.off('click')
		.on('click', function() {
			var $this = $(this);
			var bosangPyeonib = $this.data('bosangPyeonib');
			var param = {
				goyubeonho: $this.data('goyubeonho'),
				pnu: $this.data('pnu'),
				deunglogbeonho: $this.data('deunglogbeonho'),
				bosangPyeonib: bosangPyeonib
			}
			
			var hasForm = hotplace.dom.showGyeongmaeDetail(null, {path: hotplace.getContextUrl() + 'resources/', bosangPyeonib: bosangPyeonib});
			
			if(hasForm) {
				hotplace.ajax({
					url: 'gyeongmae/detail',
					method: 'GET',
					dataType: 'json',
					data: param,
					loadEl: hotplace.dom.getModalPopId(),
					success: function(data, textStatus, jqXHR) {
						console.log(data)
						if(data.success === false && data.errCode) {
							jqXHR.errCode = data.errCode;
						}
						else {
							$('#gDsageonbeonho').text(data.sageonbeonho);
							$('#gDdamdang').text(data.damdang);
							$('#gDsageonjeobsuil').text(data.sageonjeobsuil);
							$('#gDsojaeji').text(data.sojaeji);
							$('#gDyongdo').text(data.yongdo);
							$('#gDibchalbangbeob').text(data.ibchalbangbeob);
							$('#gDgamjeongpyeongga').text((data.gamjeongpyeongga) ? data.gamjeongpyeongga.money() + ' 원' : '');
							$('#gDminmaegaggagyeog').text((data.minmaegaggagyeog) ? data.minmaegaggagyeog.money() + ' 원' : '');
							$('#gDyuchal').text(data.yuchal);
							$('#gDbaedangyogu').text(data.baedangyogu);
							$('#gDcheonggu').text((data.cheonggu) ? data.cheonggu.money() + ' 원': '');
							$('#gDmaegaggiil').text(data.maegaggiil);
							$('#gDbigo').text(data.bigo);
							
							if(bosangPyeonib != 'N,N' && data.bosangPyeonib) {
								_makeGyeongmaeBosangPyeonib(data.bosangPyeonib);
							}
							
							_makeGyeongmaeImages(data.images);
							_makeGyeongmaeGiils(data.giils);
							_makeGyeongmaeLists(data.lists);
							_makeGyeongmaeTonggyes(data.tonggyes);
							_makeGyeongmaeMaegagmulgeons(data.maegagmulgeons);
							_makeGyeongmaeJinhaengmulgeons(data.jinhaengmulgeons);
						}
					},
					error:function() {
						
					}
				});
			}
//			else {
//				hotplace.dom.showAlertMsg(null, '경매상세정보를 보실수 있는 권한이 없습니다.', {width:'40%'});
//			}
		});
	}
	
	function _getThumb(data, cbSucc) {
		hotplace.ajax({
			url: 'gyeongmae/thumb',
			method: 'GET',
			dataType: 'json',
			data: {unu: data.info.unu},
			//loadEl: _dvGyeongmaeInfoWin,
			success: function(d, textStatus, jqXHR) {
				//hotplace.dom.createChart('canvas');
				console.log(d);
				if(d.success === false && d.errCode) {
					jqXHR.errCode = d.errCode;
				}
				else {
					d.lng = (data.location) ? data.location[0] : '';
					d.lat = (data.location) ? data.location[1] : '';
					d.unu = data.info.unu;
					cbSucc(d);
				}
			},
			error:function() {
				
			}
		});
	}
	
	
	/** 
	 * @memberof hotplace.gyeongmae 
	 * @function markerClick 
	 * @param {object} map 맵
	 * @param {object} marker 마커
	 * @param {object} win InfoWindow
	 * @param {string} bosangPyeonib 경공매 검색에서 호출한 경우 보상편입값 (Y,N)|(N,Y)|(N,N)
	 */
	gyeongmae.markerClick = function(map, marker, win, bosangPyeonib) {
		var data = marker._data;
		
		if(!bosangPyeonib) bosangPyeonib = 'N,N';
		
		console.log(data);
		var tForm = hotplace.dom.getTemplate('gyeongmaeForm');
		
		if(!tForm) {
			hotplace.dom.showLoginMsg();
		}
		else if(tForm == hotplace.error.DUP_LOGIN) {
			return;
		}
		else {
			_getThumb(data, function(d) {
				_address = d.sojaeji || '';
				win.open(map, marker);
				win.setOptions('content', tForm($.extend(
					{path: hotplace.getContextUrl() + 'resources/'},
					d,
					{
						yongdo:(d.yongdo || '').replace(/\|/gm, ','),
						gamjeongpyeongga:(d.gamjeongpyeongga || '').money(),
						
					})
				));
				
				if(d.imgThumb) {
					$('#gImgThumb').prop('src', d.imgThumb);
				}
				
				$(_btnGyeongmaeDetail)
				.data('goyubeonho', d.goyubeonho)
				.data('pnu', d.pnu)
				.data('bosangPyeonib', bosangPyeonib)
				.data('deunglogbeonho', d.deunglogbeonho);
				
				$(_btnGyeongmaeThumbClose)
				.off('click')
				.on('click', function() {
					win.close();
				});
				
				_bindDetailClickHandler(win);
				_bindGeoClickHandler(data.location[1], data.location[0]);
			});
		}
	}
}(
	hotplace.gyeongmae = hotplace.gyeongmae || {},
	jQuery
));