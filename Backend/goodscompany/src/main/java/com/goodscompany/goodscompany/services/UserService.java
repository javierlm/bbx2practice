package com.goodscompany.goodscompany.services;

import com.goodscompany.goodscompany.Repositories.RoleRepository;
import com.goodscompany.goodscompany.Repositories.UserRepository;
import com.goodscompany.goodscompany.dto.ChangePasswordRequestDTO;
import com.goodscompany.goodscompany.dto.UserDTO;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.entities.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public void save(ApplicationUser applicationUser) throws DataIntegrityViolationException {
        userRepository.save(applicationUser);
    }

    public UserDTO update(UserDTO updatedUser) throws DataIntegrityViolationException {
        var foundUSer = userRepository.findById(updatedUser.getId());
        var roleList = updatedUser.getRoles();
        Role specifiedRole = roleRepository.findByName(roleList.get(0).getName());
        if(foundUSer.isPresent() && specifiedRole != null){
            foundUSer.get().setName(updatedUser.getName());
            foundUSer.get().setSurname(updatedUser.getSurname());
            foundUSer.get().setEmail(updatedUser.getEmail());
            foundUSer.get().addExistingRole(specifiedRole);
        }
        var savedUpdatedUser = userRepository.save(foundUSer.get());

//        var roleList = updatedUser.getRoles();
//        Role specifiedRole = roleRepository.findByName(roleList.get(0).getName());
//        if(specifiedRole != null){
//            applicationUser.addExistingRole(specifiedRole);
//        }
        //var savedUpdatedUser = userRepository.save(applicationUser);
        UserDTO savedUpdatedUserDTO = new UserDTO(savedUpdatedUser);
        savedUpdatedUserDTO.setPassword("");
        return savedUpdatedUserDTO;
    }

    public Optional<ApplicationUser> findById(Long userId){
        return userRepository.findById(userId);
    }

    public <T> T findByUsername(String username, Class<T> userType){
        return userRepository.findByUsername(username, userType);
    }

    //TODO: No enviar el hash del password
    public List<UserDTO> getAllUsers(){
        return userRepository.findBy();
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public boolean changeUserPassword(ApplicationUser applicationUser, ChangePasswordRequestDTO changePasswordRequestDTO) {
        if(bCryptPasswordEncoder.matches(changePasswordRequestDTO.getOldPassword(), applicationUser.getPasswordHash())){
            applicationUser.setPasswordHash(bCryptPasswordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
            userRepository.save(applicationUser);
            return true;
        }
        else{
            return false;
        }
    }

    public boolean changePasswordAdmin(Long userId, ChangePasswordRequestDTO changePasswordRequestDTO) {
        var applicationUser = userRepository.findById(userId);
        if(applicationUser.isPresent()){
            applicationUser.get().setPasswordHash(bCryptPasswordEncoder.encode(changePasswordRequestDTO.getNewPassword()));
            userRepository.save(applicationUser.get());
            return true;
        }
        else{
            return false;
        }
    }
}
