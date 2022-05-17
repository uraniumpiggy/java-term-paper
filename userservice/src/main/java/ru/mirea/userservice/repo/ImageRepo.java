package ru.mirea.userservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mirea.userservice.entities.Image;

@Repository
public interface ImageRepo extends JpaRepository<Image, Long> {
    Image findImageById(Long id);
}
