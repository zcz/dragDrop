package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;

import com.xgate.mock.model.ContactList;

@Controller
public class DataSourseController {
	ArrayList<ContactList> metaList = new ArrayList<ContactList>();

	public ContactList addContact(int id, String name, String email, String mobile) {
		this.metaList.get(id).addContact(name, email, mobile);
		return this.metaList.get(id);
	}
	
	public ContactList getContactList( int id ) {
		if (id < 0) return null;
		return this.metaList.get(id);
	}

	public int newList() {
		ContactList cl = new ContactList();
		this.metaList.add(cl);
		int id = this.metaList.indexOf(cl);
		cl.setExtid(id);
		return id;
	}
	
}
