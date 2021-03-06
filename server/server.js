'use strict'

const Koa = require('koa');
const app = new Koa();

module.exports = async function (resStr) {
    app.use(async ctx => {
        if ( resStr ) {
            ctx.body = resStr;
            return;
        }
        async function getBody () {
            return new Promise(function (reslove, reject) {
                let postdata = "";
                ctx.req.addListener('data', (data) => {
                    postdata += data;
                })
                ctx.req.addListener("end", function() {
                    reslove(postdata);
                });
            });
        }
        let bodyData = await getBody();
        bodyData = bodyData !== "" ? bodyData : 'no body';
        let response = `
> [header]: \n${JSON.stringify(ctx.header)}
> [query data]: \n${JSON.stringify(ctx.query)}
> [body data]: \n${bodyData}
        `;
        ctx.body = response;
    });
    app.listen(3000);
}