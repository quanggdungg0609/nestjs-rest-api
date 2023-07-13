import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    controllers:[AuthController], //handling incomming request and return responses to the client (Like routing mechanism in ExpressJS and Flask)
    providers:[AuthService] //
})
export class AuthModule {}
