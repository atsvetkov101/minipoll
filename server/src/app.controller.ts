import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('questions')
  getQuestions() {
    return this.appService.getQuestions();
  }

  @Post('answers')
  submitAnswers(@Body() body: unknown) {
    return this.appService.submitAnswers(body);
  }
}
