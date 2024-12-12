"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['dev', 'test', 'production']).default('dev'),
    JWT_SECRET: zod_1.z.string(),
    PORT: zod_1.z.coerce.number().default(3335),
});
const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
    console.error('Error environment variable', _env.error.format());
    throw new Error(' Invalid environment variable');
}
exports.env = _env.data;
