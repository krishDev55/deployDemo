package com.deployDemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/app/rederPage/")
public class RendorPageController {
		
		public void showhtmlPage() {
			
		}
		
		@GetMapping("/about")
	    public String about() {
			System.out.println("this is about page");
	        return "htmlpage/mycloth.html"; // This will render templates/about.html
	    }
		
		
}
