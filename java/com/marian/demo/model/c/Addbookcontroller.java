package com.marian.demo.model.c;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.marian.demo.model.Addbook;
import com.marian.demo.model.ser.Addbookservices;


@RestController
@CrossOrigin(origins="http://localhost:3000")
public class Addbookcontroller {
	@Autowired
	public Addbookservices addbookService;
	
	@GetMapping("/api/address")
	public List<Addbook> showAllEmployee(){
		
		return addbookService.getAllEmployees();
	}
	@PostMapping("/api/address")
	public Addbook addAddress(@RequestBody Addbook addbook)  {
		return addbookService.saveAddress(addbook);
	}
}
