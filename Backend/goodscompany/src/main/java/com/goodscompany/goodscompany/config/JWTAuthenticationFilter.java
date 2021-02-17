package com.goodscompany.goodscompany.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.goodscompany.goodscompany.Repositories.UserRepository;
import com.goodscompany.goodscompany.dto.UserDTO;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.annotation.Resource;
import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    private final String SECRET = "TopSecretPassword";
    private final long EXPIRATION_TIME = 432000000;

    @Autowired
    private UserRepository userManagement;

    @Autowired
    private UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl();

    public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl("/users/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)throws AuthenticationException {
        if(userManagement == null){
            ServletContext servletContext = request.getServletContext();
            WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
            userManagement = webApplicationContext.getBean(UserRepository.class);
        }
        try {
            UserDTO credentials = new ObjectMapper().readValue(request.getInputStream(), UserDTO.class);
            var actualUser = userManagement.findByUsername(credentials.getUsername(), ApplicationUser.class);

            if (actualUser != null)
                return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(credentials.getUsername(),
                    credentials.getPassword(), userDetailsService.getAuthorities(actualUser.getRoles())));
            else
                return null;
        }
        catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication auth) throws IOException {

        var username = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
        UserDTO user = userManagement.findByUsername(username);

        //SECRET = environment.getProperty("jwt.password");

        String token = JWT.create()
                .withSubject(((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername())
                .withClaim("role", user.getRoles().get(0).getName())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(SECRET.getBytes()));
        response.addHeader("Authorization","Bearer " + token);
        response.addHeader("Access-Control-Expose-Headers", "Authorization");

        response.setContentType("application/json");
        String tokenResponse = "{\n" +
                "\"token\": \"" + token + "\"\n" +
                "}";
        response.getWriter().write(tokenResponse);
        response.getWriter().flush();
    }
}
