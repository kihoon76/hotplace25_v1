package com.hotplace25.domain;

import org.apache.ibatis.type.Alias;

@Alias("SystemUpdate")
public class SystemUpdate {

	private String idx;
	private String version;
	private String content;
	private String tempNum;
	
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getTempNum() {
		return tempNum;
	}
	public void setTempNum(String tempNum) {
		this.tempNum = tempNum;
	}
	public String getIdx() {
		return idx;
	}
	public void setIdx(String idx) {
		this.idx = idx;
	}
}
