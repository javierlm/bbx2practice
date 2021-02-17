package com.goodscompany.goodscompany.dto;

import com.goodscompany.goodscompany.enums.ProductState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductActivationEntryDTO {
    private long id;
    private String description;
    private ProductState newState;
    private String performedByUser;
}
