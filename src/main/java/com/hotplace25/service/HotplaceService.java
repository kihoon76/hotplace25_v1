package com.hotplace25.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import com.hotplace25.dao.HotplaceDao;
import com.hotplace25.domain.AcceptBuilding;
import com.hotplace25.domain.Address;
import com.hotplace25.domain.BosangPyeonib;
import com.hotplace25.domain.Gongmae;
import com.hotplace25.domain.GongmaeDetail;
import com.hotplace25.domain.GongmaeImage;
import com.hotplace25.domain.Gyeongmae;
import com.hotplace25.domain.GyeongmaeImage;
import com.hotplace25.domain.QnA;
import com.hotplace25.domain.Silgeolae;
import com.hotplace25.domain.Yaggwan;
import com.hotplace25.util.DataUtil;

@Service("hotplaceService")
public class HotplaceService {

	@Resource(name="hotplaceDao")
	HotplaceDao hotplaceDao;
	
	public String getGuGunList(String si) {
		List<String> list = hotplaceDao.selectListGuGun(si);
		return DataUtil.makeAddress(list);
	}

	public String getRegionNameList(Address addr) {
		List<String> list = hotplaceDao.selectListRegionName(addr);
		return DataUtil.makeAddress(list);
	}

	public String getAddressList(Address address) {
		List<String> list = hotplaceDao.selectListAddress(address);
		return DataUtil.makeAddress(list);
	}

	public String getLocationBounds(Map<String, String> param) {
		List<String> list = hotplaceDao.selectListLocationBounds(param);
		return DataUtil.makeLatLngWeight(list, "|");
	}

	public String getGyeongmaeMarker(Map<String, String> param) {
		List<String> list = hotplaceDao.selectGyeongmaeMarker(param);
		return DataUtil.makeLatLngGyeongmaeMarker(list, "|$");
	}
	
	public Gyeongmae getGyeongmaeThumb(String unu) {
		Gyeongmae g = hotplaceDao.selectGyeongmaeThumb(unu);
		String sImg = g.getImgThumb();
		if(sImg != null) {
			//이미지를 base64로 치환
			byte[] bImg = DataUtil.hexStringToByteArray(sImg); 
			String b64 = Base64Utils.encodeToString(bImg);
			g.setImgThumb("data:image/" + g.getImgThumbExt() + ";base64," + b64);
		}
		
		return g;
	}

	public Gyeongmae getGyeongmaeDetail(String goyubeonho, String deunglogbeonho) {
		Map<String, String> param = new HashMap<String, String>();
		param.put("goyubeonho", goyubeonho);
		param.put("deunglogbeonho", deunglogbeonho);
		
		Gyeongmae g = hotplaceDao.selectGyeongmaeDetail(param);
		
		if(g.getImages() != null && g.getImages().size() > 0) {
			for(GyeongmaeImage gImg : g.getImages()) {
				String sImg = gImg.getImage();
				byte[] bImg = DataUtil.hexStringToByteArray(sImg); 
				String b64 = Base64Utils.encodeToString(bImg);
				gImg.setImage("data:image/" + gImg.getExt() + ";base64," + b64);
			}
		}
		
		return g;
	}

	public String getGongmaeMarker(Map<String, String> param) {
		List<String> list = hotplaceDao.selectGongmaeMarker(param);
		return DataUtil.makeLatLngGongmaeMarker(list, "|$");
	}

	public String getMulgeonAddressList(Address address) {
		List<String> list = hotplaceDao.selectListMulgeonAddress(address);
		return DataUtil.makeAddress(list);
	}

	public Gongmae getGongmaeThumb(String unu) {
		Gongmae g = hotplaceDao.selectGongmaeThumb(unu);
		
		return g;
	}

	public String getBosangPyeonibMarker(Map<String, String> param) {
		List<String> list = hotplaceDao.selectBosangMarker(param);
		if("Y".equals(param.get("stopGrouping"))) {
			return DataUtil.makeLatLngBosangPyeonibMarkerNoGroup(list, "|");
		}
		
		return DataUtil.makeLatLngBosangPyeonibMarker(list, "|");
	}

	public BosangPyeonib getBosangPyeonibThumb(String unu) {
		BosangPyeonib bp = hotplaceDao.selectBosangPyeonibThumb(unu);
		return bp;
	}

	public String getSilgeolaeMarker(Map<String, String> param) {
		List<String> list = hotplaceDao.selectSilgeolaeMarker(param);
		return DataUtil.makeLatLngSilgeolaeMarker(list, "|$");
	}

	public Silgeolae getSilgeolaeThumb(String pnu) {
		Silgeolae sil = hotplaceDao.selectSilgeolaeThumb(pnu);
		return sil;
	}

	public String getAcceptBuildingMarker(Map<String, String> param) {
		List<String> list = hotplaceDao.selectAcceptBuildingMarker(param);
		return DataUtil.makeLatLngAcceptBuildingMarker(list, "|$");
	}

	public AcceptBuilding getAcceptbuildingThumb(String unu) {
		AcceptBuilding ab = hotplaceDao.selectAcceptbuildingThumb(unu);
		return ab;
	}

	public String getBosangPyeonibGroupList(String gunu) {
		String[] gunus = gunu.split(",");
		HashMap m = new HashMap();
		m.put("gunus", gunus);
		
		List<String> list = hotplaceDao.selectBosangPyeonibGroupList(m);
		return DataUtil.makeLatLngBosangPyeonibGroupList(list, "`");
	}
	
	public List<Yaggwan> getYaggwanList() {
		return hotplaceDao.selectYaggwanList();
	}

	public GongmaeDetail getGongmaeDetail(String goyubeonho) {
		GongmaeDetail g = hotplaceDao.selectGongmaeDetail(goyubeonho);
		
		if(g.getImages() != null && g.getImages().size() > 0) {
			for(GongmaeImage gImg : g.getImages()) {
				String sImg = gImg.getImage();
				byte[] bImg = DataUtil.hexStringToByteArray(sImg); 
				String b64 = Base64Utils.encodeToString(bImg);
				gImg.setImage("data:image/" + gImg.getExt() + ";base64," + b64);
			}
		}
		
		return g;
	}
	
	public String getCurrentYear() {
		return hotplaceDao.selectCurrentYear();
	}
	
	public String getCurrentDate() {
		return hotplaceDao.selectCurrentDate();
	}

	public void registQuestion(QnA qna) {
		hotplaceDao.insertQuestion(qna);
		
	}
}
