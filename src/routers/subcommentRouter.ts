import express from "express";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { ErrorType, SubcommentAttributes, UpdateSubcommentRequest } from "../constants/constants";
import Subcomment from "../models/subcommentModel";

const router = express.Router();

router.get(
  "/api/v1/subcomments",
  async (req: Request, res: Response<SubcommentAttributes[] | ErrorType>) => {
    try {
      const subcomments: SubcommentAttributes[] = await Subcomment.findAll();

      if (!subcomments) {
        return res.status(404).send("Subcomments not found");
      }

      return res.status(200).json(subcomments);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/subcomments/:id",
  async (req: Request<{ id: string }>, res: Response<SubcommentAttributes | ErrorType>) => {
    const subcommentId: string = req.params.id;
    try {
      const subcomment: SubcommentAttributes = await Subcomment.findByPk(subcommentId);

      if (!subcomment) {
        return res.status(404).send("Subcomment not found");
      }

      return res.status(200).json(subcomment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.post(
  "/api/v1/subcomments",
  async (
    req: Request<Omit<SubcommentAttributes, "id">>,
    res: Response<SubcommentAttributes | ErrorType>,
  ) => {
    const { content, comment_id, owner_id, bill_id }: Omit<SubcommentAttributes, "id"> = req.body;

    try {
      const newSubcomment: SubcommentAttributes = await Subcomment.create({
        id: uuidv4(),
        content,
        comment_id,
        owner_id,
        bill_id,
      });

      return res.status(201).json(newSubcomment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.put(
  "/api/v1/subcomments/:id",
  async (req: UpdateSubcommentRequest, res: Response<SubcommentAttributes | ErrorType>) => {
    const subcommentId: string = req.params.id;
    const {
      content,
      likes_number,
      dislikes_number,
      comment_id,
      owner_id,
      bill_id,
    }: Partial<SubcommentAttributes> = req.body;

    try {
      const subcomment = await Subcomment.findOne({ where: { id: subcommentId } });
      if (!subcomment) {
        return res.status(404).send("This subcomment not exists in the system");
      }

      const updatedData: Partial<SubcommentAttributes> = {
        content,
        likes_number,
        dislikes_number,
        comment_id,
        owner_id,
        bill_id,
      };

      const dataToUpdate = Object.keys(updatedData).filter(key => updatedData[key] !== undefined);

      dataToUpdate.forEach(key => (subcomment[key] = updatedData[key]));

      await subcomment.save();

      return res.status(200).json(subcomment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.delete(
  "/api/v1/subcomments/:id",
  async (req: Request<{ id: string }>, res: Response<string | ErrorType>) => {
    try {
      const subcommentId: string = req.params.id;

      const deletedSubcomment = await Subcomment.destroy({ where: { id: subcommentId } });

      if (!deletedSubcomment) {
        return res.status(404).send("Subcomment with this id not exists in the system");
      }

      return res.status(200).send("Subcomment successfully deleted from the system!");
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

export default router;
