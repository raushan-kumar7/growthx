import Joi from "joi";

export const validateUser = (data) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "user").default("user"),
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};