import { UserResponseDto } from '@/user/dto';
import { User } from '@/user/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    async FindUser(props: NonNullable<any>): Promise<User | undefined> {
        return await this.userRepository.findOneBy({ ...props });
    }
    async CreateUser( 
        email: string, 
        name: string, 
        provider: string, 
        providerId: string,
        userLogo: string,
        password: string
    ): Promise<User> {
        const user_db = this.userRepository.create({
            email,
            name,
            provider,
            providerId,
            userLogo,
            userId: uuidv4(),
            password
        });
        return await this.userRepository.save(user_db);
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
