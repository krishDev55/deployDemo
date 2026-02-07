package com.deployDemo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.websocket.server.PathParam;

import org.springframework.ui.Model;

@Controller
public class Bl_HomeController {
	
	@Value("${app.home.jsPath}") private String homeJsPath;
	
	@Value("${app.home.StylePath}") private String homeStylePath;
	
	@GetMapping("/")
    public String about( Model model) {
		model.addAttribute("homeStylePath", homeStylePath);
		model.addAttribute("homeJsPath", homeJsPath);

        return "hpage/bl_home.html"; // This will Main Page of My Application
    }
	@GetMapping("/product")
    public String productPage() {
		System.out.println("this is about page");
        return "htmlpage/product.html"; // This will render templates/about.html
    }
	
	@GetMapping("/pickerProductPage")
    public String pickerProductPage() {
		System.out.println("pickerProductPage Called");
        return "htmlpage/picker/pickerProduct.html"; // pickerProductPage.html
    }
	
	@GetMapping("/profile")
    public String profile() {	
        return "hpage/bl_profile.html"; // This will render templates/about.html
    }
	
	@GetMapping("/ordSumry")
    public String ordSumry(@RequestParam String ordId) {
		System.out.println("requst parem "+ordId);
			
		 
        return "hpage/bl_order_summry.html"; // This will render templates/about.html
    }
	
	@GetMapping("/pOrders")
    public String past_orders() {	
        return "hpage/bl_order_his.html"; // This will render templates/about.html
    }
	
	@GetMapping("/manAd")
    public String manAd() {
		System.out.println("admin page");
        return "htmlpage/admin_man.html"; // This will render templates/about.html
    }
	
	@GetMapping("/shop")
    public String shop() {
		System.out.println("shop page");
        return "htmlpage/mycloth.html"; // This will render templates/about.html
    }
	
	
	
//	--------------------------Picker logic---------------------------------------------------
	
	@GetMapping("/picker")
    public String pikerHome() {
        return "htmlpage/picker/pickerMain.html"; // This will render templates/about.html
    }
	
	
	
	
	
	
}
