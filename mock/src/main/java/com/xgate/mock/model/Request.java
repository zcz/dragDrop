package com.xgate.mock.model;

public class Request {
	
	int contactId;
	int extId;
	String type;
	boolean outcome = true;

	public int getContactId() {
		return contactId;
	}
	public void setContactId(int contactId) {
		this.contactId = contactId;
	}
	public int getExtId() {
		return extId;
	}
	public void setExtId(int extId) {
		this.extId = extId;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isOutcome() {
		return outcome;
	}
	public void setOutcome(boolean outcome) {
		this.outcome = outcome;
	}

}
