exports.tryCatch =
  (controller, validator = null) =>
  async (req, res, next) => {
    try {
      if (validator) {
        const { error } = validator({
          ...req.body,
          ...req.query,
          ...req.params,
        });
        if (error) throw error;
      }

      await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };
