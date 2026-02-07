package com.deployDemo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.deployDemo.entity.Product;
import com.deployDemo.service.ProductService;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.catalina.mapper.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/app/v1/product")
public class ProductC {
	
	@Autowired 
	ProductService productService;
	
		
	@PostMapping("/sprod") 
	public Product saveProduct(@RequestBody Product product) {
		
		return productService.saveProduct(product);// for checking
	}
	
	
	@GetMapping("/get/{id}")
	public Product getProductById(@PathVariable String id) {	
		return productService.getProductById(id);
	}
	
	
	@GetMapping("/getAll")
	public List<Product> getAllProduct() {
		return productService.getAll();
	}
	
	
	@GetMapping("/getSku/{squ}")
	public Product getMethodName(@PathVariable String squ) {
		return productService.getProductBySku(squ);
	}
	
	@GetMapping("/getCat/{category}")
	public List<Product> getProductByCategory(@PathVariable String category) {
		return productService.getProductByCategory(category);
	}
	
	@PutMapping("path/{id}")
	public String putMethodName(@PathVariable String id, @RequestBody String entity) {
		//TODO: process PUT request
		
		return entity;
	}
	@DeleteMapping("/del/{id}")
	public String deleteProductById(@PathVariable String id ) {
		
		return productService.deleteProductById(id);
	}
	
	@PutMapping("/updProd/{id}")
	public Product updateCountProduct(@PathVariable String id, @RequestBody String entity) {
	
		
		return productService.updateCountProduct(id);
	}
	
	
	@GetMapping("/rcode/{rcode}")
	public Map<String, Object> getProductByRcode(@PathVariable String rcode) throws IOException {
		Map<String, Object> productByRcode = productService.getProductByRcode(rcode);

		return productByRcode;
	}
	
	
	
	
//	-----------------------------------------------------------------
	
	@GetMapping("/fileHandle")
	public  List<JsonNode> handleAllFile() throws IOException {
				
		List<JsonNode> all = productService.getAllProductByAllFile();
					List<JsonNode> collect = all.stream()
//							       .filter(e-> e.)
									.filter(e-> e.has("id"))
									.collect(Collectors.toList());
		
					
					return collect; 
	}
	
	@GetMapping("/fileHandle/asd")
	public  List<JsonNode> asdQntAllFile() throws IOException {		
		List<JsonNode> all = productService.getAllProductByAllFile();
				List<JsonNode> sortedByQty = all.stream()
				        .filter(e -> e.has("inventory"))   // safety chec
				        .sorted(Comparator.comparingInt(e -> e.get("inventory").asInt()))
				        .collect(Collectors.toList());
		return sortedByQty; 
	}
	@GetMapping("/fileHandle/desc")
	public  List<JsonNode> disQntAllFile() throws IOException {		
		List<JsonNode> all = productService.getAllProductByAllFile();
					List<JsonNode> sortedByQtyDesc = all.stream()
					        .filter(e -> e.has("inventory"))
					        .sorted(Comparator.comparingInt(
					                (JsonNode e) -> e.get("inventory").asInt()
					        ).reversed())
					        .collect(Collectors.toList());
		return sortedByQtyDesc; 
	}
	
	   
	@GetMapping("/Sku/{squ}")  
	public JsonNode getMethodBySqu(@PathVariable String squ) throws IOException {
		List<JsonNode> allP = productService.getAllProductByAllFile();
  

	JsonNode jn= allP.stream()
//			.filter(e->e.size()>4)  
			.filter(f-> f.get("id")!=null)
			.filter(f-> f.get("id").asInt() == Integer.parseInt(squ))
//			.collect(Collectors.toList());
			.findFirst().get();
	
	
		return jn ;
	}
	
	@GetMapping("/fileHandle/{key}")
	public  JsonNode handleFile1(@PathVariable String key) throws IOException {
		
		JsonNode name = getValueByKey(key);
//		JsonNode name= readJson();
		Iterator<JsonNode> iterator = name.iterator();
		while (iterator.hasNext()) {
			 JsonNode next = iterator.next();
			 System.out.println(next.get("name"));
			
		}
		return name; 
	}
	
	
	
	@PutMapping("/UpdQnt/{id}/{qnt}")
	public  JsonNode  updateFileQuentity(@PathVariable String id ,@PathVariable int qnt) throws IOException {
//			readJson(id);
		return productService.updateQuentity(id,qnt);
//			return readJson(id);
		}
	
    private final ObjectMapper objectMapper = new ObjectMapper();
	  
	public JsonNode readJson(String id) throws IOException {
      
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
       // System.out.println("value Ise: "+Arrays.toString(resources));
//        return objectMapper.readTree((JsonParser) path);
        File file = resources[0].getFile();
        return objectMapper.readTree(file) ; 
        		}

    public JsonNode getValueByKey(String key) throws IOException {
        JsonNode jsonNode = readJson(key);
        return jsonNode.get(key);
    }
	
	
	
    
    
//    -------------------------this test for ecsent stock
    
    @GetMapping("/viewAllStock")
    public JsonNode c2322ChackFile() throws IOException {
    	 final ObjectMapper objectMapper = new ObjectMapper();
    	PathMatchingResourcePatternResolver resolver =  new PathMatchingResourcePatternResolver();
      
    	Resource[] resources= resolver.getResources(
     			"file:configPoduct/stock.json"
     			);
    	 	
    	File file = resources[0].getFile();
    	 
        return objectMapper.readTree(file);
    }
    
    
    @GetMapping("/allord")
    public JsonNode c2321ChackFile() throws IOException {
    	 final ObjectMapper objectMapper = new ObjectMapper();
    	PathMatchingResourcePatternResolver resolver =  new PathMatchingResourcePatternResolver();
      
    	Resource[] resources= resolver.getResources(
     			"file:configPoduct/stockm.json"
     			);
    	 	
    	File file = resources[0].getFile();
    	 
        return objectMapper.readTree(file);
    }
    
    @PutMapping("/updOrAdd/{value}")
    public JsonNode c2323ChackFile(@PathVariable String value) throws IOException {
    	 final ObjectMapper objectMapper = new ObjectMapper();
    	PathMatchingResourcePatternResolver resolver =  new PathMatchingResourcePatternResolver();
    	Resource resource = resolver.getResource("file:configPoduct/conseBatch.json");
    	JsonNode tree = objectMapper.readTree(resource.getFile());
    	JsonNode bt = tree.get(value);
    	
    	File stockm= resolver.getResource("file:configPoduct/stockm.json").getFile();
    	
    	JsonNode tree2 = objectMapper.readTree(stockm);
    	JsonNode ijn=null;
    	String key=null;
    	Map<String, Object> map = new HashMap<>();
    	Iterator<String> fl = tree2.fieldNames();
    	
    	while(fl.hasNext()) {
    		key=fl.next();
    		ijn = tree2.get(key);
    	}
//    	 ijn.get(key)
    	
    	map.put("bname", value);
    	map.put("soda_use", 2.3);
    	
    	System.out.println("ijn : " + ijn.toPrettyString());
    	
    	  objectMapper.updateValue(stockm, map );
//        return objectMapper.readTree(updateValue);
    	  return ijn;
    }
    
	
	
}
