// src/main/java/hack/models/Perk.java
package hack.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Perk {
    private String id;
    private String name;
    private String shortName;
    private String description;
    private List<String> parentIds;
}