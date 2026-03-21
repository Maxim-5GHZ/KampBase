// hack/payload/ReviewSolutionRequest.java
package hack.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ReviewSolutionRequest {
    
    // ИСПРАВЛЕНИЕ: Заставляем Spring понимать поле "isApproved" из JSON
    @JsonProperty("isApproved")
    private boolean isApproved;
    
    private Integer rating;
}