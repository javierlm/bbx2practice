package com.goodscompany.goodscompany.dto;

import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    @NotNull
    @NotBlank
    private String name;
    @NotNull
    @NotBlank
    private String surname;

    @NotNull
    @NotBlank
    private String username;
    @Email(message = "Email should be valid")
    private String email;

    @NotNull
    @NotBlank
    private String password;

    private List<RoleDTO> roles = new ArrayList<>();

    public UserDTO(ApplicationUser applicationUser){
        this.id = applicationUser.getId();
        this.name = applicationUser.getName();
        this.surname = applicationUser.getSurname();
        this.username = applicationUser.getUsername();
        this.email = applicationUser.getEmail();
        //this.password = applicationUser.getPasswordHash();
        for (Role role : applicationUser.getRoles()) {
            RoleDTO roleDTO = new RoleDTO(role);
            this.roles.add(roleDTO);
        }
    }
}
