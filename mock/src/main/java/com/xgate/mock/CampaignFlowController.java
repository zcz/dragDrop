package com.xgate.mock;

import java.util.ArrayList;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

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
	
	CampaignFlow editFlow(String jsonTxt) {

		JSONObject json = (JSONObject) JSONSerializer.toJSON(jsonTxt);
		int id = json.getInt("id");
		if (id < 0) {
			id = this.newFlow();
		}
		
		CampaignFlow f = this.list.get(id);
		f.setName(json.getString("name"));
		f.setGraph(json.getJSONObject("graph"));
		return f;
	}
	
	CampaignFlow loadFlow( int id ) {
		if (id<0) return null;
		return this.list.get(id);
	}

	public CampaignFlow removeFlow(int id) {
		CampaignFlow flow = loadFlow(id);
		this.list.set(id, null);
		return flow;
	}
}
