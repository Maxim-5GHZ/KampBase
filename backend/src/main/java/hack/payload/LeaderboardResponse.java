package hack.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardResponse {
    private Long userId;
    private String username;
    private String name;
    private String lastName;
    private Integer totalRate;
    private Integer skillPoints; 
}