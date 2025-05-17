package com.findjob.job_agent.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.*;
import com.nimbusds.jwt.proc.*;
import com.nimbusds.jwt.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URL;
import java.util.Collections;

@Component
public class ClerkAuthFilter extends OncePerRequestFilter {

    private static final String CLERK_JWKS_URL = "https://cuddly-wombat-22.clerk.accounts.dev/.well-known/jwks.json";

    private final JWKSource<com.nimbusds.jose.proc.SecurityContext> keySource;

    public ClerkAuthFilter() throws Exception {
        this.keySource = new RemoteJWKSet<>(new URL(CLERK_JWKS_URL));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            ConfigurableJWTProcessor<com.nimbusds.jose.proc.SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();
            JWSKeySelector<com.nimbusds.jose.proc.SecurityContext> keySelector =
                    new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, keySource);
            jwtProcessor.setJWSKeySelector(keySelector);

            JWTClaimsSet claimsSet = jwtProcessor.process(token, null);

            String clerkId = claimsSet.getStringClaim("sub");

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(clerkId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            System.out.println("Error processing token: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
