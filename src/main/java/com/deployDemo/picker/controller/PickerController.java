package com.deployDemo.picker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.deployDemo.picker.entity.Picker;
import com.deployDemo.picker.service.PickerService;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class PickerController {
			@Autowired
			PickerService pickerService;
			
			@PostMapping("/sPicker")
			public Picker savePicker(@RequestBody Picker picker) {			
				return pickerService.save(picker);
			}
			
			@GetMapping("/Pikers")
			public List<Picker> allPicker(){
				return pickerService.getAllPicker();
			}
			
			@GetMapping("/onPicker")
			public List<Picker> getOnlinePicker() {
				return pickerService.getOnlinePickers();
			}
			
			@GetMapping("/pid/{id}")
			public Map<String, Object> getPickerById(@PathVariable String id) {
				return pickerService.getById(id);
			}
			
			@PutMapping("/statusUpd/{id}/{status}")
			public Picker updateStatus(@PathVariable String id, @PathVariable String status) {				
				return pickerService.updateStutus(id, status);
			}
			
			
			
			
			
			
}
