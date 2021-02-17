package com.goodscompany.goodscompany.services;

import com.goodscompany.goodscompany.Repositories.CountryRepository;
import com.goodscompany.goodscompany.dto.CountryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {

    @Autowired
    CountryRepository countryRepository;

    public List<CountryDTO> getAllCountries() {
        var countryList = countryRepository.findAll();
        var countryDTOList = countryList
                .stream()
                .map(CountryDTO::new)
                .collect(Collectors.toList());
        return countryDTOList;
    }
}
