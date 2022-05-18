package ru.mirea.userservice.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.services.UserServiceImpl;

@Controller
public class RegistrationController {
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/registration")
    public ResponseEntity registerUser(@RequestBody User user) {
        if (userService.saveUser(user) == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        userService.addRoleToUser(user.getUsername(), "ROLE_USER");
        return new ResponseEntity(HttpStatus.OK);
    }
}
