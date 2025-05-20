package com.findjob.job_agent.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.findjob.job_agent.model.dto.ResumeProfile;

import java.util.Collection;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    private String id;
    private String name;
    private String email;
    private String docx_path;
    private ResumeProfile resumeProfile;
    private String role;
    private String clerkId;

    public User(String name, String email, String clerkId) {
        this.name = name;
        this.email = email;
        this.clerkId = clerkId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return email;
    }

}
