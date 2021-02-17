package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.CountryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, name = "isoCode")
    private String isoCode;
    private String name;

    public Country(CountryDTO countryDTO){
        this.id = countryDTO.getId();
        this.isoCode = countryDTO.getIsoCode();
        this.name = countryDTO.getName();
    }
}
