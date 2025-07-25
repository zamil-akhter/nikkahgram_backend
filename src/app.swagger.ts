import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InternalServerErrorSwagger, UnauthorizedSwagger } from "./helpers/utility";

// @ApiTags at the controller level
export function AppTag() {
  return ApiTags("App");
}
