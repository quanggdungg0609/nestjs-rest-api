import { ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { AuthDto } from "./dto"
import * as argon from 'argon2'
import {Prisma} from "@prisma/client"
@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService){}
    async signup(dto: AuthDto){
        //generate the password hash
        const hash= await argon.hash(dto.password)
        //save the new user in the db
        try{
            const user= await this.prisma.user.create({
                data:{
                    email:dto.email,
                    hash,
                },
                // select:{
                //     id:true,
                //     email:true,
                //     createAt:true
                // }
            })

            delete user.hash
            return user
        }catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError){
                if (error.code==="P2002"){
                    throw new ForbiddenException("Credentials taken")
                }
            }
            throw error
        }
    }

    signin(){
        // find the user by email
        //if use does not exist throw exception

        // compare password
        return { msg: "Hi i am signin"}
    }
}

