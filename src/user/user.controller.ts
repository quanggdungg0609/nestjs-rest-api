import { Controller, Get, UseGuards, Patch} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get("me")
    getMe(@GetUser() user: User){
        return user
    }
    
    @Patch()
    editUser(){
        return null
    }
}
