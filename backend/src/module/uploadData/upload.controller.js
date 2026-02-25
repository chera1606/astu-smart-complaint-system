import { uploadDataService } from "./upload.service.js";

export const uploadDataController = {
    async handleUpload(req, res) {
        try {
            // Check if file exists
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No file uploaded. Please provide a PDF or TXT file."
                });
            }

            const result = await uploadDataService.upload(req.file, req.body.sourceName);

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

            return res.status(200).json({
                success: true,
                message: result.data.message,
                count: result.data.count
            });

        } catch (error) {
            console.error("Upload Controller Error:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error during upload"
            });
        }
    }
};
