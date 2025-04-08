package org.example.springproject;

import lombok.RequiredArgsConstructor;
import org.example.springproject.dao.RoleDao;
import org.example.springproject.dao.UserDao;
import org.example.springproject.entity.Role;
import org.example.springproject.entity.User;
import org.example.springproject.service.UserService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.system.ApplicationPid;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.stream.Collectors;

@SpringBootApplication
@RequiredArgsConstructor
public class SpringProjectApplication {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final RoleDao roleDao;

    @Bean
    @Profile("dev")
    public ApplicationRunner runner(){
        return args ->{
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            roleDao.save(adminRole);
            Role userRole = new Role();
            userRole.setRoleName("ROLE_USER");
            roleDao.save(userRole);

            User mary = new User();
            mary.setUsername("mary01");
            mary.setPassword(passwordEncoder.encode("12345"));
            mary.setEmail("mary01@gmail.com");
            mary.addRole(userRole);
            userDao.save(mary);

            User john = new User();
            john.setUsername("john01");
            john.setPassword(passwordEncoder.encode("12345"));
            john.setEmail("john01@gmail.com");
            john.addRole(userRole);
            userDao.save(john);



        };
    }
    @Bean
    public ApplicationRunner runner1(){
        return args ->{



//            userService.follow(1,2);
//            userService.follow(2,1);
//            userService.printFollowers(2);
//            System.out.println("Followers followed john");
//            userService.printFollowers(1);
//            System.out.println("Followers followed mary");
            System.out.println();
        };
    }


    public static void main(String[] args) {
        SpringApplication.run(SpringProjectApplication.class, args);
    }

}
