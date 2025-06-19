import { check } from "express-validator";

// Validation chain for user registration
export const registerValidation = [
  // ---- First name validation ----
  check("firstName", "First name is required.").not().isEmpty(),
  check("firstName")
    .matches(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
    )
    .withMessage("First name can not contain number and special character."),

  // ---- Last name validation ----
  check("lastName", "Last name is required.").not().isEmpty(),
  check("lastName")
    .matches(
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
    )
    .withMessage("Last name can not contain number and special character."),

  // ---- Email validation ----
  check("email", "Email is required.").not().isEmpty(),
  check("email")
    .isLength({ min: 10, max: 30 })
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage("Please provide valid email address."),

  // ---- Password validation ----
  check("password", "Password is required.").not().isEmpty(),
  check("password")
    .isLength({ min: 8 })
    .matches(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g)
    .withMessage(
      "Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character"
    ),

  // ---- Confirm password validation ----
  check("confirmPassword", "Confirm password is required.").not().isEmpty(),
  check("confirmPassword").custom((value, { req }) => {
    // 'value' is the content of 'confirmPassword'
    // 'req' is the Express request object, allowing access to req.body.password
    if (value !== req.body.password) {
      // If the values don't match, throw an error
      throw new Error("Confirm password does not match password");
    }
    // If they match, return true to indicate success
    return true;
  }),
];

// Validation chain for user login
export const loginValidation = [
  // ---- Email validation ----
  check("email", "Email is required.").not().isEmpty(),
  check("email")
    .isLength({ min: 10, max: 30 })
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage("Please provide valid email address."),

  // ---- Password validation ----
  check("password", "Password is required.").not().isEmpty(),
  check("password")
    .isLength({ min: 8 })
    .matches(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g)
    .withMessage(
      "Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character"
    ),
];
