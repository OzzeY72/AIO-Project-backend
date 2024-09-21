import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/user/entities';
import { UserResponseDto } from '@/user/dto';
import { OpenID } from '@/interfaces/openid';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async FindUser(props: NonNullable<any>): Promise<User | undefined> {
        return this.userRepository.findOneBy({ ...props });
    }
    async CreateUser( openId: OpenID, provider: string) {
        const user_db = this.userRepository.create({
            email: openId.email,
            name: openId.name,
            provider: provider,
            providerId: openId.providerId,
            userId: uuidv4(),
        });
        return this.userRepository.save(user_db);
    }
    toUserDto(user: User): UserResponseDto {
        const userDto: UserResponseDto = {
            email: user.email,
            name: user.name,
            userId: user.userId,
            userLogo: user.userLogo,
        };
        return userDto;
    }
}
