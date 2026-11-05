import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { JobsService } from './jobs.service';
class CreateJobDto {
  @IsString() @MinLength(1) @MaxLength(500) message!: string;
}
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}
  @Post() create(@Body() body: CreateJobDto) { return this.jobs.create(body.message); }
  @Get(':id') get(@Param('id') id: string) { return this.jobs.get(id); }
}
