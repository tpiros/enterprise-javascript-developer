const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'HTTP GET example';
})
.post('/', (ctx, next) => {
  ctx.body = 'HTTP POST example';
})

app.use(router.routes());

app.listen(3000, () => console.log('Server running on port 3000'));