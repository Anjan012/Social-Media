import { User } from "../models/user.model.js";
import { 
  notFound
} from "../utils/error/error-helper.js";

export const getMeService = async (userId) => 
{
  const user = await User.findById(userId).select("-password");

  if (!user) {
    notFound("User not Found");
  }

  return user;
};