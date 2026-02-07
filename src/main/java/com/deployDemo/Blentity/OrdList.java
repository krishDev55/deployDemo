package com.deployDemo.Blentity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class OrdList {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int ordLid;
	
	private String img;
	private String title;
	
	private  String weight;
	private String price;
	private double mrp;
	private int qty;
	
	 @ManyToOne
	    @JoinColumn(name = "order_id" )
	 @JsonBackReference
	    private Order order;
	
	 
	 
	
	public Order getOrder() {
		return order;
	}
	public void setOrder(Order order) {
		this.order = order;
	}
	@Override
	public String toString() {
		return "OrdList [ordLid=" + ordLid + ", img=" + img + ", title=" + title + ", weight=" + weight + ", price="
				+ price + ", mrp=" + mrp + ", qty=" + qty + "]";
	}
	public int getOrdLid() {
		return ordLid;
	}
	public void setOrdLid(int ordLid) {
		this.ordLid = ordLid;
	}
	public String getImg() {
		return img;
	}
	public void setImg(String img) {
		this.img = img;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getWeight() {
		return weight;
	}
	public void setWeight(String weight) {
		this.weight = weight;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public double getMrp() {
		return mrp;
	}
	public void setMrp(double mrp) {
		this.mrp = mrp;
	}
	public int getQty() {
		return qty;
	}
	public void setQty(int qty) {
		this.qty = qty;
	}
	
	
}
