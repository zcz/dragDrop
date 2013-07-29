package com.xgate.mock.model;

public class Filter {
	
	int extid;
	String attribute;
	String regex;
	
	public int getExtid() {
		return extid;
	}
	public void setExtid(int extid) {
		this.extid = extid;
	}
	public String getAttribute() {
		return attribute;
	}
	public void setAttribute(String attribute) {
		this.attribute = attribute;
	}
	public String getRegex() {
		return regex;
	}
	public void setRegex(String regex) {
		this.regex = regex;
	}
}
