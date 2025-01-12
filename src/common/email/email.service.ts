import * as fs from "fs";
import * as path from "path";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mustache from "mustache";
import * as nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";
import { Options } from "nodemailer/lib/smtp-transport";

export interface EmailData {
  to: Options["to"];
  cc?: Options["cc"];
  subject: Options["subject"];
  html?: Options["html"];
  [key: string]: any;
}

// Email templates mapping
export const EMAIL_TEMPLATES = {
  VERIFY_ACCOUNT: "verify-account.html",
  FORGOT_PASSWORD: "forgot-password.html",
  PASSWORD_UPDATED: "password-updated.html",
  ACCOUNT_SETUP_SUCCESS: "account-setup-success.html",
} as const;

// Email template types
export type EmailTemplateType = (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>("SMTP_HOST"),
      port: configService.get<number>("SMTP_PORT"),
      secure: configService.get<number>("SMTP_PORT") === 465,
      from: configService.get<string>("SMTP_FROM"),
      auth: {
        user: configService.get<string>("SMTP_USER"),
        pass: configService.get<string>("SMTP_PASS"),
      },
    });
    this.transporter.use("compile", htmlToText());
  }

  async sendTemplateMail(template: EmailTemplateType, data: EmailData) {
    try {
      const templatePath = path.join(__dirname, "templates", template);

      const templateFile = await fs.promises.readFile(templatePath, "utf8");

      // Render the template
      const renderedTemplate = mustache.render(templateFile, data);

      // Send the email
      const info = await this.transporter.sendMail({
        ...data,
        from: this.configService.get<string>("SMTP_FROM"),
        to: data.to,
        cc: data?.cc,
        subject: data.subject,
        html: renderedTemplate,
      });

      return info;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendMail(data: EmailData) {
    try {
      // Send the email
      const info = await this.transporter.sendMail({
        ...data,
        from: this.configService.get<string>("SMTP_FROM"),
        to: data.to,
        cc: data?.cc,
        subject: data.subject,
        html: data.html,
      });

      return info;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Health check for SMTP
   */
  healthCheckSMTP = async () => {
    return new Promise<boolean>((resolve, reject) => {
      this.transporter.verify((error) => {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  };
}
