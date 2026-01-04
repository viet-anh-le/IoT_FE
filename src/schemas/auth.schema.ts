import z from "zod";

export const authSchema = {
  login: z.object({
    gmail: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Định dạng email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),

  register: z.object({
    username: z.string().min(3, "Họ và tên phải có ít nhất 3 ký tự"),
    gmail: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Định dạng email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),

  forgotPassword: z.object({
    gmail: z
      .string()
      .nonempty("Vui lòng nhập email")
      .regex(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Định dạng email không hợp lệ"
      ),
  }),
  resetPassword: z
    .object({
      token: z.string().optional(),
      newPassword: z
        .string()
        .trim()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .nonempty("Vui lòng nhập mật khẩu mới"),
      confirmPassword: z
        .string()
        .trim()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .nonempty("Vui lòng nhập lại mật khẩu"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    }),
};

export type LoginSchema = z.infer<typeof authSchema.login>;
export type RegisterSchema = z.infer<typeof authSchema.register>;
export type ForgotPasswordSchema = z.infer<typeof authSchema.forgotPassword>;
export type ResetPasswordSchema = z.infer<typeof authSchema.resetPassword>;
