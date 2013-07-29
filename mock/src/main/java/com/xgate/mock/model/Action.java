package com.xgate.mock.model;

public abstract class Action {
	
	int extid;
	String content;
	
	public int getExtid() {
		return extid;
	}
	public void setExtid(int extid) {
		this.extid = extid;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
}
