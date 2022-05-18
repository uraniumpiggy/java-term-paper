package ru.mirea.userservice.services;

import ru.mirea.userservice.entities.Building;
import java.util.List;

public interface BuildingService {
    List<Building> getAllBuildings();
    Building getBuilding(Long id);
    boolean addCommentToBuilding(Long buildingId, String text, Long userId, String nameOfUser);
    void deleteBuilding(Long id);
    List<Building> getSortedBuildings(Long maxCost, Long minCost, int type);
}
