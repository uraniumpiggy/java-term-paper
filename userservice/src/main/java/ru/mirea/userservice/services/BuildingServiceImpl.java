package ru.mirea.userservice.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mirea.userservice.entities.Building;
import ru.mirea.userservice.entities.Comment;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.repo.BuildingRepo;
import ru.mirea.userservice.repo.CommentRepo;
import ru.mirea.userservice.repo.ImageRepo;
import ru.mirea.userservice.repo.UserRepo;

import java.util.ArrayList;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional @Slf4j
public class BuildingServiceImpl implements BuildingService {
    @Autowired
    BuildingRepo buildingRepo;
    @Autowired
    CommentRepo commentRepo;
    @Autowired
    ImageRepo imageRepo;
    @Autowired
    UserRepo userRepo;

    @Override
    public List<Building> getAllBuildings() {
        return buildingRepo.findAll();
    }

    @Override
    public Building getBuilding(Long id) {
        Building building = buildingRepo.findById(id).get();
        return building;
    }

    @Override
    public boolean addCommentToBuilding(Long buildingId, String text, Long userId, String nameOfUser) {
        Building building = buildingRepo.findById(buildingId).get();

        if (building == null) {
            return false;
        }

        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setNameOfUser(nameOfUser);
        comment.setText(text);

        commentRepo.save(comment);

        building.getComments().add(comment);
        return true;
    }

    @Override
    public void deleteBuilding(Long id) {
        Building building = buildingRepo.findById(id).get();
        ArrayList<Long> buildingImages = new ArrayList<>(building.getImageIds());
        for (int i = 0; i < buildingImages.size(); i++) {
            imageRepo.deleteById(buildingImages.get(i));
        }
        User user = userRepo.getById(building.getUserId());
        user.getBuildings().remove(building);
        buildingRepo.deleteById(id);
    }
}
