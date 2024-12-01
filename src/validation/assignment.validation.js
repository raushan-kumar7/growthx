import Joi from "joi";

export const validateAssignment = (data) => {
  const schema = Joi.object({
    user: Joi.string().trim().required(),
    admin: Joi.string().trim().required(),
    task: Joi.string().trim().max(1000).required(),
  });

  return schema.validate(data);
};

export const validateAssigmentStatus = (data) => {
  const schema = Joi.object({
    remark: Joi.string().trim().max(100).optional(),
  });

  return schema.validate(data);
};