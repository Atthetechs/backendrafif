"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '../views'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '../views'));
    app.setViewEngine('hbs');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('All API For Test')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(5001);
    console.log('server is running on 5001');
}
bootstrap();
//# sourceMappingURL=main.js.map