package com.goodscompany.goodscompany.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Collection;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    @ManyToMany(mappedBy = "roles")
    private Collection<ApplicationUser> users;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "ROLES_PERMISSIONS",
            joinColumns = @JoinColumn(
                    name = "ROLE_ID", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "PERMISSION_ID", referencedColumnName = "id"))
    private Collection<Permission> permissions;

    @Override
    public String toString() {
        return name;
    }
}
