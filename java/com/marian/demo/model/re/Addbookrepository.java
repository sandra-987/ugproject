package com.marian.demo.model.re;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.demo.model.Addbook;

@Repository
public interface Addbookrepository extends JpaRepository<Addbook,Integer> {

}
