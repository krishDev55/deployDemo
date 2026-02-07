package com.deployDemo.picker.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deployDemo.picker.entity.Picker;
import com.deployDemo.picker.repository.PickerRepository;

@Service
public class PickerService {
			@Autowired
			PickerRepository pickerRepo;
			
			public Picker save(Picker picker) {
				
				return pickerRepo.save(picker);
			}
			
			public Map<String, Object> getById(String id) {	
				Optional<Picker> byId = pickerRepo.findById(id);
				Map<String, Object> map= new HashMap<>();
				if(byId.isPresent()) {
					Picker picker = byId.get();
					map.put("pickerName", picker.getName());
					map.put("msg", "Picker Found");
					map.put("pickerStatus", picker.getStatus());
					
					return map;				
				}
				else {
					map.put("msg", "No Picker Found");
					return map;
				}
				
			}
			
			public Optional<Picker> findOnPicker() {	
				return pickerRepo.findAll().stream()
							.filter(e-> e.getStatus().equals("online"))
								.findAny();
								   
								
			}
			
			public List<Picker> getOnlinePickers() {	
				return pickerRepo.findAll().stream()
							.filter(e-> e.getStatus().equals("online"))
								.collect(Collectors.toList());
			}
			
			public Picker updateStutus( String id , String status) {
							Picker byId = pickerRepo.findById(id).get();
							System.out.println("Picker Is : "+byId);
							byId.setStatus(status);				
				return pickerRepo.save(byId);
			}

			public List<Picker> getAllPicker() {
				// TODO Auto-generated method stub
				return pickerRepo.findAll();
			}
			
}
