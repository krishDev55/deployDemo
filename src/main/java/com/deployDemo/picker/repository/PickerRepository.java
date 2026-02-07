package com.deployDemo.picker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.deployDemo.picker.entity.Picker;

@Repository
public interface PickerRepository  extends JpaRepository<Picker, String> {

}
