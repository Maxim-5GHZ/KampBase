// hack/payload/TaskRequest.java
package hack.payload;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String about;
    private String githubLink;
    private String skillName; // ДОБАВЛЕНО
}