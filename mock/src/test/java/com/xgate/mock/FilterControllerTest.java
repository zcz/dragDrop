package com.xgate.mock;

import org.junit.Assert;
import org.junit.Test;

public class FilterControllerTest {

	@Test
	public void test() {
		String regex = ".*@gmail\\.com$";
		Assert.assertTrue("abc@gmail.com".matches(regex));
		Assert.assertFalse("abc@gmailAcom".matches(regex));
		Assert.assertTrue("hahahah@gmail.com".matches(regex));
		Assert.assertFalse("abc@hotmail.com".matches(regex));
		Assert.assertFalse("abc@hotmail.comhihihi".matches(regex));
	}
}
