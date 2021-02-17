package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.PriceReductionDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@EqualsAndHashCode
@Entity
public class PriceReduction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    double reducedPrice;
    Date startDate;
    Date endDate;

    @ManyToMany(mappedBy = "priceReductionList", cascade = CascadeType.ALL)
    List<Product> productList = new ArrayList<>();

    public PriceReduction(PriceReductionDTO priceReductionDTO){
        this.id = priceReductionDTO.getId();
        this.reducedPrice = priceReductionDTO.getReducedPrice();
        this.startDate = priceReductionDTO.getStartDate();
        this.endDate = priceReductionDTO.getEndDate();
    }

}
