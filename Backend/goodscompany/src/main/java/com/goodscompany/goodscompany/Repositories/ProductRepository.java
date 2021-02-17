package com.goodscompany.goodscompany.Repositories;

import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.enums.ProductState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public List<Product> findByState(ProductState productState);
    List<Product> findByCodeIn(List<Long> ids);
}
