package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.SupplierDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode
@Entity
@NoArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    private Country country;
    //private String country;

    @ManyToMany(mappedBy = "suppliers", cascade =
            {
                    CascadeType.DETACH,
                    CascadeType.MERGE,
                    CascadeType.REFRESH,
                    CascadeType.PERSIST
            })
    List<Product> products = new ArrayList<>();

    public Supplier(SupplierDTO supplierDTO){
        this.id = supplierDTO.getId();
        this.name = supplierDTO.getName();
        this.country = new Country(supplierDTO.getCountry());

//        for (ProductDTO productDTO : supplierDTO.getProducts()) {
//            Product product = new Product(productDTO);
//            this.products.add(product);
//        }
    }

    public List<Product> addProductsToSupplier(List<Product> productsList) {
        List<Product> productListToUpdate = new ArrayList<>();
        for (Product product : productsList) {
            if (!this.products.contains(product)) {
                this.products.add(product);
                //List<Supplier> supplierList = new ArrayList<>();
                //supplierList.add(this);
                //product.addSuppliersToProduct(supplierList);
                productListToUpdate.add(product);
            }
        }
        return productListToUpdate;
        //this.products.addAll(productsList);
    }

    @Override
    public String toString() {
        return "Supplier{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", country='" + country + '\'' +
                '}';
    }
}
