import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export default class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Проверка статуса сервера',
  })
  @ApiOkResponse({
    description: 'Сервер запущен и готов к работе',
  })
  @HttpCode(200)
  health(): void {}
}
