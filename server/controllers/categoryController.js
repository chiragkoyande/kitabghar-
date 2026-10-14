import { Category } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listCategories = asyncHandler(async (_request, response) => response.json(await Category.find().sort({ name: 1 })));
export const createCategory = asyncHandler(async (request, response) => response.status(201).json(await Category.create(request.body)));
