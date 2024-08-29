"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const models_1 = __importDefault(require("./models"));
const user_1 = require("./models/user");
const userContact_1 = require("./models/userContact");
const userAddress_1 = require("./models/userAddress");
const app = new koa_1.default();
const router = new router_1.default();
app.use((0, koa_bodyparser_1.default)());
// Sync database
models_1.default.sync();
// POST /users - Register a new user
router.post('/users', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { Username, Password, Email, Phone, Street, City, Zipcode } = ctx.request.body;
    // Validate required fields
    if (!Username || !Password) {
        ctx.status = 400;
        ctx.body = { message: 'Username and Password are required' };
        return;
    }
    try {
        // Create user
        const user = yield user_1.User.create({ Username, Password });
        // Create associated records
        yield userContact_1.UserContact.create({ UserId: user.Id, Email, Phone });
        yield userAddress_1.UserAddress.create({ UserId: user.Id, Street, City, Zipcode });
        // Respond with the created user
        ctx.status = 201;
        ctx.body = user;
    }
    catch (err) {
        // Handle errors
        if (err instanceof Error) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
        else {
            ctx.status = 500;
            ctx.body = { message: 'An unknown error occurred' };
        }
    }
}));
// PUT /users/:username - Update user contact and address information
router.put('/users/:username', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = ctx.params;
    const { Email, Phone, Street, City, Zipcode } = ctx.request.body;
    try {
        const user = yield user_1.User.findOne({ where: { Username: username } });
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }
        if (Email || Phone) {
            const contact = yield userContact_1.UserContact.findOne({ where: { UserId: user.Id } });
            if (contact) {
                contact.Email = Email !== null && Email !== void 0 ? Email : contact.Email;
                contact.Phone = Phone !== null && Phone !== void 0 ? Phone : contact.Phone;
                yield contact.save();
            }
        }
        if (Street || City || Zipcode) {
            const address = yield userAddress_1.UserAddress.findOne({ where: { UserId: user.Id } });
            if (address) {
                address.Street = Street !== null && Street !== void 0 ? Street : address.Street;
                address.City = City !== null && City !== void 0 ? City : address.City;
                address.Zipcode = Zipcode !== null && Zipcode !== void 0 ? Zipcode : address.Zipcode;
                yield address.save();
            }
        }
        ctx.body = user;
    }
    catch (err) {
        if (err instanceof Error) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
        else {
            ctx.status = 500;
            ctx.body = { message: 'An unknown error occurred' };
        }
    }
}));
// DELETE /users/:username - Delete a user
router.delete('/users/:username', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = ctx.params;
    try {
        const user = yield user_1.User.findOne({ where: { Username: username } });
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
            return;
        }
        yield userContact_1.UserContact.destroy({ where: { UserId: user.Id } });
        yield userAddress_1.UserAddress.destroy({ where: { UserId: user.Id } });
        yield user_1.User.destroy({ where: { Username: username } });
        ctx.body = { message: 'User deleted successfully' };
    }
    catch (err) {
        if (err instanceof Error) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
        else {
            ctx.status = 500;
            ctx.body = { message: 'An unknown error occurred' };
        }
    }
}));
// GET /users/:username - Get user details based on username
router.get('/users/:username', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = ctx.params;
    try {
        const user = yield user_1.User.findOne({
            where: { Username: username },
            include: [userContact_1.UserContact, userAddress_1.UserAddress]
        });
        if (user) {
            ctx.body = user;
        }
        else {
            ctx.status = 404;
            ctx.body = { message: 'User not found' };
        }
    }
    catch (err) {
        if (err instanceof Error) {
            ctx.status = 500;
            ctx.body = { message: err.message };
        }
        else {
            ctx.status = 500;
            ctx.body = { message: 'An unknown error occurred' };
        }
    }
}));
app.use(router.routes());
app.use(router.allowedMethods());
const port = 4000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
