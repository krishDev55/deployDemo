package com.deployDemo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deployDemo.entity.Product;

@Repository
public interface ProductRepo  extends JpaRepository<Product	, Long> {

  List<Product> findByCategory(String category);
  
  List<Product> findByIsActive(Boolean isActive);
  
  List<Product> findByName(String name);
  
  List<Product> findByPrcbillno(String prcbillno);
  
  Product findBySku(String sku);
  
  Product findByRcode(String rcode);
  
  
	
}
