package com.goodscompany.goodscompany.dto;

import com.fasterxml.jackson.annotation.JsonEnumDefaultValue;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.goodscompany.goodscompany.entities.PriceReduction;
import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.entities.ProductActivationEntry;
import com.goodscompany.goodscompany.entities.Supplier;
import com.goodscompany.goodscompany.enums.ProductState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

//@JsonIdentityInfo(
//        generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "code")
@Data
@EqualsAndHashCode
@ToString
@NoArgsConstructor
public class ProductDTO {

    private Long code;

    public Long getCode() {
        return code;
    }

    @NotNull
    @NotBlank
    private String description;
    @PositiveOrZero
    private double price;
    @JsonEnumDefaultValue
    private ProductState state = ProductState.ACTIVE;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date creationDate;
    private List<SupplierDTO> suppliers = new ArrayList<>();
    private List<PriceReductionDTO> priceReductionList = new ArrayList<>();
    private List<ProductActivationEntryDTO> activationHistory = new ArrayList<>();

    UserDTO creator;

    public ProductDTO(Product product){
        this.code = product.getCode();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.state = product.getState();
        this.creationDate = product.getCreationDate();
        this.creator = new UserDTO(product.getCreator());

        for (Supplier supplier : product.getSuppliers()) {
            this.suppliers.add(new SupplierDTO(supplier, false));
        }

        for (PriceReduction priceReduction :
                product.getPriceReductionList()) {
            PriceReductionDTO priceReductionDTO = new PriceReductionDTO(priceReduction);
            this.priceReductionList.add(priceReductionDTO);
        }

        for (ProductActivationEntry productActivationEntry :
                product.getActivationHistory()) {
            ProductActivationEntryDTO productActivationEntryDTO = new ProductActivationEntryDTO(productActivationEntry.getId(),
                    productActivationEntry.getDescription(), productActivationEntry.getNewState(),
                    productActivationEntry.getPerformedByApplicationUser().getUsername());
            this.getActivationHistory().add(productActivationEntryDTO);
        }
    }

    public ProductDTO(Product product, boolean complete){
        this.code = product.getCode();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.state = product.getState();
        this.creationDate = product.getCreationDate();

        if(complete){
            for (Supplier supplier : product.getSuppliers()) {
                this.suppliers.add(new SupplierDTO(supplier));
            }
        }

        for (PriceReduction priceReduction :
                product.getPriceReductionList()) {
            PriceReductionDTO priceReductionDTO = new PriceReductionDTO(priceReduction);
            this.priceReductionList.add(priceReductionDTO);
        }

        for (ProductActivationEntry productActivationEntry :
                product.getActivationHistory()) {
            ProductActivationEntryDTO productActivationEntryDTO = new ProductActivationEntryDTO(productActivationEntry.getId(),
                    productActivationEntry.getDescription(), productActivationEntry.getNewState(),
                    productActivationEntry.getPerformedByApplicationUser().getUsername());
            this.getActivationHistory().add(productActivationEntryDTO);
        }
    }

}
