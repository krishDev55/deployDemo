package com.deployDemo.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deployDemo.Repository.BillingImfoRepo;
import com.deployDemo.entity.BillingImfo;

@Service
public class BillingImfoService {

	@Autowired
	private BillingImfoRepo billingImfoRepo;
	
	@Autowired private ProductService productService;
	
	public String saveBill(BillingImfo billingImfo) {
		billingImfo.getItomes().stream().map(e->{
			try {
				productService.updateQuentity(e.getSku(), e.getQty());
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			return e;
		});
		BillingImfo save = billingImfoRepo.save(billingImfo);
		
		System.out.println("bill is save : "+save);
		return "save bill is ok";
	}
	
}
