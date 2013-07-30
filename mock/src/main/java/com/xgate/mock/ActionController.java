package com.xgate.mock;

import java.util.ArrayList;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.xgate.mock.model.Action;
import com.xgate.mock.model.Contact;
import com.xgate.mock.model.Email;
import com.xgate.mock.model.Request;
import com.xgate.mock.model.Sms;

@Controller
public class ActionController {
	
	private static final Logger logger = LoggerFactory.getLogger(ActionController.class);

	@Autowired
	DataSourseController DSController;

	ArrayList<Action> list = new ArrayList<Action>();
	
	int newAction( String type ) {
		Action ac;
		if (type.equals("email")) {
			ac = new Email();
		} else {
			ac = new Sms();
		}
		this.list.add(ac);
		int i = this.list.indexOf(ac);
		ac.setExtid(i);
		return i;
	}
	
	Action editAction( int id, String content ) {
		Action ac = this.list.get(id);
		ac.setContent(content);
		return ac;
	}
	
	Action loadAction( int id ) {
		if (id<0) return null;
		return this.list.get(id);
	}

	public Request activate(int id, int contactId, String type) {
		Request r = new Request();
		r.setContactId(contactId);
		r.setExtId(id);
		r.setType(type);
		doSth(this.loadAction(id), this.DSController.getContact(contactId));
		return r;
	}
	
	public void doSth(Action action, Contact contact) {
		String to = contact.getEmail();
		String from = "test@xgate.com";
		String host = "mail.xgate.com";
		Properties properties = System.getProperties();
		properties.setProperty("mail.smtp.host", host);
		properties.setProperty("mail.user", "harry.zhang@xgate.com");
		properties.setProperty("mail.password", "ZCZ198962zcz");
		Session session = Session.getDefaultInstance(properties);

		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

			message.setSubject("This is a testing " + action.getTitle());
			message.setContent(action.getEmailString(), "text/html" );

			Transport.send(message);
			logger.info("email sent to: " + to);
		} catch (MessagingException mex) {
			mex.printStackTrace();
		}
	}

}
