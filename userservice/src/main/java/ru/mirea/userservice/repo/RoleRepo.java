package ru.mirea.userservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.mirea.userservice.roles.Role;

public interface RoleRepo extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
