package ru.mirea.userservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mirea.userservice.entities.Image;
import ru.mirea.userservice.entities.User;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);

}
