package com.deployDemo.Blentity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity(name = "orders")
public class Order {
	  
	@Id
//	@GeneratedValue(strategy =  GenerationType.UUID)
	private String order_id;
	private  String status;
	private String ids;
	private String date;
	private double totalPprice;
	
	private  String location;
	
	private  String pickerId;
	


	@OneToMany(
	        mappedBy = "order",
	        cascade = CascadeType.ALL,
	        orphanRemoval = true
	    )
	@JsonManagedReference
	List<OrdList> ordList;
	
	public String getPickerId() {
		return pickerId;
	}
	
	
	public void setPickerId(String pickerId) {
		this.pickerId = pickerId;
	}
	


	public String getOrder_id() {
		return order_id;
	}


	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}





	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getIds() {
		return ids;
	}


	public void setIds(String ids) {
		this.ids = ids;
	}


	public String getDate() {
		return date;
	}


	public void setDate(String date) {
		this.date = date;
	}


	public double getTotalPprice() {
		return totalPprice;
	}


	public void setTotalPprice(double totalPprice) {
		this.totalPprice = totalPprice;
	}


	public String getLocation() {
		return location;
	}


	public void setLocation(String location) {
		this.location = location;
	}


	public List<OrdList> getOrdList() {
		return ordList;
	}


	public void setOrdList(List<OrdList> ordList) {
		this.ordList = ordList;
	}


	@Override
	public String toString() {
		return "Order [order_id=" + order_id + ", status=" + status + ", ids=" + ids + ", date=" + date
				+ ", totalPprice=" + totalPprice + ", location=" + location + ", ordList=" + ordList + "]";
	}


	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
