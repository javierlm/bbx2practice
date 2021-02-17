package com.goodscompany.goodscompany.Repositories;

import com.goodscompany.goodscompany.entities.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
    public Country findByIsoCode(String isoCode);
}
