package com.deployDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deployDemo.Blentity.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, String> {

}
