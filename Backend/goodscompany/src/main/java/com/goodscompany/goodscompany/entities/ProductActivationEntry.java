package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.enums.ProductState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProductActivationEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String description;

    @OneToOne
    ApplicationUser performedByApplicationUser;

    @ManyToOne(fetch = FetchType.LAZY)
    Product product;

    ProductState newState;

}
