package com.goodscompany.goodscompany.controller;

import com.goodscompany.goodscompany.dto.SupplierDTO;
import com.goodscompany.goodscompany.entities.Supplier;
import com.goodscompany.goodscompany.services.SupplierService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Api(value = "Controlador de Proveedores")
@RestController
public class SupplierController {
    @Autowired
    SupplierService supplierService;

    @ApiOperation(value = "Devuelve la lista de proveedores")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Invalid ID supplied")})
    @GetMapping("/suppliers")
    public List<SupplierDTO> getAllSuppliers()
    {
        var allSuppliers = supplierService.getAllSuppliers();
        return allSuppliers;
    }

    @ApiOperation(value = "Crea un nuevo proveedor")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Proveedor creado correctamente")})
    @PostMapping("/suppliers")
    public ResponseEntity<SupplierDTO> addNewSupplier(@RequestBody SupplierDTO supplierDTO)
    {
        Supplier savedSupplier = supplierService.addNewSupplier(supplierDTO);
        var supplierToSend = new SupplierDTO(savedSupplier);
        URI uri = MvcUriComponentsBuilder.fromController(getClass())
                .path("/id")
                .buildAndExpand(supplierToSend.getId())
                .toUri();
        return ResponseEntity.created(uri).body(supplierToSend);
    }


//    @GetMapping("/suppliers/cheap")
//    public void chepeastProductPerSupplier()
//    {
//        supplierService.ChepeastProductPerSupplier();
//    }

    @ApiOperation(value = "Actualiza un proveedor")
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Producto actualizado correctamente"),
            @ApiResponse(code = 404, message = "No se encuentra el proveedor especificado") })
    @PutMapping("/suppliers/{supplierId}")
    public ResponseEntity updateProduct(@RequestBody SupplierDTO modifiedSupplier, @PathVariable Long supplierId)
    {
        ResponseEntity updateResult = null;
        try {
            supplierService.updateSupplier(modifiedSupplier, supplierId);
            updateResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (EmptyResultDataAccessException ex){
            updateResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return updateResult;
        }
    }

    @ApiOperation(value = "Borra el proveedor solicitado")
    @ApiResponses(value = {
            @ApiResponse(code = 204, message = "Proveedor borrado correctamente"),
            @ApiResponse(code = 404, message = "No se encuentra el proveedor solicitado") })
    @Secured("ROLE_USERMANAGEMENT")
    @DeleteMapping("/suppliers/{supplierId}")
    public ResponseEntity deleteProduct(@PathVariable Long supplierId)
    {
        ResponseEntity deleteResult = null;
        try {
            supplierService.deleteSupplier(supplierId);
            deleteResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }catch (EmptyResultDataAccessException ex){
            deleteResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return deleteResult;
        }
    }
}
