package com.deployDemo.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class BillingImfo {
	@Id
	private int billno;
	private String costomerName;
	private String mobileNo;
	private double discount;
	private String date;
	private double totalPayAmt;
	private double advAmt;
	private double remainingAmt;
	
	// One bill has many products
    @OneToMany(mappedBy = "billingImfo", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CellProducts> itomes;

	public int getBillno() {
		return billno;
	}

	public void setBillno(int billno) {
		this.billno = billno;
	}

	public String getCostomerName() {
		return costomerName;
	}

	public void setCostomerName(String costomerName) {
		this.costomerName = costomerName;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public double getDiscount() {
		return discount;
	}

	public void setDiscount(double discount) {
		this.discount = discount;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public double getTotalPayAmt() {
		return totalPayAmt;
	}

	public void setTotalPayAmt(double totalPayAmt) {
		this.totalPayAmt = totalPayAmt;
	}

	public double getAdvAmt() {
		return advAmt;
	}

	public void setAdvAmt(double advAmt) {
		this.advAmt = advAmt;
	}

	public double getRemainingAmt() {
		return remainingAmt;
	}

	public void setRemainingAmt(double remainingAmt) {
		this.remainingAmt = remainingAmt;
	}

	public List<CellProducts> getItomes() {
		return itomes;
	}

	public void setItomes(List<CellProducts> itomes) {
		this.itomes = itomes;
	}

	@Override
	public String toString() {
		return "BillingImfo [billno=" + billno + ", costomerName=" + costomerName + ", mobileNo=" + mobileNo
				+ ", discount=" + discount + ", date=" + date + ", totalPayAmt=" + totalPayAmt + ", advAmt=" + advAmt
				+ ", remainingAmt=" + remainingAmt + ", itomes=" + itomes + "]";
	}
	
	
	
	
	
	
}
