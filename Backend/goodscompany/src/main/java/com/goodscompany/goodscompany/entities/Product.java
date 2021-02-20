package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.PriceReductionDTO;
import com.goodscompany.goodscompany.dto.ProductDTO;
import com.goodscompany.goodscompany.enums.ProductState;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
@EqualsAndHashCode
@ToString
@Entity
public class Product {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long code;

    @Column(nullable = false)
    private String description;

    private double price;

    @ManyToOne(fetch = FetchType.LAZY)
    private ApplicationUser creator;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "PRODUCT_PRICEREDUCTION",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "pricereduction_id")
    )
    List<PriceReduction> priceReductionList = new ArrayList<>();

    @Enumerated(value = EnumType.STRING)
    @Column(columnDefinition = "varchar(20) default 'ACTIVE'")
    private ProductState state = ProductState.ACTIVE;

    @Column(name = "CREATIONDATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;

    @ManyToMany(fetch = FetchType.LAZY, cascade =
            {
                    CascadeType.DETACH,
                    CascadeType.MERGE,
                    CascadeType.REFRESH,
                    CascadeType.PERSIST
            })
    @JoinTable(name = "PRODUCT_SUPPLIER",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id"),
            indexes = {
                @Index(name = "product_supplier_unique", columnList = "product_id, supplier_id", unique = true)
            }
    )
    private List<Supplier> suppliers = new ArrayList<>();

    @OneToMany(
            mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @OrderBy("id DESC")
    private List<ProductActivationEntry> activationHistory = new ArrayList<>();

    public Product(ProductDTO productDTO) {
        this.code = productDTO.getCode();
        this.description = productDTO.getDescription();
        this.price = productDTO.getPrice();
        this.state = productDTO.getState();
        this.creationDate = productDTO.getCreationDate();
        for (PriceReductionDTO priceReductionDTO : productDTO.getPriceReductionList()) {
            PriceReduction priceReduction = new PriceReduction(priceReductionDTO);
            this.priceReductionList.add(priceReduction);
        }
        /*for (SupplierDTO supplierDTO: productDTO.getSuppliers()) {
            suppliers.add(new Supplier(supplierDTO));
        }*/
    }

    @PrePersist
    protected void onCreate() {
        creationDate = new Date();
    }

    public Product() {
    }

    public void addSuppliersToProduct(List<Supplier> suppliersToAdd) {
        for (Supplier supplier : suppliersToAdd) {
            if (!this.suppliers.contains(supplier)) {
                this.suppliers.add(supplier);
            }
        }
        //this.suppliers.addAll(suppliersToAdd);
    }

    public boolean hasActiveDiscount() {
        boolean result = false;
        if (!priceReductionList.isEmpty()) {
            Date currentDate = new Date();
            List<PriceReduction> filteredPriceReductionList = priceReductionList.stream()
                    .filter(ed -> ed.getStartDate().before(currentDate) && ed.getEndDate().after(currentDate))
                    .collect(Collectors.toList());
            if (filteredPriceReductionList.size() > 0)
                result = true;
        }
        return result;
    }

    public double getDiscountedPrice() {
        double discountedPrice = price;
        if (!priceReductionList.isEmpty()) {
            Date currentDate = new Date();
            List<PriceReduction> filteredPriceReductionList = priceReductionList.stream()
                    .filter(ed -> ed.getStartDate().before(currentDate) && ed.getEndDate().after(currentDate))
                    .collect(Collectors.toList());

            for (PriceReduction priceReduction : filteredPriceReductionList) {
                System.out.println("Aplicando descuento del " + priceReduction.getReducedPrice() + "%");
                discountedPrice -= discountedPrice * (priceReduction.getReducedPrice() / 100);
            }
        }
        System.out.println("Precio final con descuentos: " + discountedPrice);
        return discountedPrice;
    }
}
