package ru.mirea.userservice.api;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mirea.userservice.entities.Building;
import ru.mirea.userservice.repo.BuildingRepo;
import ru.mirea.userservice.services.BuildingService;
import ru.mirea.userservice.services.UserService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class BuildingController {
    @Autowired
    UserService userService;
    @Autowired
    BuildingRepo buildingRepo;
    @Autowired
    BuildingService buildingService;

    @PostMapping("/building/set")
    public ResponseEntity addBuildingToUser(
            Authentication authentication,
            @ModelAttribute Building building,
            @RequestParam("files") MultipartFile[] files) {
        String username = authentication.getName();
        try {
            userService.addBuildingToUser(username, building, files);
        } catch (IOException error) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/buildings")
    public ResponseEntity<Collection<Building>> getUserBuildings(Authentication authentication) {
        Collection<Building> buildings = userService.getBuildings(authentication.getName());
        return ResponseEntity.ok(buildings);
    }

    @GetMapping("/building/get/{id}")
    public ResponseEntity<Building> getBuilding(@PathVariable Long id) {
        Building building = buildingService.getBuilding(id);
        return ResponseEntity.ok().body(building);
    }

    @DeleteMapping("/building/{id}")
    public ResponseEntity deleteBuilding(Authentication authentication, @PathVariable Long id) {
        userService.deleteBuilding(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/building/{id}", method = RequestMethod.PUT)
    public ResponseEntity updateBuilding(Authentication authentication,
                                         @PathVariable Long id,
                                         @ModelAttribute Building building,
                                         @RequestParam("files") MultipartFile[] files) {
        String username = authentication.getName();
        try {
            userService.updateBuilding(username, building, id, files);
        } catch (IOException error) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buildings")
    public ResponseEntity getAllBuildings() {
        return ResponseEntity.ok().body(buildingService.getAllBuildings());
    }

    @PostMapping(value = "/building/comment")
    public ResponseEntity addComment(@RequestBody CommentData commentData, Authentication authentication) {
        String userName = userService.getUser(authentication.getName()).getName();
        if (buildingService.addCommentToBuilding(commentData.buildingId, commentData.text, commentData.userId, userName)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/building/delete/{id}")
    public ResponseEntity<?> deleteBuilding(@PathVariable Long id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/buildings/sorted")
    public ResponseEntity<?> getSortedBuildings(
            @RequestParam(name = "minCost") Long minCost,
            @RequestParam(name = "maxCost") Long maxCost,
            @RequestParam(name = "type") int type) {
        List<Building> result = buildingService.getAllBuildings().stream()
                .filter(
                     item -> {
                         if (minCost == -1 && maxCost == -1) {
                             return true;
                         } else if (minCost != -1 && maxCost == -1 && item.getPrice() >= minCost) {
                             return true;
                         } else if (maxCost != -1 && minCost == -1 && item.getPrice() <= maxCost) {
                             return true;
                         } else if (minCost != -1 && maxCost != -1 && item.getPrice() >= minCost && item.getPrice() <= maxCost) {
                             return true;
                         } else {
                             return false;
                         }
                     }
                )
                .filter(
                        item -> item.getType() == type || type == -1
                )
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(result);
    }

}

@Data
class CommentData {
    public Long buildingId;
    public String text;
    public Long userId;
}