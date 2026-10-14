import { Plan } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listPlans = asyncHandler(async (_request, response) => response.json(await Plan.find({ active: true }).sort({ amount: 1 })));
