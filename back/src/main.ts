import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport'
import { TypeORMSession } from './typeorm';
import { TypeormStore } from 'connect-typeorm/out';
import { AuthFilter } from './auth/utils/auth.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepo = app
    .get(AppModule)
    .getDataSource()
    .getRepository(TypeORMSession);

  app.useGlobalPipes(new ValidationPipe()) //Don't need to use validation in controller
/*
  app.use(session({
      cookie: {
        maxAge: Number(process.env.COOKIE_LIFETIME_IN_MS),
      },
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
*/  
  await app.listen(3001);
}
bootstrap();