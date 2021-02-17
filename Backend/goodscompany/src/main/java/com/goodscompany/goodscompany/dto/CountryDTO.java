package com.goodscompany.goodscompany.dto;

import com.goodscompany.goodscompany.entities.Country;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CountryDTO {
    private Long id;
    private String isoCode;
    private String name;

    public CountryDTO(Country country){
        this.id = country.getId();
        this.isoCode = country.getIsoCode();
        this.name = country.getName();
    }
}
