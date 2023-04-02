import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/config";
import { SubcommentAttributes } from "../constants/constants";
import User from "./userModel";
import Bill from "./billModel";
import Comment from "./commentModel";

class Subcomment
  extends Model<SubcommentAttributes, Optional<SubcommentAttributes, "id">>
  implements SubcommentAttributes
{
  public id!: string;
  public content!: string;
  public likes_number!: number;
  public dislikes_number!: number;
  public comment_id!: string;
  public owner_id!: string;
  public bill_id!: string;
}

Subcomment.init(
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
    comment_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: Comment,
        key: "id",
      },
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
    tableName: "subcomments",
    timestamps: false,
  },
);

// User.hasMany(Subcomment);
// Bill.hasMany(Subcomment);
// Comment.hasMany(Subcomment);

export default Subcomment;
