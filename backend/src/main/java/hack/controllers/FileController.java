// hack/controllers/FileController.java
package hack.controllers;

import hack.security.UserDetailsImpl;
import hack.services.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // Проверяем, что пользователь авторизован
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Необходима авторизация"));
        }

        try {
            String fileUrl = fileStorageService.storeFile(file);
            return ResponseEntity.ok(Map.of(
                    "message", "Файл успешно загружен",
                    "url", fileUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Ошибка загрузки файла: " + e.getMessage()));
        }
    }
}