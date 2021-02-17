package com.goodscompany.goodscompany.dto;

import com.goodscompany.goodscompany.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDTO {
    private Long id;
    private String name;

    public RoleDTO(Role role) {
        this.id = role.getId();
        this.name = role.getName();
    }

    public RoleDTO(String roleName) {
        this.name = roleName;
    }
}
