import { Response } from "express";
import { ServiceType } from "../../../types/admin/services/serviceType.js";
import { CustomRequest } from "../../../types/reqResTypes/responseTypes.js";
import { TryCatch } from "../../../middlewares/errorMiddleware.js";
import { Service } from "../../../models/admin/services/serviceTypeSchema.js";
import { validateWithSchema } from "../../../utils/validationFunction.js";
import { serviceSchema } from "../../../utils/joiValidationSchema/admin/services/serviceTypeValidationSchema.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/genericResponse.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create
export const createService = TryCatch(
  async (req: CustomRequest, res: Response) => {
    //  Step 1: Extract uploaded files from req.files
    const uploadedFiles = req.files as Express.Multer.File[];
    // console.log(req.files, req.body);
    //  Step 2: Convert uploaded file paths to URLs

    const imageUrls: string[] = [];
    const videoUrls: string[] = [];

    for (const file of uploadedFiles) {
      const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
      const fileUrl = `/uploads/${folder}/${file.filename}`;

      if (folder === "images") {
        imageUrls.push(fileUrl);
      } else {
        videoUrls.push(fileUrl);
      }
    }
    // // Step 3: Merge form data with URLs
    const reqObj: ServiceType = req.body;

    const finalData = {
      categoryId: reqObj.categoryId,
      serviceName: reqObj.serviceName,
      serviceDescription: reqObj.serviceDescription,
      durationInMinutes: Number(reqObj.durationInMinutes),
      price: Number(reqObj.price),
      offerDiscountPercent: Number(reqObj.offerDiscountPercent),
      isFeatured: reqObj.isFeatured === true,
      available: reqObj.available === true,
      imageUrls,
      videoUrls,
    };

    const validObj = validateWithSchema<ServiceType>(serviceSchema, finalData);
    const service = await Service.create(validObj);

    return res
      .status(201)
      .json(successResponse(service, "Service Created Successfully"));
  }
);

// Read All
export const getAllServices = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const services = await Service.find().populate("categoryId");
    res
      .status(200)
      .json(successResponse(services, "All Services fetched successfully"));
  }
);

//update service

export const updateService = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    // 1. Find existing service
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    // 2. Handle file uploads
    const uploadedFiles = req.files as Express.Multer.File[];
    const imageUrls: string[] = [...(existingService.imageUrls || [])];
    const videoUrls: string[] = [...(existingService.videoUrls || [])];

    for (const file of uploadedFiles || []) {
      const folder = file.mimetype.startsWith("video/") ? "videos" : "images";
      const fileUrl = `/uploads/${folder}/${file.filename}`;
      // const fullUrl = "http://localhost:4000" + fileUrl;

      if (folder === "images") {
        imageUrls.push(fileUrl);
        // imageUrls.push(fullUrl);
      } else {
        videoUrls.push(fileUrl);
        // videoUrls.push(fullUrl);
      }
    }

    // 3. Parse and update fields conditionally
    const reqObj: ServiceType = req.body;

    const finalUpdateData = {
      categoryId: reqObj.categoryId,
      serviceName: reqObj.serviceName,
      serviceDescription: reqObj.serviceDescription,
      durationInMinutes: Number(reqObj.durationInMinutes),
      price: Number(reqObj.price),
      offerDiscountPercent: Number(reqObj.offerDiscountPercent),
      isFeatured: reqObj.isFeatured === true,
      available: reqObj.available === true,
      imageUrls,
      videoUrls,
    };

    // 4. Validate updated object (optional but recommended)
    const validatedData = validateWithSchema<ServiceType>(
      serviceSchema,
      finalUpdateData
    );

    // 5. Update service
    const updatedService = await Service.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    return res
      .status(200)
      .json(successResponse(updatedService, "Service Updated Successfully"));
  }
);

// Delete service
export const deleteService = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json(errorResponse(`Service by ${id} not found,cant be deleted`));
    }

    const deleteFile = (fileUrl: string, folder: string) => {
      const fileName = path.basename(fileUrl); // extract filename from URL

      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..", // go from dist/controllers/admin/services to server
        "uploads",
        folder,
        fileName
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete ${filePath}:`, err.message);
        } else {
          console.log(`Deleted: ${filePath}`);
        }
      });
    };

    // Delete images
    if (Array.isArray(service.imageUrls)) {
      service.imageUrls.forEach((imageUrl) => deleteFile(imageUrl, "images"));
    }

    // Delete videos
    if (Array.isArray(service.videoUrls)) {
      service.videoUrls.forEach((videoUrl) => deleteFile(videoUrl, "videos"));
    }

    await Service.findByIdAndDelete(id);
    return res.json(successResponse("Service deleted successfully"));
  }
);

export const getServiceById = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    const service = await Service.findById(id).populate("categoryId");

    if (!service) {
      return res.status(404).json(errorResponse("Service not found"));
    }

    return res
      .status(200)
      .json(successResponse(service, "Service fetched successfully"));
  }
);

export const getFeaturedServices = TryCatch(
  async (req: CustomRequest, res: Response) => {
    const featuredServices = await Service.find({ isFeatured: true }).populate(
      "categoryId"
    );

    return res
      .status(200)
      .json(
        successResponse(
          featuredServices,
          "Featured services fetched successfully"
        )
      );
  }
);
