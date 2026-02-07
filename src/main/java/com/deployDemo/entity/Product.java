//package com.deployDemo.entity;
//
//
//public class Products {
//
//	/*
//	productId: data.productId,
//    sku: data.sku, 
//    name: data.name, 
//    price: data.price, 
//    size: data.size,
//    colour: data.colour,
//    cost: data.cost, 
//    qty: 1 
//    
//	*/
//	     
//	
//}


package com.deployDemo.entity;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Entity


public class Product {

  @Id
//  @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

//    @Column(nullable = false)
    private String name;

    private String category;
    private String brand;
    private String size;
    private String colour;

//    @Column(nullable = false)
    private Double purchasePrice;

//    @Column(nullable = false)
    private Double price;

//    @Column(nullable = false)
    private Integer qty;

    private String unit;
    private String description;
    
    private String prcbillno;
    
    @Column(nullable = false, updatable = false , columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column( columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

//    @Column(nullable = false)  
    private Boolean isActive=true;  
    
    @Column(nullable = false ,unique = true)  
    private String rcode;
    
    private List<String> img;
    
    

    public List<String> getImg() {
		return img;
	}

	public void setImg(List<String> img) {
		this.img = img;
	}

	@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.rcode= Integer.toHexString(hashCode());
        
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }   

    public void setSku(String sku) {
        this.sku = sku;
    }
    
    

    public String getRcode() {
		return rcode;
	}

	public void setRcode(String rcode) {
		this.rcode = rcode;
	}

	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Double getPrice() {
        return price;
    }

    public void setSellingPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return qty;
    }

    public void setQuantity(Integer qty) {
        this.qty = qty;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
    
    public Integer getQty() {
		return qty;
	}

	public void setQty(Integer qty) {
		this.qty = qty;
	}

	public String getPrcbillno() {
		return prcbillno;
	}

	public void setPrcbillno(String prcbillno) {
		this.prcbillno = prcbillno;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }


	public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
	@Override
	public String toString() {
		return "Product [id=" + id + ", sku=" + sku + ", name=" + name + ", category=" + category + ", brand=" + brand
				+ ", size=" + size + ", colour=" + colour + ", purchasePrice=" + purchasePrice + ", sellingPrice="
				+ price + ", quantity=" + qty + ", unit=" + unit + ", description=" + description
				+ ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + ", isActive=" + isActive + ", prcBillNumber="+prcbillno 
				+ ", rCode"+ rcode+ "]";
	}
    
    
}

