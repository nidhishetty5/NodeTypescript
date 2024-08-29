"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const app = new koa_1.default();
const router = new router_1.default();
app.use((0, koa_bodyparser_1.default)());
router.get('/test', (ctx) => {
    ctx.body = ctx.request.query;
});
router.post('/test', (ctx) => {
    ctx.body = ctx.request.body;
});
router.put('/test', (ctx) => {
    ctx.body = ctx.request.body;
});
router.delete('/test', (ctx) => {
    ctx.body = ctx.request.body;
});
app.use(router.routes());
app.use(router.allowedMethods());
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
