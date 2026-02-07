package com.deployDemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deployDemo.Repository.CellProductsRepo;

@Service
public class CellProductsService {

	@Autowired 
	private CellProductsRepo cellProductsRepo;
	
	
}
