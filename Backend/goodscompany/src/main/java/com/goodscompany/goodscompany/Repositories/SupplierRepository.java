package com.goodscompany.goodscompany.Repositories;

import com.goodscompany.goodscompany.dto.SupplierDTO;
import com.goodscompany.goodscompany.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    public List<SupplierDTO> findBy();
    public Supplier findByName(String name);
    List<Supplier> findByIdIn(List<Long> ids);

    @Modifying
    @Query(value = "DELETE FROM PRODUCT_SUPPLIER ps WHERE ps.supplier_id = :id", nativeQuery = true)
    public int DeleteSupplierAssosiations(@Param("id") Long supplier_id);

    //@Query("SELECT MIN(p.price) FROM Supplier s JOIN s.products p GROUP BY Supplier")
    @Query("SELECT p FROM Supplier s JOIN s.products p GROUP BY Supplier ORDER BY p.price DESC")
    //@Query("SELECT MIN(s.price) FROM Supplier.products s GROUP BY Supplier")
    //@Query("SELECT Supplier FROM Supplier WHERE min(product.price) GROUP BY Supplier")
    public List<Object> findCheapestProductPerSupplier();

    //public List<Supplier> findSuppliersWithItemsReduced();
}
