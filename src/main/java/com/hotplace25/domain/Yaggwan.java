package com.hotplace25.domain;

import org.apache.ibatis.type.Alias;

@Alias("Yaggwan")
public class Yaggwan {

	private String categoryName;
	private String content;
	private String required;
	
	public String getRequired() {
		return required;
	}
	public void setRequired(String required) {
		this.required = required;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
