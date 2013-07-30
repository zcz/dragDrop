package com.xgate.mock.model;

public abstract class Action {

	int extid;
	String content;
	private String baseUrl = "./";	

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
	
	public String getEmailString() {
		String s = "<div><d>content: </d>"+this.getContent()+"</div>";
		String links = "";
		String[] events = getPossibleEvents();
		for( String ee : events ) {
			links += "<a href=\""+baseUrl+ee+"\">"+ee+"</a><br>";
		}
		s = s + "<div>" + links + "</div>";
		return s;
	}

	abstract public String[] getPossibleEvents();

	abstract public String getTitle();
}
