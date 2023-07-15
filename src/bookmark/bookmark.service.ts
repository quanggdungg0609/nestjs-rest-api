import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from "../prisma/prisma.service"


@Injectable()
export class BookmarkService {
    
    constructor(private prisma: PrismaService ){}

    getBookmarks(userId: number){
        return this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark= await this.prisma.bookmark.create({
            data:{
                userId,
                ...dto
            }
        })
        return bookmark
    }

    async getBookmarkById(userId: number, bookmarkId: number ){
        const bookmark= await this.prisma.bookmark.findFirst({
            where:{
                userId:userId,
            }
        })
        return bookmark
    }
    

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto){
        //get the bookmark by id
        const bookmark= await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        
        // check if user owns the bookmark
        if (!bookmark || bookmark.userId != userId){
            throw new ForbiddenException("Access to resources denied")
        }

        //modify bookmark
        return this.prisma.bookmark.update({
            where:{
                id:bookmarkId
            },
            data:{
                ...dto
            }
        })
    }

    async deleteBookmarkById(userId: number, bookmarkId:number){
        //get the bookmark by id
        const bookmark= await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        
        // check if user owns the bookmark
        if (!bookmark || bookmark.userId != userId){
            throw new ForbiddenException("Access to resources denied")
        }

        await this.prisma.bookmark.delete({
            where:{
                id:bookmarkId
            }
        })
    }
}
