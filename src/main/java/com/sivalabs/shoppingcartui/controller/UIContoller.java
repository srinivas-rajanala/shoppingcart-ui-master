package com.sivalabs.shoppingcartui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
public class UIContoller {

	/*
	 * @PostMapping("/shop/authA") public String authrze() { return
	 * "Hellow Adimurthy Auth Acceded with User"; }
	 */
    
    @PostMapping("/shop/authA")
    public String authrze(@RequestBody String username) {
    	return "Autherised user : "+ username;
    }
    
    @GetMapping("/shop/greeting")
  	public String greeting() {
  		return "Hellow Adimurthy";
  	}
}
