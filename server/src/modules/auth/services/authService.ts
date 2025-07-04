import { Admin } from "../models/admin.model";
import bcrypt from "bcryptjs";

export class AuthService {
  private AdminModel = Admin;

  async findAdminByEmail(email: string) {
    return await this.AdminModel.findOne({ email: email }).exec();
  }
  async findAdminById(id: string) {
    return await this.AdminModel.findById(id).exec();
  }

  async comparePassword(
    inputPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  async createAdmin(email: string, password: string) {
    const newAdmin = new this.AdminModel({
      email: email,
      password: password,
    });
    return await newAdmin.save();
  }
}
