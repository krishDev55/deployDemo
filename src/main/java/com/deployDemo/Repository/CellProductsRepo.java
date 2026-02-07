package com.deployDemo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deployDemo.entity.CellProducts;

@Repository
public interface CellProductsRepo  extends JpaRepository<CellProducts, Integer>{

}
