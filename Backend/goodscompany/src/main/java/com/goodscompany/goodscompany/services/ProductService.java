package com.goodscompany.goodscompany.services;

import com.goodscompany.goodscompany.Repositories.PriceReductionRepository;
import com.goodscompany.goodscompany.Repositories.ProductActivationEntryRepository;
import com.goodscompany.goodscompany.Repositories.ProductRepository;
import com.goodscompany.goodscompany.dto.PriceReductionDTO;
import com.goodscompany.goodscompany.dto.ProductDTO;
import com.goodscompany.goodscompany.dto.SupplierDTO;
import com.goodscompany.goodscompany.entities.*;
import com.goodscompany.goodscompany.enums.ProductState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private PriceReductionRepository priceReductionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductActivationEntryRepository activationEntryRepository;


    public List<ProductDTO> findAll(Optional<ProductState> state) {
        if(state.isEmpty()){
            List<Product> productList = productRepository.findAll();
            List<ProductDTO> productDTOList = new ArrayList<>();
            for (Product product : productList) {
                productDTOList.add(new ProductDTO(product));
            }
            return productDTOList;

        }
        else{
            List<Product> productList = productRepository.findByState(state.get());
            List<ProductDTO> productDTOList = new ArrayList<>();
            for (Product product : productList) {
                productDTOList.add(new ProductDTO(product));
            }
            return productDTOList;
        }
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(ProductDTO newProduct) {
        Product product = new Product(newProduct);

        var suppliersIdList = newProduct
                .getSuppliers()
                .stream()
                .map(SupplierDTO::getId)
                .collect(Collectors.toList());

        var suppliersList = supplierService.findAllByIds(suppliersIdList);
        product.addSuppliersToProduct(suppliersList);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null){
            //Obtiene el nombre de usuario de la request actual
            var userThing = (ApplicationUser)authentication.getPrincipal();
            var foundUser = userService.findByUsername(userThing.getUsername(), ApplicationUser.class);
            product.setCreator(foundUser);
        }
        return productRepository.save(product);
    }

    public List<Product> findAllByIds(List<Long> idsList){
        return productRepository.findByCodeIn(idsList);
    }

    @Transactional
    public Product addActivationEntryToProduct(Product product, ProductActivationEntry productActivationEntry){
        ProductState newState = product.getState().toggle();
        productActivationEntry.setNewState(newState);
        product.setState(newState);
        activationEntryRepository.save(productActivationEntry);
        return productRepository.save(product);
    }

    //TODO: Añadir los descuentos nuevos
    public Product update(ProductDTO newProduct, Long productId) {
        var productToModify = productRepository.findById(productId);
        if(!productToModify.isEmpty() && productToModify.get().getState() == ProductState.ACTIVE){
            productToModify.get().setDescription(newProduct.getDescription());
            productToModify.get().setCreationDate(newProduct.getCreationDate());
            if(productToModify.get().getState() != newProduct.getState()){

            }
            productToModify.get().setState(newProduct.getState());
            productToModify.get().setPrice(newProduct.getPrice());

            var suppliersIdList = newProduct
                    .getSuppliers()
                    .stream()
                    .map(SupplierDTO::getId)
                    .collect(Collectors.toList());

            var suppliersList = supplierService.findAllByIds(suppliersIdList);
            productToModify.get().addSuppliersToProduct(suppliersList);

            //productToModify.get().setActivationHistory();
            //productToModify.get().setDescription(newProduct.getDescription());
        }
        return productRepository.save(productToModify.get());
    }

    @Transactional
    public boolean addSupplierToProduct(Long id, Supplier mySupplier){
        Optional<Product> product = productRepository.findById(id);
        if(!product.isEmpty()){
            Supplier supplier = supplierService.getSupplierByName(mySupplier);
            product.get().getSuppliers().add(supplier);
            productRepository.save(product.get());
            return true;
        }
        return false;
    }

    @Transactional
    public boolean addPriceReductionToProduct(Long productId, PriceReductionDTO priceReductionDTO) {
        Optional<Product> product = productRepository.findById(productId);
        if(!product.isEmpty()){
            if(!product.get().hasActiveDiscount()){
                PriceReduction priceReduction = new PriceReduction(priceReductionDTO);
                priceReductionRepository.save(priceReduction);

                product.get().getPriceReductionList().add(priceReduction);
                productRepository.save(product.get());
                return true;
            }
            else
                System.err.println("El producto ya tiene un descuento activo. No se puede añadir uno nuevo");
        }
        return false;
    }

    public void deleteProduct(Long productId) throws EmptyResultDataAccessException {
        productRepository.deleteById(productId);
    }
}
