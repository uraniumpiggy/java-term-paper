package ru.mirea.userservice.services;

import org.springframework.web.multipart.MultipartFile;
import ru.mirea.userservice.entities.Building;
import ru.mirea.userservice.entities.Image;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.roles.Role;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String username, String roleName);
    User getUser(String username);
    List<User> getUsers();
    Image getAvatar(Long id);
    void setAvatar(String username, Image image);
    void addBuildingToUser(String username, Building building, MultipartFile[] images) throws IOException;
    Collection<Building> getBuildings(String username);
    void updateBuilding(String username, Building building, Long id, MultipartFile[] images) throws IOException;
    void deleteBuilding(String username, Long id);
    boolean addAdminRole(Long userId);
    boolean removeAdminRole(Long userId);
    boolean deleteUser(Long userId);
}
