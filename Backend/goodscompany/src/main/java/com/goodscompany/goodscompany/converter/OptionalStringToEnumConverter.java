package com.goodscompany.goodscompany.converter;

import com.goodscompany.goodscompany.enums.ProductState;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class OptionalStringToEnumConverter implements Converter<Optional<String>, ProductState>{

    @Override
    public ProductState convert(Optional<String> source) {
        try {
            if(!source.isEmpty()){
                return ProductState.valueOf(source.get().toUpperCase());
            }
            else{
                return null;
            }
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
