package com.xgate.mock.model;

public class Sms extends Action {

	private String[] events = {"sms_received"};
	
	@Override
	public String getTitle() {
		return "sms";
	}
	
	@Override
	public String[] getPossibleEvents() {
		return events;
	}
}
