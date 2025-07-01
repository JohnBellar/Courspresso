package com.dhanesh.auth.portal.dto.auth;

import java.util.Date;

import com.dhanesh.auth.portal.entity.AuthProvider;

public record SigninResponse(
    String userId, 
    String loginId,
    String role,
    String token,
    Date expiresAt,
    AuthProvider authProvider
) {}
