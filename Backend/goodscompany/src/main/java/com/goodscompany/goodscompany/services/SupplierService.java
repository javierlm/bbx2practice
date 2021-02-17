package com.goodscompany.goodscompany.services;

import com.goodscompany.goodscompany.Repositories.CountryRepository;
import com.goodscompany.goodscompany.Repositories.ProductRepository;
import com.goodscompany.goodscompany.Repositories.SupplierRepository;
import com.goodscompany.goodscompany.dto.ProductDTO;
import com.goodscompany.goodscompany.dto.SupplierDTO;
import com.goodscompany.goodscompany.entities.Country;
import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.entities.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CountryRepository countryRepository;

    public List<SupplierDTO> getAllSuppliers(){
        List<Supplier> allSuppliers = supplierRepository.findAll();
        List<SupplierDTO> supplierDTOList = new ArrayList<>();
        for (Supplier supplier : allSuppliers) {
            supplierDTOList.add(new SupplierDTO(supplier));
        }
        return supplierDTOList;
    }

    public Supplier getSupplierByName(Supplier supplier){
        var byName = supplierRepository.findByName(supplier.getName());
        return byName;
    }

    @Transactional
    public Supplier addNewSupplier(SupplierDTO newSupplier){
        Supplier supplier = new Supplier(newSupplier);

        var productsIdList = newSupplier
                .getProducts()
                .stream()
                .map(ProductDTO::getCode)
                .collect(Collectors.toList());

        var productsList = productService.findAllByIds(productsIdList);
        //var productsList = productService.findAllByIds(productsIdList);
        var myList = supplier.addProductsToSupplier(productsList);
        var savedSupplier = supplierRepository.save(supplier);
        for (Product product : myList) {
            List<Supplier> supplierList = new ArrayList<>();
            supplierList.add(savedSupplier);
            product.addSuppliersToProduct(supplierList);
            productRepository.save(product);
        }

        return savedSupplier;
    }

    public void ChepeastProductPerSupplier(){
        var thing = supplierRepository.findCheapestProductPerSupplier();
    }

    public List<Supplier> findAllByIds(List<Long> idsList){
        return supplierRepository.findByIdIn(idsList);
    }

    @Secured({"ROLE_USERMANAGEMENT"})
    @Transactional
    public void deleteSupplier(Long supplierId) throws EmptyResultDataAccessException {
        supplierRepository.DeleteSupplierAssosiations(supplierId);
        supplierRepository.deleteById(supplierId);
    }

    //TODO: Falta añadir el seteo de los productos del proveedor
    public void updateSupplier(SupplierDTO modifiedSupplier, Long supplierId) {
        var supplierToModify = supplierRepository.findById(supplierId);
        if(supplierToModify.isPresent()){
            supplierToModify.get().setName(modifiedSupplier.getName());
            Country newCountry = countryRepository.findByIsoCode(modifiedSupplier.getCountry().getIsoCode());
            supplierToModify.get().setCountry(newCountry);

            var productsIdList = modifiedSupplier
                    .getProducts()
                    .stream()
                    .map(ProductDTO::getCode)
                    .collect(Collectors.toList());

            var productsList = productService.findAllByIds(productsIdList);
            supplierToModify.get().addProductsToSupplier(productsList);

            supplierRepository.save(supplierToModify.get());
        }
    }
}
