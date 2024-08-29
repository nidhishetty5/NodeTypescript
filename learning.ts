/*import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();


interface Item {
    id: string;
    name: string;
}


const datastore: { [id: string]: Item } = {
    "1": { id: "1", name: "John" }, 
};


app.use(bodyParser());


router.get('/test', (ctx) => {
    ctx.body = Object.values(datastore);
});


router.get('/test/:id', (ctx) => {
    const item = datastore[ctx.params.id];
    if (item) {
        ctx.body = item;
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Item not found' };
    }
});


router.post('/test', (ctx) => {
    const newItem = ctx.request.body as Item; 

    if (newItem && newItem.id && newItem.name) {
        datastore[newItem.id] = newItem;
        ctx.body = newItem;
        ctx.status = 201; 
    } else {
        ctx.status = 400;
        ctx.body = { error: 'Invalid item data' };
    }
});

router.put('/test/:id', (ctx) => {
    const id = ctx.params.id;
    const updatedItem = ctx.request.body as Item; 
    if (datastore[id]) {
        if (updatedItem && updatedItem.id && updatedItem.name) {
            datastore[id] = updatedItem;
            ctx.body = updatedItem;
        } else {
            ctx.status = 400;
            ctx.body = { error: 'Invalid item data' };
        }
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Item not found' };
    }
});

router.delete('/test/:id', (ctx) => {
    const id = ctx.params.id;
    if (datastore[id]) {
        delete datastore[id];
        ctx.status = 204; 
    } else {
        ctx.status = 404;
        ctx.body = { error: 'Item not found' };
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); */


/*import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

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

const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});  */ 



//{
 //   "compilerOptions": {
    //  "target": "ES6",
     // "module": "commonjs",
     // "outDir": "./dist",
     // "rootDir": "./src",
    //  "strict": true,
    //  "esModuleInterop": true
   // },
   // "include": ["src/**/*"],
    //"exclude": ["node_modules"]
 // }
   

 //app.ts

 /*import Koa, { Context } from 'koa';
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

  try {
    const user = await User.create({ Username, Password });
    await UserContact.create({ UserId: user.Id, Email, Phone });
    await UserAddress.create({ UserId: user.Id, Street, City, Zipcode });
    ctx.status = 201;
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
*/


//package.json



// {
//   "name": "nodetypescript",
//   "version": "1.0.0",
//   "main": "index.js",
//   "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "description": "",
//   "dependencies": {
//     "@koa/router": "^12.0.1",
//     "koa": "^2.15.3",
//     "koa-bodyparser": "^4.4.1",
   
//     "sequelize": "^6.37.3",
//     "sequelize-typescript": "^2.1.6",
//     "tedious": "^18.6.2",
//     "koa-router": "^latest-version"
//   },
//   "devDependencies": {
//     "@types/koa": "^2.15.0",
//     "@types/koa__router": "^12.0.4",
//     "@types/koa-bodyparser": "^4.3.12",
//     "@types/koa-router": "^7.4.8",
//     "@types/node": "^22.4.1",
//     "@types/sequelize": "^4.28.20",
//     "ts-node": "^10.9.2",
//     "typescript": "^5.5.4"
//   }
// }

