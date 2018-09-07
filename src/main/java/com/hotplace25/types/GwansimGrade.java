package com.hotplace25.types;

import java.util.EnumSet;

public enum GwansimGrade {
	S("1"), A("2"), B("3"), C("4"), D("5"), F("6"), DEFAULT("7");
	
	private String type;
	
	GwansimGrade(String type) {
		this.type = type;
	}
	
	public String getValue() {
		return type;
	}
	
	public static GwansimGrade getType(String type) {
		for(GwansimGrade t : EnumSet.allOf(GwansimGrade.class)) {
			if(type.equals(t.getValue())) return t;
		}
		
		throw new IllegalArgumentException(type + "값은 유효하지 않습니다.");
	}
}
