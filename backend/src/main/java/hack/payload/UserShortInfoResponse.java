package hack.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import hack.models.User;

@Data
@AllArgsConstructor
public class UserShortInfoResponse {
    private Long userId;
    private String username;
    private String name;
    private String lastName;

    public static UserShortInfoResponse fromUser(User user) {
        return new UserShortInfoResponse(
            user.getUserId(), 
            user.getUsername(), 
            user.getName(), 
            user.getLastName()
        );
    }
}