package com.xgate.mock;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xgate.mock.model.Action;
import com.xgate.mock.model.CampaignFlow;
import com.xgate.mock.model.ContactList;
import com.xgate.mock.model.Filter;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	@Autowired
	DataSourseController DSController;
	@Autowired
	FilterController FTController;
	@Autowired
	ActionController ActionController;
	@Autowired
	CampaignFlowController CFController;
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		return "home";
	}
	
	@RequestMapping(value = "/contact", method = RequestMethod.POST)
	public @ResponseBody ContactList addContact(@RequestParam("name") String name, @RequestParam("email") String email, @RequestParam("mobile") String mobile, @RequestParam("extid") int extid) {
		if ((name+email+mobile).length()==0) return null;
		if (extid < 0) {
			extid = this.DSController.newList();
			logger.info("create new contact list: "  + extid );
		}
		logger.info("new contact created, extid:" + extid + " name:" + name + " email:" + email + " mobile:" + mobile);
		return this.DSController.addContact(extid, name, email, mobile);
	}
	
	@RequestMapping(value = "/contact", method = RequestMethod.GET)
	public @ResponseBody ContactList loadContact(@RequestParam("extid") int id) {
		logger.info("load all contacts for list: " + id);
		return this.DSController.getContactList(id);
	}	

	@RequestMapping(value = "/filter", method = RequestMethod.POST)
	public @ResponseBody Filter addFilter(@RequestParam("attribute") String attribute, @RequestParam("regex") String regex, @RequestParam("extid") int extid) {
		if ((attribute+regex).length()==0) return null;
		if (extid < 0) {
			extid = this.FTController.newFilter();
			logger.info("create new filter: "  + extid );
		}
		logger.info("new filter created, extid:" + extid + " attribute:"+ attribute + " regex:" + regex);
		return this.FTController.editFilter(extid, attribute, regex);
	}
	
	@RequestMapping(value = "/filter", method = RequestMethod.GET)
	public @ResponseBody Filter loadFilter(@RequestParam("extid") int id) {
		logger.info("load filter: " + id);
		return this.FTController.loadFilter(id);
	}	
	
	@RequestMapping(value = "/action/{type}", method = RequestMethod.POST)
	public @ResponseBody Action addAction(@PathVariable String type, @RequestParam("content") String content, @RequestParam("extid") int extid) {
		if ((type+content).length()==0) return null;
		if (extid < 0) {
			extid = this.ActionController.newAction(type);
			logger.info("create new action: "  + extid );
		}
		logger.info("new action["+type+"] created, extid:" + extid + " content " + content);
		return this.ActionController.editAction(extid, content);
	}
	
	@RequestMapping(value = "/action/{type}", method = RequestMethod.GET)
	public @ResponseBody Action loadAction(@RequestParam("extid") int id) {
		logger.info("load Action: " + id);
		return this.ActionController.loadAction(id);
	}	
	
	@RequestMapping(value = "/flow", method = RequestMethod.POST)
	public @ResponseBody CampaignFlow addFlow(@RequestParam("name") String name, @RequestParam("JSON") String JSON, @RequestParam("id") int extid) {
		if ((name+JSON).length()==0) return null;
		if (extid < 0) {
			extid = this.CFController.newFlow();
			logger.info("create new flow: "  + extid );
		}
		logger.info("new flow["+name+"] created, extid:" + extid + " JSON " + JSON);
		return this.CFController.editFlow(extid, name, JSON);
	}
	
	@RequestMapping(value = "/flow", method = RequestMethod.GET)
	public @ResponseBody CampaignFlow loadFlow(@RequestParam("id") int id) {
		logger.info("load Action: " + id);
		return this.CFController.loadFlow(id);
	}	
}