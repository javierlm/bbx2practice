package com.goodscompany.goodscompany.controller;

import com.goodscompany.goodscompany.dto.PriceReductionDTO;
import com.goodscompany.goodscompany.dto.ProductActivationEntryDTO;
import com.goodscompany.goodscompany.dto.ProductDTO;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.entities.Product;
import com.goodscompany.goodscompany.entities.ProductActivationEntry;
import com.goodscompany.goodscompany.entities.Supplier;
import com.goodscompany.goodscompany.enums.ProductState;
import com.goodscompany.goodscompany.services.ProductService;
import com.goodscompany.goodscompany.services.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@Validated
@RestController
public class ProductController {

    @Autowired
    ProductService productService;
    @Autowired
    UserService userService;

    @ApiOperation(value = "Devuelve la lista de productos")
    @GetMapping("/products")
    public List<ProductDTO> getAllProducts(@RequestParam Optional<ProductState> state)
    {
        return productService.findAll(state);
    }

    @ApiOperation(value = "Devuelve la los datos del producto seleccionado")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "La solicitud se ha completado correctamente y se devuelven sus datos"),
            @ApiResponse(code = 404, message = "No se encuentra el producto especificado") })
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id)
    {
        var productDTO = Optional.empty();
        var result = productService.findById(id);
        if(result.isPresent()){
            System.out.println("Descuentos");
            result.get().getDiscountedPrice();
            productDTO = Optional.of(new ProductDTO(result.get()));
            return new ResponseEntity<>((ProductDTO) productDTO.get(), HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();
    }

    @ApiOperation(value = "Agrega un proveedor al producto especificado")
    @PutMapping("/products/{productId}/suppliers")
    public boolean addSupplierToProduct(@PathVariable Long productId, @RequestBody Supplier name)
    {
        return productService.addSupplierToProduct(productId, name);
    }

    @ApiOperation(value = "Agrega un descuento al producto especificado")
    @PutMapping("/products/{productId}/pricereduction")
    public boolean addPriceReductionToProduct(@PathVariable Long productId, @RequestBody PriceReductionDTO priceReductionDTO)
    {
        return productService.addPriceReductionToProduct(productId, priceReductionDTO);
    }

    @ApiOperation(value = "Crea un nuevo producto")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Producto creado correctamente")})
    @PostMapping("/products")
    public ResponseEntity<ProductDTO> saveNewProduct(@Valid @RequestBody ProductDTO newProduct)
    {
        Product savedProduct = productService.save(newProduct);
        ProductDTO productDTO = new ProductDTO(savedProduct);
        URI uri = MvcUriComponentsBuilder.fromController(getClass())
                .path("/id")
                .buildAndExpand(productDTO.getCode())
                .toUri();
        return ResponseEntity.created(uri).body(productDTO);
    }

    @ApiOperation(value = "Devuelve la lista de productos")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Se ha añadido un registro nuevo de activación al producto"),
            @ApiResponse(code = 404, message = "No se encuentra el producto especificado") })
    @PostMapping("/products/{productId}/deactivate")
    public ResponseEntity<ProductDTO> deactivateProduct(@RequestBody ProductActivationEntryDTO activationEntry,
                                                        @PathVariable Long productId,
                                                        @RequestHeader(name="Authorization") String token)
    {
        //Se obtiene el producto, si existe
        var foundProduct = productService.findById(productId);
        if(foundProduct.isPresent()){
            ProductActivationEntry productActivationEntry = new ProductActivationEntry();
            productActivationEntry.setDescription(activationEntry.getDescription());
            productActivationEntry.setProduct(foundProduct.get());

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null){
                //Obtiene el nombre de usuario de la request actual
                var userThing = (ApplicationUser)authentication.getPrincipal();
                var foundUser = userService.findByUsername(userThing.getUsername(), ApplicationUser.class);
                productActivationEntry.setPerformedByApplicationUser(foundUser);
            }
            foundProduct.get().getActivationHistory().add(productActivationEntry);

            Product modifiedProduct = productService.addActivationEntryToProduct(foundProduct.get() , productActivationEntry);

            ProductDTO productDTO = new ProductDTO(modifiedProduct);

            URI uri = MvcUriComponentsBuilder.fromController(getClass())
                    .path("/id")
                    .buildAndExpand(productDTO.getCode())
                    .toUri();
            return ResponseEntity.created(uri).body(productDTO);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @ApiOperation(value = "Actualiza el producto especificado")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Producto actualizado correctamente")})
    @PutMapping("/products/{productId}")
    public ProductDTO updateProduct(@Valid @RequestBody ProductDTO modifiedProduct, @PathVariable Long productId)
    {
        Product savedProduct = productService.update(modifiedProduct, productId);
        return new ProductDTO(savedProduct);
    }

    @ApiOperation(value = "Borra el producto especificado")
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Se ha borrado correctamente el producto"),
            @ApiResponse(code = 404, message = "Producto no encontrado") })
    @Secured({"ROLE_USERMANAGEMENT"})
    @DeleteMapping("/products/{productId}")
    public ResponseEntity deleteProduct(@PathVariable Long productId)
    {
        ResponseEntity deleteResult = null;
        try {
            productService.deleteProduct(productId);
            deleteResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (EmptyResultDataAccessException ex){
            deleteResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return deleteResult;
        }
    }


}
