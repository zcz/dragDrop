package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.xgate.mock.model.Filter;
import com.xgate.mock.model.Request;

@Controller
public class FilterController {
	
	@Autowired
	DataSourseController DSController;
	
	ArrayList<Filter> list = new ArrayList<Filter>();

	int newFilter() {
		Filter f = new Filter();
		this.list.add(f);
		int i = this.list.indexOf(f);
		f.setExtid(i);
		return i;
	}
	
	Filter editFilter(int id, String attribute, String regex) {
		Filter ft = this.list.get(id);
		ft.setAttribute(attribute);
		ft.setRegex(regex);
		return ft;
	}
	
	Filter loadFilter( int id ) {
		if (id<0) return null;
		return this.list.get(id);
	}

	public Request filter(int id, int contactId) {
		Request r = new Request();
		r.setContactId(contactId);
		r.setExtId(id);
		r.setType("filter");
		Filter f = this.loadFilter(id);
		String field = this.DSController.getContact(contactId).get(f.getAttribute());
		r.setOutcome(field.matches(f.getRegex()));
		return r;
	}
}
