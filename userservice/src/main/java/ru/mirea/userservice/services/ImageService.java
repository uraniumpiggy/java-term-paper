package ru.mirea.userservice.services;

import org.springframework.web.multipart.MultipartFile;
import ru.mirea.userservice.entities.Image;

import java.io.IOException;

public interface ImageService {
    void saveUnknownPersonImage() throws IOException;
    byte[] getImageById(Long id);
    byte[] getUserImage(Long userId);
    Image saveImage(MultipartFile multipartFile);
}
