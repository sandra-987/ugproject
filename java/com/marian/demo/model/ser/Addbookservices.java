package com.marian.demo.model.ser;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.demo.model.Addbook;
import com.marian.demo.model.re.Addbookrepository;



@Service
public class Addbookservices {
	@Autowired
	public Addbookrepository addbookRepo;
	
	public List<Addbook> getAllEmployees()
	{
		return addbookRepo.findAll();
	}
	public Addbook saveAddress(Addbook addbook)
	{
		return addbookRepo.save(addbook);
	}
		
	



}
