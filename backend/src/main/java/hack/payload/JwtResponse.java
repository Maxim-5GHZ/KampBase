// src/main/java/hack/payload/JwtResponse.java
package hack.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String username;
    private String name;       // ДОБАВЛЕНО
    private String lastName;   // ДОБАВЛЕНО
    private List<String> roles;
}