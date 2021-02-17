package com.goodscompany.goodscompany.Repositories;

import com.goodscompany.goodscompany.dto.UserDTO;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<ApplicationUser, Long> {
    List<UserDTO> findBy();
    UserDTO findByUsername(String username);
    <T> T findByUsername(String username, Class<T> type);

}
