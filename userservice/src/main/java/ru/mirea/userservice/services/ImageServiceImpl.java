package ru.mirea.userservice.services;

import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mirea.userservice.entities.Image;
import ru.mirea.userservice.repo.ImageRepo;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

@Service @Transactional @Slf4j
public class ImageServiceImpl implements ImageService {
    private Long unknownPicId;

    @Autowired
    ImageRepo imageRepo;
    @Autowired
    UserService userService;

    @Override
    public void saveUnknownPersonImage() throws IOException {
//        File unknownUserPhoto = new File("src/main/resources/static/images/unknown_person.jpg");
        Image photo = new Image();
        photo.setName("unknown_person");
//        photo.setContent(Files.readAllBytes(unknownUserPhoto.toPath()));
        photo.setContent(getClass().getResourceAsStream("/static/images/unknown_person.jpg").readAllBytes());
        Long id = imageRepo.save(photo).getId();
        this.unknownPicId = id;
    }

    @Override
    public byte[] getImageById(Long id) {
        Image image = imageRepo.findById(id).get();
        if (image == null) {
            return imageRepo.findById(this.unknownPicId).get().getContent();
        }
        return image.getContent();
    }

    @Override
    public byte[] getUserImage(Long userId) {
        Image imageFromDB = userService.getAvatar(userId);
        if (imageFromDB == null) {
            return imageRepo.findById(this.unknownPicId).get().getContent();
        }
        return imageFromDB.getContent();
    }

    @Override
    public Image saveImage(MultipartFile multipartFile) {
        Image image = new Image();
        image.setName(multipartFile.getName());
        try {
            image.setContent(multipartFile.getBytes());
            return imageRepo.save(image);
        } catch (IOException error) {
            log.error("Save image error" + error.getMessage());
        }
        return null;
    }
}
