"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const errorHandler_js_1 = require("./errorHandler.js");
function validate(schema) {
    return (req, _res, next) => {
        try {
            const shape = schema.shape;
            if (shape?.body) {
                req.body = shape.body.parse(req.body);
            }
            if (shape?.query) {
                req.query = shape.query.parse(req.query);
            }
            if (shape?.params) {
                req.params = shape.params.parse(req.params);
            }
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
                next(new errorHandler_js_1.AppError(400, message));
            }
            else {
                next(err);
            }
        }
    };
}
//# sourceMappingURL=validate.js.map