import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from "../src/prisma/prisma.service"
import { describe } from "node:test"
import { AuthDto } from "../src/auth/dto"
import { EditUserDto } from "src/user/dto"
import { CreateBookmarkDto, EditBookmarkDto } from "../src/bookmark/dto"


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

    describe("Edit user by id",()=>{
      it("should edit user by id",()=>{
        const dto: EditUserDto={
          firstName: "Truong",
          lastName: "Quang Dung",
          email: "quangdung0609@gmail.com"
        }
        return pactum.spec()
          .patch("/users")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
      

    })

  })

  describe("Bookmarks",()=>{
    describe("get empty bookmarks",()=>{
      it("should by get empty bookmark",()=>{
        return pactum.spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    })
    describe("Create boomark",()=>{
      const dto: CreateBookmarkDto={
        title: "First Bookmark",
        link: "https://www.linkedin.com/in/tr%C6%B0%C6%A1ng-quang-d%C5%A9ng-384176193/"

      }
      it("should create bookmark",()=>{
        return pactum.spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores("bookmarkId",'id')
      })

    })

    describe("Get bookmarks",()=>{
      it("should by get  bookmark",()=>{
        return pactum.spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })

    })

    describe("Get bookmark by id",()=>{
      it("should by get bookmark by id",()=>{
        return pactum.spec()
          .get("/bookmarks/{id}")
          .withPathParams('id',"$S{bookmarkId}")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains("$S{bookmarkId}")
      })

    })

    describe("Edit bookmark by id",()=>{
      const dto: EditBookmarkDto={
        description:"My linkedin page"
      }
      it("should create bookmark",()=>{
        return pactum.spec()
          .patch("/bookmarks/{id}")
          .withPathParams('id',"$S{bookmarkId}")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description)
          .inspect()
      })

    })

    describe("Delete bookmark by id",()=>{
      it("should delete bookmark",()=>{
        return pactum.spec()
          .delete("/bookmarks/{id}")
          .withPathParams('id',"$S{bookmarkId}")
          .withHeaders({
            Authorization:'Bearer $S{userAt}'
          })
          .expectStatus(204)
          .inspect()
      })

      describe("get empty bookmarks",()=>{
        it("should by get empty bookmark",()=>{
          return pactum.spec()
            .get("/bookmarks")
            .withHeaders({
              Authorization:'Bearer $S{userAt}'
            })
            .expectStatus(200)
            .expectBody([])
            .expectJsonLength(1)

        })
      })
    })
  })

  it.todo("should pass")
})