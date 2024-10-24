package com.deployDemo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/app/v1/")
public class HomeController {

	@GetMapping("/home")
		public String homePage() {
			return "welcome to home page";
		}
	
	@GetMapping("/login")
	public String login() {
		return "Login Page";
	}
}
