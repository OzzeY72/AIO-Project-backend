import { UserResponseDto } from "@/user/dto";
import { User } from "@/user/entities";

export const toTestUserDto = ({email, name, userId, userLogo}: User): UserResponseDto => ({
  email,
  name,
  userId,
  userLogo
});