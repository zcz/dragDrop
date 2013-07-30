package com.xgate.mock.model;

public class Contact {
	
	int id;
	String name;
	String email;
	String mobile;
	
	public void setId(int id) {
		this.id = id;
	}
	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String get(String attribute) {
		if (attribute.equals("mobile")) return this.mobile;
		if (attribute.equals("email")) return this.email;
		if (attribute.equals("name")) return this.name;
		return null;
	}
}
