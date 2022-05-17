package ru.mirea.userservice.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mirea.userservice.entities.Comment;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {
}
