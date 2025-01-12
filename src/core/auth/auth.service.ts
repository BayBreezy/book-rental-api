import { EmailService } from "@/common/email/email.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as dayjs from "dayjs";
import { PrismaService } from "nestjs-prisma";
import { v4 } from "uuid";
import { User } from "../users/entities/user.entity";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateCurrentUserInput,
} from "./dto/auth.input";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Send a verification email to the user
   */
  async sendUserVerificationEmail(user: Partial<User>) {
    const token = v4();
    await this.prisma.user.update({
      where: { email: user.email },
      data: { verificationToken: token },
    });
    await this.emailService.sendTemplateMail("verify-account.html", {
      to: user.email,
      subject: "Verify your account",
      ...user,
      token,
    });
  }

  async validateUser(dto: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return null;
    if (!user.active) return null;
    if (!user.verified) {
      await this.sendUserVerificationEmail(user);
      throw new BadRequestException("Please check your email for further instructions");
    }
    if (!user.password) return null;
    const passwordsMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordsMatch) return null;
    return user;
  }

  async login(user: any) {
    const userData = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (!userData) throw new UnauthorizedException();
    if (!userData.active) throw new UnauthorizedException();
    if (!userData.verified) {
      await this.sendUserVerificationEmail(userData);
      throw new BadRequestException("Please check your email for further instructions");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = userData;
    const payload = { email: userData.email, sub: userData.id?.toString() };

    return {
      token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async register(dto: RegisterInput) {
    const userExist = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (userExist) throw new BadRequestException("User already exists");
    // hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    await this.sendUserVerificationEmail(user);
    return user;
  }

  async updateMe(user: User, dto: UpdateCurrentUserInput) {
    return await this.prisma.user.update({
      where: { id: user.id },
      data: dto,
    });
  }

  async forgotPassword({ email }: ForgotPasswordInput) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException("User not found");
    const token = v4();
    await this.prisma.user.update({
      where: { email },
      data: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: dayjs().add(1, "hour").toDate(),
      },
    });
    return await this.emailService.sendTemplateMail("forgot-password.html", {
      to: email,
      subject: "Reset your password",
      ...user,
      token,
    });
  }

  async resetPassword(dto: ResetPasswordInput) {
    const user = await this.prisma.user.findFirst({
      where: {
        forgotPasswordToken: dto.token,
        forgotPasswordTokenExpiry: {
          gte: new Date(),
        },
      },
    });
    if (!user) throw new BadRequestException("Please send a new forgot password request.");
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordTokenExpiry: null,
      },
    });
    await this.emailService.sendTemplateMail("password-updated.html", {
      to: user.email,
      subject: "Password updated",
      ...user,
    });
    return "Password reset successfully";
  }
}
