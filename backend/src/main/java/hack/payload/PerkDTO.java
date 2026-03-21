// src/main/java/hack/payload/PerkDTO.java
package hack.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import hack.models.Perk;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PerkDTO {
    private String id;
    private String name;
    
    @JsonProperty("short")
    private String shortName;
    
    private String description;
    
    @JsonProperty("isOpen")
    private boolean isOpen;
    
    private List<String> parentIds;

    public static PerkDTO fromPerk(Perk perk, boolean isOpen) {
        return new PerkDTO(
                perk.getId(),
                perk.getName(),
                perk.getShortName(),
                perk.getDescription(),
                isOpen,
                perk.getParentIds()
        );
    }
}