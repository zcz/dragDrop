package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;

import com.xgate.mock.model.Contact;
import com.xgate.mock.model.ContactList;

@Controller
public class DataSourseController {
	ArrayList<ContactList> metaList = new ArrayList<ContactList>();
	ArrayList<Contact> allContacts = new ArrayList<Contact>();

	public ContactList addContact(int id, String name, String email, String mobile) {
		Contact c = this.metaList.get(id).addContact(name, email, mobile);
		this.allContacts.add(c);
		int contactId = this.allContacts.indexOf(c);
		c.setId(contactId);
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

	public Contact getContact(int contactId) {
		return this.allContacts.get(contactId);
	}
	
}
