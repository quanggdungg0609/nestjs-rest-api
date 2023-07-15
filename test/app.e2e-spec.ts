import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from "../src/prisma/prisma.service"
import { describe } from "node:test"
import { AuthDto } from "../src/auth/dto"


describe("App e2e",()=>{
  let app:INestApplication
  let prisma: PrismaService
  beforeAll(async ()=>{
    const moduleRef= await Test.createTestingModule({
      imports:[AppModule],
    }).compile()

    app= moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist:true
    }))
    await app.init()
    await app.listen(3333)
    prisma=app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl("http://localhost:3333")
  })

  afterAll(()=>{
    app.close()
  })

  describe("Auth",()=>{
    const dto:AuthDto = {
      email:"quangdung@gmail.com",
      password:"123"
    }
    describe("Signup", ()=>{
      
      it("should throw  it email empty",()=>{
        return pactum.spec()
        .post("/auth/signup")
        .withBody({
          password:dto.password
        })
        .expectStatus(400)
      })

      it("should throw it password empty",()=>{
        return pactum.spec()
        .post("/auth/signup")
        .withBody({
          email:dto.email
        })
        .expectStatus(400)
      })

      it("should throw if no body provide ",()=>{
        return pactum.spec()
        .post("/auth/signup")
        .expectStatus(400)
      })

      it("should Signup",()=>{
        return pactum.spec()
        .post("/auth/signup")
        .withBody(dto)
        .expectStatus(201)

      })

    })
  
    describe("Signin",()=>{
      
      it("should throw  it email empty",()=>{
        return pactum.spec()
        .post("/auth/signin")
        .withBody({
          password:dto.password
        })
        .expectStatus(400)
      })

      it("should throw it password empty",()=>{
        return pactum.spec()
        .post("/auth/signin")
        .withBody({
          email:dto.email
        })
        .expectStatus(400)
      })

      it("should throw if no body provide ",()=>{
        return pactum.spec()
        .post("/auth/signin")
        .expectStatus(400)
      })

      it("should Signin",()=>{
        return pactum.spec()
        .post("/auth/signin")
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt','access_token')
      })
    })
  })

  describe("User",()=>{

    describe("Get me", ()=>{
      it("should get current user",()=>{
          return pactum.spec()
          .get("/users/me")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })

    })

    describe("Edit user",()=>{
      // it.todo("should Edit user")

    })

  })

  describe("Bookmarks",()=>{
    describe("Create boomark",()=>{
      // it.todo("should Create bookmark")

    })

    describe("Get bookmarks",()=>{
      // it.todo("should get bookmarks")

    })

    describe("Get bookmark by id",()=>{
      // it.todo("should get bookmark by id")

    })

    describe("Edit bookmark by id",()=>{
      // it.todo("should edit bookmark")

    })

    describe("Delete bookmark by id",()=>{
      // it.todo("should delete bookmark")

    })
  })

  it.todo("should pass")
})