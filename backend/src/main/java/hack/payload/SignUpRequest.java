package hack.payload;

import hack.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignUpRequest {
    private String username;
    private String password;
    private String name;
    private String lastName;
    private Role role;
}