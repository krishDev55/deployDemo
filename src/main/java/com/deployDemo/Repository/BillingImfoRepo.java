package com.deployDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deployDemo.entity.BillingImfo;

@Repository
public interface BillingImfoRepo extends JpaRepository<BillingImfo, Integer> {

}
