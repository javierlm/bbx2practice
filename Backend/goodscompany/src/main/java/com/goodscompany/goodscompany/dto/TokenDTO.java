package com.goodscompany.goodscompany.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class TokenDTO {
    String token;

    public void setToken(String newToken){
        this.token = "Bearer " + newToken;
    }
}
