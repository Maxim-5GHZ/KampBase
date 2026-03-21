package hack.payload;

import hack.enums.ArticleFormat;
import lombok.Data;

@Data
public class ArticleRequest {
    private String title;
    private String about;
    private ArticleFormat format;
    private String link;
    private String previewPhotoLink;
}