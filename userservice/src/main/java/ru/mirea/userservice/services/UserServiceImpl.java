package ru.mirea.userservice.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import ru.mirea.userservice.entities.Building;
import ru.mirea.userservice.entities.Image;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.repo.BuildingRepo;
import ru.mirea.userservice.repo.ImageRepo;
import ru.mirea.userservice.repo.RoleRepo;
import ru.mirea.userservice.repo.UserRepo;
import ru.mirea.userservice.roles.Role;

import java.io.IOException;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional @Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    private final BuildingRepo buildingRepo;
    private final ImageRepo imageRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if (user == null) {
            log.error("User not found in the database");
            throw new UsernameNotFoundException("User not found in the database");
        } else {
            log.info("User found in the database: {}", username);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    @Override
    public User saveUser(User user) {
        User userFromDB = userRepo.findByUsername(user.getUsername());

        if (userFromDB != null) {
            return null;
        }

        log.info("Saving new user {} to The database", user.getName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);

        return user;
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving new role {} to The database", role.getName());
        return roleRepo.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);
        User user = userRepo.findByUsername(username);
        Role role = roleRepo.findByName(roleName);
        user.getRoles().add(role);
    }

    @Override
    public User getUser(String username) {
        log.info("Fetching user {}", username);
        return userRepo.findByUsername(username);
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users");
        return userRepo.findAll();
    }

    @Override
    public Image getAvatar(Long id) {
        Optional<User> user = userRepo.findById(id);
        Long avatarId = user.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)).getAvatarId();
        return imageRepo.findImageById(avatarId);
    }

    @Override
    public void setAvatar(String username, Image image) {
        User user = userRepo.findByUsername(username);
        Long imageId = imageRepo.save(image).getId();
        user.setAvatarId(imageId);
    }

    @Override
    public void addBuildingToUser(String username, Building building, MultipartFile[] images) throws IOException {
        User user = userRepo.findByUsername(username);
        for (int i = 0; i < images.length; i++) {
            Image image = new Image();
            image.setName(images[i].getName());
            image.setContent(images[i].getBytes());
            Long imageId = imageRepo.save(image).getId();
            building.getImageIds().add(imageId);
        }
        building.setUserId(user.getId());
        building.setUserName(user.getName());
        buildingRepo.save(building);
        user.getBuildings().add(building);
    }

    @Override
    public Collection<Building> getBuildings(String username) {
        return userRepo.findByUsername(username).getBuildings();
    }

    @Override
    public void deleteBuilding(String username, Long id) {
        Building building = buildingRepo.getById(id);
        ArrayList<Long> buildingImages = new ArrayList<>(building.getImageIds());
        for (int i = 0; i < buildingImages.size(); i++) {
            imageRepo.deleteById(buildingImages.get(i));
        }
        User user = userRepo.findByUsername(username);
        user.getBuildings().remove(building);
        buildingRepo.deleteById(id);
    }

    @Override
    public void updateBuilding(String username, Building building, Long id, MultipartFile[] images) throws IOException {
        Building buildingFromDB = buildingRepo.getById(id);

        ArrayList<Long> buildingImages = new ArrayList<>(buildingFromDB.getImageIds());
        for (int i = 0; i < buildingImages.size(); i++) {
            imageRepo.deleteById(buildingImages.get(i));
        }
        buildingFromDB.getImageIds().clear();

        for (int i = 0; i < images.length; i++) {
            Image image = new Image();
            image.setName(images[i].getName());
            image.setContent(images[i].getBytes());
            Long imageId = imageRepo.save(image).getId();
            buildingFromDB.getImageIds().add(imageId);
        }

        buildingFromDB.setHeader(building.getHeader());
        buildingFromDB.setContacts(building.getContacts());
        buildingFromDB.setDescription(building.getDescription());
        buildingFromDB.setPrice(building.getPrice());
        buildingFromDB.setLocation(building.getLocation());
        buildingFromDB.setType(building.getType());
    }

    @Override
    public boolean addAdminRole(Long userId) {
        User user = userRepo.findById(userId).get();
        if (user == null) {
            return false;
        }
        Role role = roleRepo.findByName("ROLE_ADMIN");
        user.getRoles().add(role);
        return true;
    }

    @Override
    public boolean removeAdminRole(Long userId) {
        User user = userRepo.findById(userId).get();
        if (user == null) {
            return false;
        }
        Role role = roleRepo.findByName("ROLE_ADMIN");
        user.getRoles().remove(role);
        return true;
    }

    @Override
    public boolean deleteUser(Long userId) {
        User user = userRepo.findById(userId).get();
        for (int i = 0; i < user.getBuildings().size(); i++) {
            Building building = new ArrayList<>(user.getBuildings()).get(i);
            ArrayList<Long> buildingImages = new ArrayList<>(building.getImageIds());
            for (int j = 0; j < buildingImages.size(); j++) {
                imageRepo.deleteById(buildingImages.get(j));
            }
            buildingRepo.deleteById(building.getId());
        }
        userRepo.deleteById(userId);
        return true;
    }
}
