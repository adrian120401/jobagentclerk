package com.findjob.job_agent.service;

import com.findjob.job_agent.exception.NotFoundException;
import com.findjob.job_agent.model.dto.*;
import com.findjob.job_agent.model.entity.Interview;
import com.findjob.job_agent.model.entity.JobSearched;
import com.findjob.job_agent.model.entity.User;
import com.findjob.job_agent.model.mapper.InterviewMapper;
import com.findjob.job_agent.model.mapper.UserMapper;
import com.findjob.job_agent.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final UserRepository repository;
    private final FileService fileService;
    private final CloudinaryService cloudinaryService;
    private final InterviewService interviewService;
    private final JobSearchedService jobSearchedService;

    public UserService(
            UserRepository repository,
            FileService fileService,
            CloudinaryService cloudinaryService,
            InterviewService interviewService,
            JobSearchedService jobSearchedService) {
        this.repository = repository;
        this.fileService = fileService;
        this.cloudinaryService = cloudinaryService;
        this.interviewService = interviewService;
        this.jobSearchedService = jobSearchedService;
    }

    public void createUser(UserRequestDTO userRequestDTO) {
        User user = UserMapper.toEntity(userRequestDTO);
        repository.save(user);
    }

    public User getAuthUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return repository.findByClerkId(username).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public UserResponseDTO getMe() {
        return UserMapper.fromEntity(getAuthUser());
    }

    public User getFirstUser() {
        return repository.findAll().getFirst();
    }

    public String uploadDocx(MultipartFile docx) throws IOException {
        User user = getAuthUser();
        String docxPath = uploadFile(docx.getBytes(), docx.getOriginalFilename());
        ResumeProfile resumeProfile = fileService.readCV(docx.getBytes());
        user.setDocx_path(docxPath);
        user.setResumeProfile(resumeProfile);
        repository.save(user);
        return docxPath;
    }

    public String uploadFile(byte[] file, String originalFilename) throws IOException {
        Map<String, String> result = cloudinaryService.uploadFile(file, originalFilename);
        return result.get("url");
    }

    public byte[] getDocx() throws IOException {
        User user = getAuthUser();
        String docxPath = user.getDocx_path();
        if (docxPath == null) {
            throw new NotFoundException("Docx not found");
        }
        return cloudinaryService.downloadFile(docxPath);
    }

    public List<InterviewResponseDTO> getInterviewsByAuthUser() {
        User user = getAuthUser();
        List<Interview> interviews = interviewService.findByUserId(user.getId());
        return interviews.stream().map(interview -> {
            JobSearched jobSearched = jobSearchedService.getById(interview.getJobId());
            return InterviewMapper.toInterviewResponseDTO(interview, jobSearched);
        }).toList();
    }
}
