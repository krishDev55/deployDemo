package com.deployDemo.cofig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig  implements WebMvcConfigurer {

	   @Value("${app.json.base-path}")
	    private String jsonBasePath;

	    @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    	System.out.println("addResourceHandlers method ------------------------------");
	        registry
	            .addResourceHandler("/json/**")
	            .addResourceLocations("file:" + jsonBasePath + "/");
	    }
}
