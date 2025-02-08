import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User, UserProfile } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User & { user_profile: UserProfile }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.user_profile.name,
      userId: user.id,
    });
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    if (!loginDto.email) {
      throw new UnauthorizedException('Email is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email.toLowerCase().trim(),
      },
      include: {
        user_profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = new Date();

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        created_at: now,
        updated_at: now,
        user_profile: {
          create: {
            name: createUserDto.name,
            avatar_url: createUserDto.avatarUrl,
            created_at: now,
            updated_at: now,
          },
        },
      },
      include: {
        user_profile: true,
      },
    });

    const token = this.generateToken(user);
    return { user, token };
  }
}
