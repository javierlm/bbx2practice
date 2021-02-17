package com.goodscompany.goodscompany.controller;


import com.goodscompany.goodscompany.Repositories.RoleRepository;
import com.goodscompany.goodscompany.dto.ChangePasswordRequestDTO;
import com.goodscompany.goodscompany.dto.TokenDTO;
import com.goodscompany.goodscompany.dto.UserDTO;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.entities.Role;
import com.goodscompany.goodscompany.services.UserService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
public class LoginController {

    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private Environment environment;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    @ApiOperation(value = "Permite al usuario loguearse en la aplicación, devolviéndole un token de acceso")
    @PutMapping("/users/gettoken")
    public TokenDTO loginUser(@RequestBody UserDTO userDTO) {
        String urlBaseEndpoint = environment.getProperty("url.baseendpoint");
        String url = urlBaseEndpoint + "/api/users/login";
        HttpEntity<UserDTO> entity = new HttpEntity<>(userDTO, null);
        ResponseEntity<TokenDTO> response = this.restTemplate.exchange(url, HttpMethod.PUT, entity, TokenDTO.class, new ArrayList<>());
        return response.getBody();
    }

    @ApiOperation(value = "Devuelve la lista de usuarios registrados en la aplicación")
    @GetMapping("/users")
    @Secured("ROLE_USERMANAGEMENT")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "El usuario se ha creado correctamente"),
            @ApiResponse(code = 409, message = "Alguno de los datos ya pertenece a un usuario registrado") })
    @ApiOperation(value = "Registra un nuevo usuario en la aplicación. (Sólo administradores)")
    @PostMapping("/users/signup")
    @Secured("ROLE_USERMANAGEMENT")
    public ResponseEntity<UserDTO> signUp(@Valid @RequestBody UserDTO userDTO) {
        ResponseEntity<UserDTO> result = null;
        userDTO.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        ApplicationUser applicationUser = new ApplicationUser(userDTO);
        try {
            var roleList = userDTO.getRoles();
            Role specifiedRole = roleRepository.findByName(roleList.get(0).getName());
            if(specifiedRole != null){
                applicationUser.addExistingRole(specifiedRole);
            }
            userService.save(applicationUser);
            userDTO.setPassword("");
            URI uri = MvcUriComponentsBuilder.fromController(getClass())
                    .path("/id")
                    .buildAndExpand(userDTO.getUsername())
                    .toUri();
            result = ResponseEntity.created(uri).body(userDTO);
        } catch (DataIntegrityViolationException ex){
            result = ResponseEntity.status(HttpStatus.CONFLICT).build();
            ex.printStackTrace();
        }
        finally {
            return result;
        }
    }

    @ApiOperation(value = "Actualiza un usuario")
    @PutMapping("/users/{userId}")
    @Secured("ROLE_USERMANAGEMENT")
    public ResponseEntity<UserDTO> update(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        ResponseEntity<UserDTO> result = null;

        try {
            var savedUpdatedUserDTO = userService.update(userDTO);
            URI uri = MvcUriComponentsBuilder.fromController(getClass())
                    .path("/users/" + userId)
                    .buildAndExpand(userDTO.getUsername())
                    .toUri();
            result = ResponseEntity.created(uri).body(savedUpdatedUserDTO);
        } catch (DataIntegrityViolationException ex){
            result = ResponseEntity.status(HttpStatus.CONFLICT).build();
            ex.printStackTrace();
        }
        finally {
            return result;
        }
    }

    @ApiOperation(value = "Borra el usuario registrado especificado")
    @DeleteMapping("/users/{userId}")
    @Secured("ROLE_USERMANAGEMENT")
    public ResponseEntity deleteUser(@PathVariable Long userId) {
        ResponseEntity deleteResult = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null){
                //Obtiene el nombre de usuario de la request actual. No se puede eliminar un usuario a sí mismo
                var userOfRequest = (ApplicationUser)authentication.getPrincipal();
                var foundUser = userService.findByUsername(userOfRequest.getUsername(), ApplicationUser.class);
                var userToDelete = userService.findById(userId);
                if(userToDelete.isPresent() && foundUser.getUsername() != userToDelete.get().getUsername()){
                    userService.deleteUser(userId);
                    deleteResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
                }
                else{
                    deleteResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }
        }catch (EmptyResultDataAccessException ex){
            deleteResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return deleteResult;
        }
    }

    @ApiOperation(value = "Permite a un administrador cambiar la contraseña a un determinado usuario")
    @Secured("ROLE_USERMANAGEMENT")
    @PutMapping("/users/{userId}/changePasswordAdmin")
    public ResponseEntity changePasswordAdmin(@PathVariable Long userId, @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        ResponseEntity changePasswordResult = null;
        try {
                boolean result = userService.changePasswordAdmin(userId, changePasswordRequestDTO);
                if(result == true){
                    changePasswordResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
                }
                else{
                    changePasswordResult = new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
        }catch (EmptyResultDataAccessException ex){
            changePasswordResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return changePasswordResult;
        }
    }

    @ApiOperation(value = "Permite a un usuario cambiar su contraseña actual por una nueva")
    @PutMapping("/users/changePassword")
    public ResponseEntity changeUserPassword(@RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        ResponseEntity changePasswordResult = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null){
                var userOfRequest = (ApplicationUser)authentication.getPrincipal();
                var foundUser = userService.findByUsername(userOfRequest.getUsername(), ApplicationUser.class);
                boolean result = userService.changeUserPassword(foundUser, changePasswordRequestDTO);
                if(result == true){
                    changePasswordResult = new ResponseEntity<>(HttpStatus.NO_CONTENT);
                }
                else{
                    changePasswordResult = new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
            }
        }catch (EmptyResultDataAccessException ex){
            changePasswordResult = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }finally {
            return changePasswordResult;
        }
    }

}
