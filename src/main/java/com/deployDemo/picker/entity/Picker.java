package com.deployDemo.picker.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Picker {
		@Id
		public String id;
		public String name;
		public int age;
		public String address;
		public long mobile;
		public String password;
		public String status; // chack picker online or offline
							// if online assign order  and update status picking;
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public int getAge() {
			return age;
		}
		public void setAge(int age) {
			this.age = age;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public long getMobile() {
			return mobile;
		}
		public void setMobile(long mobile) {
			this.mobile = mobile;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		
		
		@Override
		public String toString() {
			return "Picker [id=" + id + ", name=" + name + ", age=" + age + ", address=" + address + ", mobile="
					+ mobile + ", password=" + password + ", status=" + status + "]";
		}
		
		
		
		
}
