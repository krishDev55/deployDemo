package com.deployDemo.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import com.deployDemo.Repository.ProductRepo;
import com.deployDemo.entity.Product;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import ch.qos.logback.core.pattern.parser.Node;

@Service
public class ProductService {

	@Autowired
	
	ProductRepo productRepo;
	
	public Product saveProduct(Product product) {
		String sku = product.getSku();
		
		Optional<Product> op= Optional.ofNullable(productRepo.findBySku(sku));
		if(! op.isEmpty()) {
			product.setId(op.get().getId());
			product.setRcode(op.get().getRcode());
			product.setCreatedAt(op.get().getCreatedAt());
			product.setUpdatedAt(LocalDateTime.now());
			
			return productRepo.save(product);
		}
		return productRepo.save(product);
	}

	public Product getProductById(String id) {	
		return productRepo.getReferenceById(Long.parseLong(id));
	}

	public Product updateCountProduct(String id) {
		// TODO Auto-generated method stub
		return null;
	}

	public String deleteProductById(String id) {
		productRepo.deleteById(Long.parseLong(id));
		return "Product Delete";
	}

	public List<Product> getProductByCategory(String category) {
		
		return productRepo.findByCategory(category);
	}

	public Product getProductBySku(String squ) {
		// TODO Auto-generated method stub
		return productRepo.findBySku(squ);
	}

	public List<Product> getAll() {
		
		return productRepo.findAll();
	}

	public Map<String, Object> getProductByRcode(String rcode) throws IOException {
		Map<String, Object> map= new HashMap<>();
		int productId=0;
		  PathMatchingResourcePatternResolver resolver =
	                new PathMatchingResourcePatternResolver();
		  Resource resource=  resolver.getResource("classpath:static/productMapping.json");
		
		  try (InputStream is = resource.getInputStream()) {
			  JsonNode node = mapper.readTree(is).get(rcode);
			 
			 if( Optional.ofNullable(node).isPresent()) {
		             productId = node.asInt();
		             if(productId != 0) {
		            	 File json = readJson(String.valueOf(productId));
		            	 JsonNode tree = mapper.readTree(json);
		            	 map.put("product", tree);
		            	 map.put("status", "scanProductByFile");
		            	 return map;
		             }
		             else {
		            	
		            	 map.put("product", productRepo.findByRcode(String.valueOf(productId)));
		            	 map.put("status", "scanProductByDb");
		            	 return map;
		             }
			}
			 else {
				 map.put("scCode", rcode);
            	 map.put("status", "NotFount");
            	 return map;
			 }
          }
		
		
	}

	
	
	//---------------------------------------------------------------------------------------------
	// this is Only Json file Logic  Start 
	
//	This is Object Mapper Class object create By new Keyword
	 private final ObjectMapper mapper = new ObjectMapper();
	 
	 // get All File imformation
	public List<JsonNode> getAllProductByAllFile() throws IOException {
		  PathMatchingResourcePatternResolver resolver =
	                new PathMatchingResourcePatternResolver();

	        Resource[] resources = resolver.getResources(
	                "file:configPoduct/ProductSJson/*/*.json"
	        );
	        		
	        List<JsonNode> products = new ArrayList<>();

	        for (Resource resource : resources) {
	            try (InputStream is = resource.getInputStream()) {
	                JsonNode node = mapper.readTree(is);
	                products.add(node);
	            }
	        }
	        return products;
	}
	
	
	
	// this get update file like Quentity
	public JsonNode updateQuentity(String sku ,int qnt) throws IOException {
		
		File file = readJson(sku);
		ObjectNode objNode = (ObjectNode) mapper.readTree(file); 
		int qn = objNode.get("inventory").asInt();
		
		objNode.put("inventory", (qn-qnt));
		 mapper.writerWithDefaultPrettyPrinter().writeValue(file, objNode);			
		
		return mapper.readTree(file);
		
	}	
	
	public File readJson(String id) throws IOException { 
		 
		PathMatchingResourcePatternResolver resolver =  new PathMatchingResourcePatternResolver();
        Resource[] resources=null;
        boolean flag=true;
        int i=1;
        while(flag) {  	
        	 resources = resolver.getResources(
        				"file:configPoduct/ProductSJson/*/*_"+id+"_"+ i++ +".json"
        			);
        	 if(resources.length !=0 ) {
        		 flag=false;
        	 }
        }
        System.out.println("value Ise: "+Arrays.toString(resources));
        File file = resources[0].getFile();
       
        return file;
    }
	
	
	
	
}
