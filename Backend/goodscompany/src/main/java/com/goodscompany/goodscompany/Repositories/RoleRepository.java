package com.goodscompany.goodscompany.Repositories;

import com.goodscompany.goodscompany.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
