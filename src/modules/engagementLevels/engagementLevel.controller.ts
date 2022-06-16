import { constants } from "../../config/constants";
import { Request, RequestHandler, Response } from "express";
import { logEvent } from "../auditTrail/auditTrail.service";
import * as EngagementLevelService from "./engagementLevel.service";

const { PERPAGE } = constants;

export const createEngagementLevel = async (req: any, res: Response) => {
  try {
    const { body } = req;
    const engagementLevel = await EngagementLevelService.createEngagementLevel(
      body
    );

    const message = "Engagement Level created successfully.";

    await logEvent({
      request: req,
      activity:
        "Created Engagement Level:  " +
        engagementLevel.desiredLevel +
        " for stakeholder: " +
        engagementLevel.stakeholder.name +
        " on project-phase: " +
        engagementLevel.projectPhase.name,
    });

    return res
      .status(200)
      .json({ success: true, message, data: engagementLevel });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

export const getEngagementLevels: RequestHandler = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    const engagementLevels = await EngagementLevelService.getEngagementLevels(
      (searchQuery as unknown as string) ?? ""
    );

    const count = engagementLevels.length;
    const message = "Engagement Levels retrieved successfully.";

    return res
      .status(200)
      .json({ success: true, message, count, data: engagementLevels });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

export const deleteEngagementLevel = async (req: Request, res: Response) => {
  try {
    const { engagementLevelId } = req.params;
    const engagementLevel = await EngagementLevelService.deleteEngagementLevel(
      engagementLevelId
    );

    if (!engagementLevel) {
      const message = `No Engagement Level found with id: ${engagementLevelId}`;

      return res
        .status(404)
        .json({ success: false, message, data: engagementLevel });
    }

    const message = "Engagement Level deleted successfully.";

    await logEvent({
      request: req,
      activity:
        "Deleted Engagement Level:  " +
        engagementLevel.desiredLevel +
        " for stakeholder: " +
        engagementLevel.stakeholder.name +
        " on project-phase: " +
        engagementLevel.projectPhase.name,
    });

    return res
      .status(200)
      .json({ success: true, message, data: engagementLevel });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

export const getEngagementLevelById = async (req: Request, res: Response) => {
  try {
    const { engagementLevelId } = req.params;
    const engagementLevel = await EngagementLevelService.getEngagementLevelById(
      engagementLevelId
    );

    if (!engagementLevel) {
      const message = `No Engagement Level found with id: ${engagementLevelId}`;

      return res
        .status(404)
        .json({ success: false, message, data: engagementLevel });
    }

    const message = "Engagement Level retrieved successfully.";

    return res
      .status(200)
      .json({ success: true, message, data: engagementLevel });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

export const updateEngagementLevel = async (req: any, res: Response) => {
  try {
    const { body } = req;
    const { engagementLevelId } = req.params;

    const engagementLevel = await EngagementLevelService.updateEngagementLevel(
      engagementLevelId,
      body
    );

    if (!engagementLevel) {
      const message = `No Engagement Level found with id: ${engagementLevelId}`;

      return res
        .status(404)
        .json({ success: false, message, data: engagementLevel });
    }

    const message = "Engagement Level updated successfully.";

    await logEvent({
      request: req,
      activity:
        "Updated Engagement Level:  " +
        engagementLevel.desiredLevel +
        " for stakeholder: " +
        engagementLevel.stakeholder.name +
        " on project-phase: " +
        engagementLevel.projectPhase.name,
    });

    return res
      .status(200)
      .json({ success: true, message, data: engagementLevel });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

export const getEngagementLevelsByQuery: RequestHandler = async (req, res) => {
  try {
    let searchQuery: Object = appendSearchKeywords(req);
    const currentPage = (req.query.currentPage as unknown as number) || 1;

    const perPage = parseInt(PERPAGE);
    const offset = perPage * currentPage - perPage;

    const { data, totalRows } =
      await EngagementLevelService.getEngagementLevelsByQuery(
        offset,
        perPage,
        searchQuery
      );

    const count = data.length;
    const message = "Engagement Levels retrieved successfully.";

    const pagination = {
      currentPage,
      perPage,
      totalPages: Math.ceil(totalRows / perPage) || 1,
      totalRows,
    };

    return res
      .status(200)
      .json({ success: true, message, count, pagination, data });
  } catch (e) {
    return errorResponse(res, 400, e);
  }
};

const appendSearchKeywords = (req: Request) => {
  let searchQuery: Object = {};
  const { stakeholder, projectPhase, desiredLevel, currentLevel } = req.query;

  //Assign properties into search-query iff they have values
  searchQuery = {
    ...(stakeholder && { stakeholder }),
    ...(projectPhase && { projectPhase }),
    ...(desiredLevel && { desiredLevel }),
    ...(currentLevel && { currentLevel }),
  };

  return searchQuery;
};

const errorResponse = (res: Response, statusCode: number, error: any) => {
  // Formulate response

  return res.status(statusCode).json({
    data: null,
    success: false,
    message: "Operation failed.",
    developerMessage: error.message,
    userMessage: "Oops... Something went wrong, contact the admin...",
  });
};
