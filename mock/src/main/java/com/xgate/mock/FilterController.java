package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;

import com.xgate.mock.model.Filter;

@Controller
public class FilterController {
	
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
}
