**WebAPI-Lab**

Packages installation:<br />
npm i koa koa-bodyparser koa-json koa-logger <br />
npm i koa-router@11.0.2<br />
npm i @types/koa<br />
npm i @types/koa-bodyparser<br />
npm i @types/koa-json<br />
npm i @types/koa-logger<br />
npm i @types/koa-router<br />
<br />

<b>Setup the Web Server:</b><br />
    1. npx tsc -init<br />
    2. edit "tsconfig.json"<br />
        "outDir": "./out",<br />
        ...<br />
        "verbatimModuleSyntax": false,<br />
    3. Create "out" folder<br />
    4. Setup the database
<br />

<b>Running the code:</b><br />
    tsc<br />
    node .\out\<br />
<br />
