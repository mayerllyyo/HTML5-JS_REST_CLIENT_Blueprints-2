package edu.eci.arsw.blueprints.test.services;
import edu.eci.arsw.blueprintsapi.BlueprintsAPIApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = BlueprintsAPIApplication.class)
public class ApplicationServicesTests {
    @Test
    public void contextLoads() {
    }
}
