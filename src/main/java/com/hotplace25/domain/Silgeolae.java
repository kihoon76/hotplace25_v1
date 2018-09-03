package com.hotplace25.domain;

import org.apache.ibatis.type.Alias;

@Alias("Silgeolae")
public class Silgeolae {

	private String pnu;				//pnu코드
	private String gyeyagnyeonwol;	//계약년월
	private String gyeyagil;		//계약일
	private String gyeyagarea;		//계약면적
	private String geolaegeumaeg;	//거래금액
	private String yongdo;			//용도
	private String jimok;			//지목
	private String buildingyear;	//건축년도
	private String cheung;			//층
	private String danji;			//단지
	private String dorojogeon;		//도로조건
	private String doroname;		//도로명
	private String jeonyongarea;	//전용면적
	private String jibeon;			//지번
	
	
	public String getPnu() {
		return pnu;
	}
	public void setPnu(String pnu) {
		this.pnu = pnu;
	}
	public String getGyeyagnyeonwol() {
		return gyeyagnyeonwol;
	}
	public void setGyeyagnyeonwol(String gyeyagnyeonwol) {
		this.gyeyagnyeonwol = gyeyagnyeonwol;
	}
	public String getGyeyagil() {
		return gyeyagil;
	}
	public void setGyeyagil(String gyeyagil) {
		this.gyeyagil = gyeyagil;
	}
	public String getGyeyagarea() {
		return gyeyagarea;
	}
	public void setGyeyagarea(String gyeyagarea) {
		this.gyeyagarea = gyeyagarea;
	}
	public String getGeolaegeumaeg() {
		return geolaegeumaeg;
	}
	public void setGeolaegeumaeg(String geolaegeumaeg) {
		this.geolaegeumaeg = geolaegeumaeg;
	}
	public String getYongdo() {
		return yongdo;
	}
	public void setYongdo(String yongdo) {
		this.yongdo = yongdo;
	}
	public String getJimok() {
		return jimok;
	}
	public void setJimok(String jimok) {
		this.jimok = jimok;
	}
	public String getBuildingyear() {
		return buildingyear;
	}
	public void setBuildingyear(String buildingyear) {
		this.buildingyear = buildingyear;
	}
	public String getCheung() {
		return cheung;
	}
	public void setCheung(String cheung) {
		this.cheung = cheung;
	}
	public String getDanji() {
		return danji;
	}
	public void setDanji(String danji) {
		this.danji = danji;
	}
	public String getDorojogeon() {
		return dorojogeon;
	}
	public void setDorojogeon(String dorojogeon) {
		this.dorojogeon = dorojogeon;
	}
	public String getDoroname() {
		return doroname;
	}
	public void setDoroname(String doroname) {
		this.doroname = doroname;
	}
	public String getJeonyongarea() {
		return jeonyongarea;
	}
	public void setJeonyongarea(String jeonyongarea) {
		this.jeonyongarea = jeonyongarea;
	}
	public String getJibeon() {
		return jibeon;
	}
	public void setJibeon(String jibeon) {
		this.jibeon = jibeon;
	}
	
	
}
