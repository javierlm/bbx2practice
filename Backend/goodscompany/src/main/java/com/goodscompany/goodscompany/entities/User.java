package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String username;
    private String email;
    @Column(name = "password")
    private String passwordHash;

    public User(UserDTO userDTO){
        this.name = userDTO.getName();
        this.username = userDTO.getUsername();
        this.surname = userDTO.getSurname();
        this.email = userDTO.getEmail();
        this.passwordHash = userDTO.getPassword();
    }
}
