import express from "express";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import {
  ErrorType,
  CommentAttributes,
  UpdateCommentRequest,
  SubcommentAttributes,
  CommentsSubcommentsBillResponse,
  CommentsSubcommentsUserResponse,
} from "../constants/constants";
import Comment from "../models/commentModel";
import Subcomment from "../models/subcommentModel";

const router = express.Router();

router.get(
  "/api/v1/comments",
  async (req: Request, res: Response<CommentAttributes[] | ErrorType>) => {
    try {
      const comments: CommentAttributes[] = await Comment.findAll();

      if (!comments) {
        return res.status(404).send("Comments not found");
      }

      return res.status(200).json(comments);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/comments/:id",
  async (req: Request<{ id: string }>, res: Response<CommentAttributes | ErrorType>) => {
    const commentId: string = req.params.id;
    try {
      const comment: CommentAttributes = await Comment.findByPk(commentId);

      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      return res.status(200).json(comment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/comments/subcomments/user/:id",
  async (req: Request, res: Response<CommentsSubcommentsUserResponse | ErrorType>) => {
    const userId: string = req.params.id;
    try {
      const userComments: CommentAttributes[] = await Comment.findAll({
        where: {
          owner_id: userId,
        },
      });

      const userSubcomments: SubcommentAttributes[] = await Subcomment.findAll({
        where: {
          owner_id: userId,
        },
      });

      const responseData: CommentsSubcommentsUserResponse = {
        userComments,
        userSubcomments,
      };

      if (!responseData) {
        return res.status(404).send("Comments and subcomments not found");
      }

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.get(
  "/api/v1/comments/bill/:id",
  async (req: Request, res: Response<CommentsSubcommentsBillResponse | ErrorType>) => {
    const billId: string = req.params.id;
    try {
      const commentsBill: CommentAttributes[] = await Comment.findAll({
        where: {
          bill_id: billId,
        },
      });

      const subcommentsBill: SubcommentAttributes[] = await Subcomment.findAll({
        where: {
          bill_id: billId,
        },
      });

      const responseData: CommentsSubcommentsBillResponse = {
        commentsBill,
        subcommentsBill,
      };

      if (!responseData) {
        return res.status(404).send("Comments and subcomments not found");
      }

      return res.status(200).json(responseData);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.post(
  "/api/v1/comments",
  async (
    req: Request<Omit<CommentAttributes, "id">>,
    res: Response<CommentAttributes | ErrorType>,
  ) => {
    const { content, owner_id, bill_id }: Omit<CommentAttributes, "id"> = req.body;

    try {
      const newComment: CommentAttributes = await Comment.create({
        id: uuidv4(),
        content,
        owner_id,
        bill_id,
      });

      return res.status(201).json(newComment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.put(
  "/api/v1/comments/:id",
  async (req: UpdateCommentRequest, res: Response<CommentAttributes | ErrorType>) => {
    const commentId: string = req.params.id;
    const {
      content,
      likes_number,
      dislikes_number,
      owner_id,
      bill_id,
    }: Partial<CommentAttributes> = req.body;

    try {
      const comment = await Comment.findOne({ where: { id: commentId } });
      if (!comment) {
        return res.status(404).send("This comment not exists in the system");
      }

      const updatedData: Partial<CommentAttributes> = {
        content,
        likes_number,
        dislikes_number,
        owner_id,
        bill_id,
      };

      const dataToUpdate = Object.keys(updatedData).filter(key => updatedData[key] !== undefined);

      dataToUpdate.forEach(key => (comment[key] = updatedData[key]));

      await comment.save();

      return res.status(200).json(comment);
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

router.delete(
  "/api/v1/comments/:id",
  async (req: Request<{ id: string }>, res: Response<string | ErrorType>) => {
    try {
      const commentId: string = req.params.id;

      const deletedComment = await Comment.destroy({ where: { id: commentId } });

      if (!deletedComment) {
        return res.status(404).send("Comment with this id not exists in the system");
      }

      return res.status(200).send("Comment successfully deleted from the system!");
    } catch (error) {
      logger.error(error.stack);
      logger.error(error.message);
      logger.error(error.errors[0].message);
      return res.status(500).json({ error: error.errors[0].message });
    }
  },
);

export default router;
