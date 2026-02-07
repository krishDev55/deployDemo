package com.deployDemo.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class CellProducts {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String name;
	private String sku;
	private String size;
	private String colour;
	private int qty;
	private double price;
	
	// Many products belong to one bill
    @ManyToOne
    @JoinColumn(name = "billno")  // Foreign key column in cell_products table
    private BillingImfo billingImfo;
    
    
	
	public BillingImfo getBillingImfo() {
		return billingImfo;
	}
	public void setBillingImfo(BillingImfo billingImfo) {
		this.billingImfo = billingImfo;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSku() {
		return sku;
	}
	public void setSku(String sku) {
		this.sku = sku;
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
	public int getQty() {
		return qty;
	}
	public void setQty(int qty) {
		this.qty = qty;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	
	@Override
	public String toString() {
		return "CellProducts [id=" + id + ", name=" + name + ", sku=" + sku + ", size=" + size + ", colour=" + colour
				+ ", qty=" + qty + ", price=" + price +  "]";
	}
	
	
	
	
	
	
	
	
	
	
}
