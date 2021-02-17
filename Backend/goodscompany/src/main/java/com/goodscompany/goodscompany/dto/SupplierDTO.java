package com.goodscompany.goodscompany.dto;

import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.entities.Supplier;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/*@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")*/
@Data
@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDTO {
    private Long id;
    private String name;
    private CountryDTO country;
    List<ProductDTO> products = new ArrayList<>();

    public SupplierDTO(Supplier supplier) {
        this.id = supplier.getId();
        this.name = supplier.getName();
        this.country = new CountryDTO(supplier.getCountry());
        for (Product product : supplier.getProducts()) {
            ProductDTO productDTO = new ProductDTO(product);
            this.products.add(productDTO);
        }
    }

    public SupplierDTO(Supplier supplier, boolean complete) {
        this.id = supplier.getId();
        this.name = supplier.getName();
        this.country = new CountryDTO(supplier.getCountry());
        if(complete){
            for (Product product : supplier.getProducts()) {
                ProductDTO productDTO = new ProductDTO(product, false);
                this.products.add(productDTO);
            }
        }
    }
}
