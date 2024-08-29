import Koa, { Context } from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import sequelize from './models';
import { User } from './models/user';
import { UserContact } from './models/userContact';
import { UserAddress } from './models/userAddress';

// Define TypeScript interfaces for request bodies
interface CreateUserRequest {
  Username: string;
  Password: string;
  Email: string;
  Phone?: string;  
  Street?: string;
  City?: string;
  Zipcode?: string;
}

interface UpdateUserRequest {
  Email?: string;
  Phone?: string;
  Street?: string;
  City?: string;
  Zipcode?: string;
}

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Sync database
sequelize.sync();

// POST /users - Register a new user
router.post('/users', async (ctx: Context) => {
  const { Username, Password, Email, Phone, Street, City, Zipcode } = ctx.request.body as CreateUserRequest;

  // Validate required fields
  if (!Username || !Password) {
    ctx.status = 400;
    ctx.body = { message: 'Username and Password are required' };
    return;
  }

  try {
    // Create user
    const user = await User.create({ Username, Password });
    
    // Create associated records
    await UserContact.create({ UserId: user.Id, Email, Phone });
    await UserAddress.create({ UserId: user.Id, Street, City, Zipcode });

    // Respond with the created user
    ctx.status = 201;
    ctx.body = user;
  } catch (err: unknown) {
    // Handle errors
    if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { message: 'An unknown error occurred' };
    }
  }
});


// PUT /users/:username - Update user contact and address information
router.put('/users/:username', async (ctx: Context) => {
  const { username } = ctx.params;
  const { Email, Phone, Street, City, Zipcode } = ctx.request.body as UpdateUserRequest;

  try {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }

    if (Email || Phone) {
      const contact = await UserContact.findOne({ where: { UserId: user.Id } });
      if (contact) {
        contact.Email = Email ?? contact.Email;
        contact.Phone = Phone ?? contact.Phone;
        await contact.save();
      }
    }

    if (Street || City || Zipcode) {
      const address = await UserAddress.findOne({ where: { UserId: user.Id } });
      if (address) {
        address.Street = Street ?? address.Street;
        address.City = City ?? address.City;
        address.Zipcode = Zipcode ?? address.Zipcode;
        await address.save();
      }
    }

    ctx.body = user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { message: 'An unknown error occurred' };
    }
  }
});

// DELETE /users/:username - Delete a user
router.delete('/users/:username', async (ctx: Context) => {
  const { username } = ctx.params;

  try {
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
      return;
    }

    await UserContact.destroy({ where: { UserId: user.Id } });
    await UserAddress.destroy({ where: { UserId: user.Id } });
    await User.destroy({ where: { Username: username } });

    ctx.body = { message: 'User deleted successfully' };
  } catch (err: unknown) {
    if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { message: 'An unknown error occurred' };
    }
  }
});

// GET /users/:username - Get user details based on username
router.get('/users/:username', async (ctx: Context) => {
  const { username } = ctx.params;

  try {
    const user = await User.findOne({
      where: { Username: username },
      include: [UserContact, UserAddress]
    });

    if (user) {
      ctx.body = user;
    } else {
      ctx.status = 404;
      ctx.body = { message: 'User not found' };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      ctx.status = 500;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { message: 'An unknown error occurred' };
    }
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 4000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});