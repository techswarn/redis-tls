import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('fibonacci')
  getFibonacci(@Query('n', ParseIntPipe) n: number): Promise<number> {
    return this.appService.getFibonacci(n);
  }
}
