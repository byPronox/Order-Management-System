import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'order-management-backend',
      timestamp: new Date().toISOString(),
    };
  }
}