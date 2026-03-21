package hack.payload;

import lombok.Data;

@Data
public class SubmitSolutionRequest {
    private String commitHash;
}