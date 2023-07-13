import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ UserModule, AuthModule, BookmarkModule, PrismaModule, ConfigModule.forRoot({isGlobal:true})]
})
export class AppModule {}
