import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";
import {router as articles} from "./routes/articles";


const app: Koa = new Koa();
const router: Router = new Router();

const welcomeAPI = async (ctx: RouterContext, next: any) => {
ctx.body = {
message: "Welcome to the blog API!"
};
await next();
}



const customErrorMessage: CustomErrorMessageFunction = (
        _ctx: any,
        value: string
    ) => {
        return (
            `The name must be between 3 and 20 ` +
            `characters long but received length ${value.length}`
        );
};

const validatorName = [
    body("name").isLength({ min: 3 }).withMessage(customErrorMessage).build(),
    // body("id").isInt({ min: 10000, max: 20000 }).build()
]

const film = [
        {
            id: 1,
            title: "Star War I",
            year: "1980"
        },
        {
            id: 2,
            title: "Star War II",
            year: "1985"
        },
        {
            id: 3,
            title: "Star War III",
            year: "1990"
        }
    ];

// router.get('/', async (ctx: RouterContext, next: any) => {
router.get('/', ...validatorName, async (ctx: any, next: any) => {
    const result = validationResults(ctx);
    if( result.hasErrors() ){
        ctx.status = 422;
        ctx.body = { err: result.mapped() }
    }else{
        const name = ctx.request.body.name;
        ctx.body = { msg: `Hello world! ${name}` };
    }
    await next();
})

router.get('/film', async (ctx: RouterContext, next: any) => {
    ctx.body = film;
    await next();
})

router.get('/film/:id', async (ctx: any, next: any) => {
    const id = ctx.params.id;
    film.forEach((f,i) => {
        if (id == f.id){
            ctx.body = film[i];
        }
    });
})

router.post('/film', async (ctx: any, next: any) => {
    const data = ctx.request.body;
    film.push(data);
    ctx.body = data
    await next();
})

router.put('/film', async (ctx: any, next: any) => {
    const data = ctx.request.body;
    film.forEach((f) => {
        if (data.id == f.id) {
            f.title = data.title;
            f.year = data.year;
        }
    })
    ctx.body = film;
    await next();
})

router.get('/api/v1', welcomeAPI);

router.post('/', async (ctx: RouterContext, next: any) => {
    const data = ctx.request.body;
    ctx.body = data;
    await next();
})

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx: RouterContext, next: any) => {
    try {
        await next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = { err: "No such endpoint existed" };
        }
    } catch (err: any) {
        ctx.body = { err: err };
    }
})
// Other code statements go here
app.use(articles.routes());

app.listen(10888, () => {
    console.log("Koa Started");
})

