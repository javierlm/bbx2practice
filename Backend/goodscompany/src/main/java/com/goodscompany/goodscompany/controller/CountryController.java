package com.goodscompany.goodscompany.controller;

import com.goodscompany.goodscompany.dto.CountryDTO;
import com.goodscompany.goodscompany.services.CountryService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CountryController {

    @Autowired
    private CountryService countryService;

    @ApiOperation(value = "Devuelve la lista de países de la aplicación")
    @GetMapping(path = "/countries", produces="application/json;charset=UTF-8")
    public List<CountryDTO> getAllCountries(){
        return countryService.getAllCountries();
    }
}
