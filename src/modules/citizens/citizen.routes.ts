import express from "express";
const router = express.Router();
import * as CitizenController from "./citizen.controller";
import { checkPermission } from "../accessControl/permissionCheck.middleware";

router.post(
  "/",
  checkPermission("citizens", "create-citizens"),
  CitizenController.createCitizen
);

router.put(
  "/:citizenId",
  checkPermission("citizens", "update-citizens"),
  CitizenController.updateCitizen
);

router.delete(
  "/:citizenId",
  checkPermission("citizens", "delete-citizens"),
  CitizenController.deleteCitizen
);

router.get(
  "/all",
  checkPermission("citizens", "read-citizens"),
  CitizenController.getAllCitizens
);

router.get(
  "/:citizenId",
  checkPermission("citizens", "read-citizens"),
  CitizenController.getCitizenById
);

router.get(
  "/",
  checkPermission("citizens", "read-citizens"),
  CitizenController.getCitizens
);

export const CitizenRoutes = router;
