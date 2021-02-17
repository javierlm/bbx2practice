package com.goodscompany.goodscompany.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.goodscompany.goodscompany.Repositories.UserRepository;
import com.goodscompany.goodscompany.entities.ApplicationUser;
import com.goodscompany.goodscompany.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.SignatureException;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    @Autowired
    private UserRepository userManagement;

    @Autowired
    private Environment environment;

    @Autowired
    private UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl();

    //private final String SECRET = environment.getProperty("jwt.password");

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        UsernamePasswordAuthenticationToken authentication = null;
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer")) {
            chain.doFilter(request, response);
            return;
        }
        try {
            authentication = getAuthentication(request);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch (SignatureException ex) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
        finally {
            chain.doFilter(request, response);
        }
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) throws SignatureException{
        String token = request.getHeader("Authorization");

        if(userManagement == null){
            ServletContext servletContext = request.getServletContext();
            WebApplicationContext webApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
            userManagement = webApplicationContext.getBean(UserRepository.class);
        }

        if (token != null) {
            String user = JWT.require(Algorithm.HMAC512("TopSecretPassword".getBytes()))
                    .build()
                    .verify(token.replace("Bearer", "").trim())
                    .getSubject();
            if (user != null) {
                ApplicationUser userFound = userManagement.findByUsername(user, ApplicationUser.class);
                return new UsernamePasswordAuthenticationToken(userFound, userFound.getPasswordHash(),
                        userDetailsService.getAuthorities(userFound.getRoles()));
            }
            return null;
        }
        return null;
    }
}
