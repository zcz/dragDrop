package com.xgate.mock;

import org.junit.Test;

import com.xgate.mock.model.Contact;
import com.xgate.mock.model.Email;

public class ActionControllerTest {

	ActionController actionController = new ActionController();
	
	@Test
	public void test() {
		Email email = new Email();
		email.setContent("haha, this is content");
		email.setExtid(102);
		Contact contact = new Contact();
		contact.setEmail("china.zhangchenzi@gmail.com");
		contact.setName("zcz");
		actionController.doSth(email, contact);
	}
}
