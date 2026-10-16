import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller.js';
import { TemplateService } from './template.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Templates } from './entitles/template.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Templates,
    ])
  ],
  controllers: [TemplateController],
  providers: [TemplateService]
})
export class TemplateModule {}
