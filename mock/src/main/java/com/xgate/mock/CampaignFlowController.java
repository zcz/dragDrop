package com.xgate.mock;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;

import com.xgate.mock.model.CampaignFlow;

@Controller
public class CampaignFlowController {
	
	ArrayList<CampaignFlow> list = new ArrayList<CampaignFlow>();
	

	int newFlow() {
		CampaignFlow f = new CampaignFlow();
		this.list.add(f);
		int i = this.list.indexOf(f);
		f.setId(i);
		return i;
	}
	
	CampaignFlow editFlow(int id, String name, String JSON) {
		CampaignFlow f = this.list.get(id);
		f.setName(name);
		f.setJSON(JSON);
		return f;
	}
	
	CampaignFlow loadFlow( int id ) {
		if (id<0) return null;
		return this.list.get(id);
	}

}
