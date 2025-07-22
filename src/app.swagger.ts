import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InternalServerErrorSwagger, UnauthorizedSwagger } from "./helpers/common.service";

// @ApiTags at the controller level
export function AppTag() {
  return ApiTags("App");
}

// Swagger decorator for hello world
export function HelloSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Hello World" }),
    ApiResponse({
      status: 200,
      description: "Hello World",
      schema: {
        example: {
          statusCode: 200,
          message: "Hello World",
        },
      },
    }),
    UnauthorizedSwagger(),
    InternalServerErrorSwagger()
  );
}
