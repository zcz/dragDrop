package com.xgate.mock.model;

import net.sf.json.JSONObject;

public class CampaignFlow {

	int id;
	JSONObject graph;
	String name;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public JSONObject getGraph() {
		return graph;
	}
	public void setGraph(JSONObject graph) {
		this.graph = graph;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

}
