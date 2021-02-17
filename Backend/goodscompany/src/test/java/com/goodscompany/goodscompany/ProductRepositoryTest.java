package com.goodscompany.goodscompany;

import static org.assertj.core.api.Assertions.assertThat;

import com.goodscompany.goodscompany.dto.ProductDTO;
import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.enums.ProductState;
import com.goodscompany.goodscompany.services.ProductService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;

import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
public class ProductRepositoryTest {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private ProductService productService;

    @Test
    public void SaveProductTest() {
        // given
        /*ProductDTO testProduct = new Product();

        Date currentDate = new Date();

        testProduct.setPrice(100.0);
        testProduct.setCreationDate(currentDate);
        testProduct.setState(ProductState.ACTIVE);
        testProduct.setDescription("Test Product");

        testEntityManager.persist(testProduct);
        testEntityManager.flush();

        // when
        Product found = productService.save(testProduct);

        // then
        assertThat(testProduct.getCode()).isNot(null);*/
    }

}
