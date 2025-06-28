package com.dhanesh.auth.portal.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Filter to intercept requests and set authenticated user based on JWT token.
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Get "Authorization" header
        String authHeader = request.getHeader("Authorization");

        // Skip filter if header missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token after "Bearer "
        String token = authHeader.substring(7);

        // Extract username/loginId from token
        String loginId = jwtService.extractLoginId(token);

        // If no loginId or already authenticated, skip
        if (loginId == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginId);

        // Validate the token
        if (!jwtService.validateToken(token, userDetails)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Create authentication object
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Set authentication in context
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Continue the chain
        filterChain.doFilter(request, response);
    }
}
