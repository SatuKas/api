import { Controller, Get } from '@nestjs/common';
import { ResponseData } from 'src/types/api-response.type';
import { HealthResponse } from './health.interface';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('health')
@Public()
export class HealthController {
  @Get()
  checkHealth(): ResponseData<HealthResponse> {
    return {
      message: SuccessMessage.HEALTH_CHECK,
      data: { health: 'ok', timestamp: new Date() },
    };
  }
}
