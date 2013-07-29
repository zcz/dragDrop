package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;

import com.xgate.mock.model.Action;
import com.xgate.mock.model.Email;
import com.xgate.mock.model.Sms;

@Controller
public class ActionController {

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
}
