import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { CommentAttributes } from "../constants/constants";
import User from "./userModel";
import Bill from "./billModel";

class Comment
  extends Model<CommentAttributes, Optional<CommentAttributes, "id">>
  implements CommentAttributes
{
  public id!: string;
  public content!: string;
  public likes_number!: number;
  public dislikes_number!: number;
  public owner_id!: string;
  public bill_id!: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    likes_number: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    dislikes_number: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    owner_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    bill_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: Bill,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "comments",
    timestamps: false,
  },
);

// User.hasMany(Comment);
// Bill.hasMany(Comment);

export default Comment;
