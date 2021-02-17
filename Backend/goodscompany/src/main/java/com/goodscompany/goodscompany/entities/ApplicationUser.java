package com.goodscompany.goodscompany.entities;

import com.goodscompany.goodscompany.dto.UserDTO;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    @Column(name = "password")
    private String passwordHash;

    @OneToMany(
            mappedBy = "creator",
            cascade =
                    {
                            CascadeType.DETACH,
                            CascadeType.MERGE,
                            CascadeType.REFRESH,
                            CascadeType.PERSIST
                    },
            orphanRemoval = true
    )
    private List<Product> createdProducts;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "APPLICATIONUSERS_ROLES",
            joinColumns = @JoinColumn(
                    name = "USER_ID", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "ROLE_ID", referencedColumnName = "id"))
    private Collection<Role> roles = new ArrayList<>();

    public ApplicationUser(UserDTO userDTO) {
        this.name = userDTO.getName();
        this.username = userDTO.getUsername();
        this.surname = userDTO.getSurname();
        this.email = userDTO.getEmail();
        this.passwordHash = userDTO.getPassword();
    }

    public void addExistingRole(Role role) {
        roles.clear();
        roles.add(role);
    }

    @Override
    public String toString() {
        return "ApplicationUser{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
