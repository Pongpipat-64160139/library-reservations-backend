import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConfirmationsService } from './confirmations.service';
import { CreateConfirmationDto } from './dto/create-confirmation.dto';
import { UpdateConfirmationDto } from './dto/update-confirmation.dto';

@Controller('confirmations')
export class ConfirmationsController {
  constructor(private readonly confirmationsService: ConfirmationsService) {}

  @Post()
  create(@Body() createConfirmationDto: CreateConfirmationDto) {
    return this.confirmationsService.create(createConfirmationDto);
  }

  @Get()
  findAll() {
    return this.confirmationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.confirmationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfirmationDto: UpdateConfirmationDto,
  ) {
    return this.confirmationsService.update(+id, updateConfirmationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.confirmationsService.remove(+id);
  }
}
