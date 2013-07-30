package com.xgate.mock.model;

public class Email extends Action {

	private String[] events = {"email_opened", "email_clicked"};
	
	@Override
	public String getTitle() {
		return "email";
	}

	@Override
	public String[] getPossibleEvents() {
		return events;
	}
}
