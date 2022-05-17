package ru.mirea.userservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mirea.userservice.entities.Building;

@Repository
public interface BuildingRepo extends JpaRepository<Building, Long> {
}
