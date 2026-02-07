package com.deployDemo.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deployDemo.Blentity.OrdList;
import com.deployDemo.Blentity.Order;
import com.deployDemo.Repository.OrderRepo;
import com.deployDemo.picker.entity.Picker;
import com.deployDemo.picker.service.PickerService;

@Service
public class OrderService {
		
	@Autowired
	private OrderRepo orderRepo;
	@Autowired 
	private PickerService pickerService;
	
	public Order save(Order data) {
		
		List<OrdList> ordList = data.getOrdList();
		for (OrdList ord : ordList) {
				ord.setOrder(data);	
		}
		
		data.setOrdList(ordList);
	
		
//		String decodedJson = new String(Base64.getDecoder().decode(data));
//		  JSONArray array = new JSONArray(decodedJson);
//	        JSONObject obj = array.getJSONObject(0);
//		
//		Order or= new Order();
//		 
//		 or.setOrderId(obj.getString("id"));
//		 or.setData(data);
//		en
		
	
		 Optional<Picker> onPicker = pickerService.findOnPicker();
		 try {
			if (onPicker.isPresent()) {
				 	String id = onPicker.get().getId();
				 		data.setPickerId(id);
				 		pickerService.updateStutus(id, "picking");
				 		
			}
			else {
				data.setPickerId("manager");
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	
		Order save = orderRepo.save(data);
		
		return save;
	}
	
	public Order getOrderById(String orderId) {
		
		return orderRepo.findById(orderId).get() ;
	}

	
	// get new order only one.....
	public Map<String, Object> getNewOrder() {
		Map<String, Object> map= new HashMap<>();
		String value="NOT-READY";
				 Optional<Order> any = orderRepo.findAll().stream()
									.filter(e-> value.equals(e.getStatus()))
									.findAny();
				 
				 if(any.isPresent()) {
					 map.put("order", any.get());
					 return map;
				 }
				 else {
					 map.put("msg", "No Order");
					 return map;
				 }
										
	}
	
	// get new order multiple Orders
	public List<Order> getNewOrders() {
		String value="READY";
				List<Order> collect = orderRepo.findAll().stream()
									.filter(e-> ! value.equals(e.getStatus()) )
										.collect(Collectors.toList());
		return collect;
	}

	
	// get All order multiple Orders
		public List<Order> getAllOrders() {
			
					List<Order> collect = orderRepo.findAll();
			return collect;
		}

	
	// this is use only use in admin not any use 
	public Map<String, Object> get_ordList(String orderId) {
				Map<String, Object> map= new HashMap<>();
					Optional<Order> byId = orderRepo.findById(orderId);
					if(byId.isPresent()) {
						Order order = byId.get();
						Map<String, Object> byId2 = pickerService.getById(order.getPickerId());
//					Picker picker = pickerService.getById(order.getPickerId());
						map.put("pickerId", order.getPickerId());
						map.put("pickerName", byId2.get("pickerName"));
						map.put("time", order.getDate());
						map.put("ordlist", order.getOrdList());
						return map;
					}
					else {
							map.put("msg", "Id Not Fount");
						return map;
					}
	}
	
	
	// order status Update function
	public String updateStatus(String id ,String status) {
			Order order = getOrderById(id);
			order.setStatus(status);
			orderRepo.save(order);
			return "update";
	}
	
}
