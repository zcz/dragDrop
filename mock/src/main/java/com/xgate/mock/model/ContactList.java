package com.xgate.mock.model;

import java.util.ArrayList;

public class ContactList {
	
	public int extid;
	ArrayList<Contact> contactList = new ArrayList<Contact>();
		
	public ArrayList<Contact> getContactList() {
		return contactList;
	}
	public int getExtid() {
		return extid;
	}
	public void setExtid(int extid) {
		this.extid = extid;
	}

	public Contact addContact( String name, String email, String mobile ) {
		Contact c = new Contact();
		c.setName(name);
		c.setEmail(email);
		c.setMobile(mobile);
		this.contactList.add(c);
		return c;
	}

}
