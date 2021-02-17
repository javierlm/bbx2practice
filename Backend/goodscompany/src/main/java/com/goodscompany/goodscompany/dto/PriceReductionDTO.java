package com.goodscompany.goodscompany.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.goodscompany.goodscompany.entities.PriceReduction;
import lombok.*;

import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class PriceReductionDTO {
    Long id;
    @NotNull
    @NotBlank
    double reducedPrice;
    @PastOrPresent
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    Date startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @FutureOrPresent
    Date endDate;
    @JsonIgnore
    List<Long> productList = new ArrayList<>();

    public PriceReductionDTO(PriceReduction priceReduction){
        this.id = priceReduction.getId();
        this.reducedPrice = priceReduction.getReducedPrice();
        this.startDate = priceReduction.getStartDate();
        this.endDate = priceReduction.getEndDate();
    }

}
