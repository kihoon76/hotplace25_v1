package com.hotplace25.domain;

import org.apache.ibatis.type.Alias;

@Alias("BosangPyeonib")
public class BosangPyeonib {

	private String pnu;							//PNU 코드
	private String goyubeonho;					//고유번호 
	private String mulgeonsojaeji;				//물건소재지
	private String gonggogigwan;				//공고기관
	private String gonggoil;					//공고일
	private String saeobname;					//사업명
	private String gonggobeonho;				//공고번호
	private String saeobsihaengja;				//사업시행자
	private String siseolkind;					//시설종류
	private float lat;							//위도
	private float lng;							//경도
	
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getGoyubeonho() {
		return goyubeonho;
	}
	public void setGoyubeonho(String goyubeonho) {
		this.goyubeonho = goyubeonho;
	}
	public String getMulgeonsojaeji() {
		return mulgeonsojaeji;
	}
	public void setMulgeonsojaeji(String mulgeonsojaeji) {
		this.mulgeonsojaeji = mulgeonsojaeji;
	}
	public String getGonggogigwan() {
		return gonggogigwan;
	}
	public void setGonggogigwan(String gonggogigwan) {
		this.gonggogigwan = gonggogigwan;
	}
	public String getGonggoil() {
		return gonggoil;
	}
	public void setGonggoil(String gonggoil) {
		this.gonggoil = gonggoil;
	}
	public String getSaeobname() {
		return saeobname;
	}
	public void setSaeobname(String saeobname) {
		this.saeobname = saeobname;
	}
	public String getGonggobeonho() {
		return gonggobeonho;
	}
	public void setGonggobeonho(String gonggobeonho) {
		this.gonggobeonho = gonggobeonho;
	}
	public String getSaeobsihaengja() {
		return saeobsihaengja;
	}
	public void setSaeobsihaengja(String saeobsihaengja) {
		this.saeobsihaengja = saeobsihaengja;
	}
	public String getSiseolkind() {
		return siseolkind;
	}
	public void setSiseolkind(String siseolkind) {
		this.siseolkind = siseolkind;
	}
	public float getLat() {
		return lat;
	}
	public void setLat(float lat) {
		this.lat = lat;
	}
	public float getLng() {
		return lng;
	}
	public void setLng(float lng) {
		this.lng = lng;
	}
}
