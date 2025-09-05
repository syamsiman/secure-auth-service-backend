import { body } from "express-validator";

export const validateUserDataUpdate = [
    body("name").notEmpty().withMessage("name is required"),
    body("email").optional()
    //  .notEmpty().withMessage("email is required")
     .isEmail().withMessage("email is invalid"),
    //  .custom(async (value, { req }) => {
    //      if (!value) throw new Error("Email is required");

    //      // check user
    //      const user = await prisma.user.findUnique({ where: { email: value } });

    //      if (user) {
    //          throw new Error("Email already exists");
    //      }

    //      return true;
    //  }),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
]

export const validateUserDataFind = [
    body("name").isString().withMessage("Name must be a string"),
]