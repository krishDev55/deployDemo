package com.deployDemo.controller;

import java.net.MalformedURLException;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Base64.Encoder;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deployDemo.Blentity.OrdList;
import com.deployDemo.Blentity.Order;
import com.deployDemo.entity.BillingImfo;
import com.deployDemo.service.BillingImfoService;
import com.deployDemo.service.OrderService;
import com.deployDemo.service.WebScannerQR;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import jakarta.websocket.server.PathParam;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



//@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/app/v1/")
public class HomeController {
	
//	@Autowired
	WebScannerQR webScannerQr;
	
	@Autowired
	private BillingImfoService billingImfoService;
	
	@Autowired private OrderService orderService;
	

	@GetMapping("/home")
		public String homePage() {
			return "home";
		}
	
	@GetMapping("/login")
	public String login() {
		return "Login Page";
	}
	
	@GetMapping("/scanQrCode")
	public String scanQrCode() throws MalformedURLException, InterruptedException {
		return webScannerQr.scanQrCode();
	}
	
	
	
	@PostMapping("/savebill")
	
	public String postMethodName(@RequestBody BillingImfo billingImfo) {
		
		System.out.println("inside save bill method ");
		
		Random r= new Random();
		int nextInt = r.nextInt();
		System.out.println("bill no is : "+nextInt);
		
		billingImfo.setBillno(nextInt);
		
		 // set back-reference for each product (very important)
        if (billingImfo.getItomes() != null) {
            billingImfo.getItomes().forEach(item -> item.setBillingImfo(billingImfo));
        }
		
		String saveBill = billingImfoService.saveBill(billingImfo);
		System.out.println("bill save");
		
		return  String.valueOf(nextInt);
	}
	



		@PostMapping("/order")
		public Order SaveORders(@RequestBody Order order) {
			  
			    System.out.println("Whole Object: "+order);
//			   }
			    
				
				System.out.println("order data : "+order.getOrdList());
//				System.out.println("order data List : "+data);
				
				return orderService.save(order);
			
		}

		
		@GetMapping("/ordSumry/{orderId}")
		public List<OrdList> getOrderById(@PathVariable String orderId) {
				
				List<OrdList> ordList = orderService.getOrderById(orderId).getOrdList();
				 System.out.println("orderList: "+ordList);
				 return ordList;
		}
		
		
		// nnew order get by picker and  only one order get at a time  function use 
		@GetMapping("/newOrder")
		public Map<String, Object> getOrder() {
				Map<String, Object> orders = orderService.getNewOrder();
//				 System.out.println("order : "+orders);
				 return orders;
		}
		
		@GetMapping("/newOrders")
		public List<Order> getOrders() {
				List<Order> orders = orderService.getNewOrders();
//				 System.out.println("order : "+orders);
				 return orders;
		}

//  update status for order 
		@PutMapping("/updateOrderStatus/{id}/{status}")
		public String updateStatusOrder(@PathVariable String id, @PathVariable String status) {
				System.out.println("inside  updateStatus method ");
			return orderService.updateStatus(id, status);
		}
		
		
		

		
		
		// show only admin or use only admin or picker	
	
		@GetMapping("/get_ordList/{orderId}")
		public Map<String, Object> get_ordList(@PathVariable String orderId) {
				
				Map<String, Object> ordList = orderService.get_ordList(orderId);
				 
				 return ordList;
		}
		
		@GetMapping("/AllOrders")
		public List<Order> getAllOrders() {
				List<Order> orders = orderService.getAllOrders();
				 System.out.println("order : "+orders);
				 return orders;
		}
		
		
		
		
		
		
}











