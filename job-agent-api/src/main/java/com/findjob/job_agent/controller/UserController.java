package com.findjob.job_agent.controller;

import com.findjob.job_agent.model.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.findjob.job_agent.service.UserService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody @Validated UserRequestDTO userRequestDTO) {
        userService.createUser(userRequestDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public UserResponseDTO getMe(){
        return userService.getMe();
    }

    @PostMapping("/docx")
    public ResponseEntity<Map<String, String>> uploadDocx(@RequestParam("file") MultipartFile file) throws IOException {
        String url = userService.uploadDocx(file);

        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewResponseDTO>> getInterviewResponseDTOs() {
        List<InterviewResponseDTO> interviews = userService.getInterviewsByAuthUser();
        return ResponseEntity.ok(interviews);
    }
}
