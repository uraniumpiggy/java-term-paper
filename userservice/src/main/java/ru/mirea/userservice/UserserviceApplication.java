package ru.mirea.userservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.mirea.userservice.entities.User;
import ru.mirea.userservice.roles.Role;
import ru.mirea.userservice.services.ImageService;
import ru.mirea.userservice.services.UserService;

import java.util.ArrayList;

@SpringBootApplication
public class UserserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserserviceApplication.class, args);
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner run(UserService userService, ImageService imageService) {
		return args -> {
			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));

			userService.saveUser(new User(null, "John", "john@gmail.com", "1234", new ArrayList<>(), new ArrayList<>(), null));
			userService.saveUser(new User(null, "Arnold", "arnold@gmail.com", "1234", new ArrayList<>(), new ArrayList<>(), null));

			userService.addRoleToUser("john@gmail.com", "ROLE_USER");
			userService.addRoleToUser("arnold@gmail.com", "ROLE_USER");
			userService.addRoleToUser("arnold@gmail.com", "ROLE_ADMIN");	
			imageService.saveUnknownPersonImage();
		};
	}

}
