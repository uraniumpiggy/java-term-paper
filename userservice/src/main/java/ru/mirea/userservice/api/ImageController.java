package ru.mirea.userservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.mirea.userservice.entities.Image;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.repo.ImageRepo;
import ru.mirea.userservice.services.ImageService;
import ru.mirea.userservice.services.UserService;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ImageController {
    @Autowired
    UserService userService;
    @Autowired
    ImageService imageService;

    @PostMapping("/image/save")
    public Long uploadImage(@RequestParam("file") MultipartFile multipartFile) {
        return imageService.saveImage(multipartFile).getId();
    }

    @GetMapping(value = "/image/download/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    Resource downloadImage(@PathVariable Long imageId) {
        return new ByteArrayResource(imageService.getImageById(imageId));
    }

    @PostMapping("/image/user/set/")
    public ResponseEntity setUserAvatar(@RequestParam("file") MultipartFile multipartFile, Authentication authentication) throws IOException {
        Image image = imageService.saveImage(multipartFile);
        if (image == null) {
            ResponseEntity.badRequest();
        }
        userService.setAvatar(authentication.getName(), image);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/image/user/{userId}", produces = MediaType.IMAGE_JPEG_VALUE)
    Resource downloadUserImage(@PathVariable Long userId) {
        return new ByteArrayResource(imageService.getUserImage(userId));
    }

}
