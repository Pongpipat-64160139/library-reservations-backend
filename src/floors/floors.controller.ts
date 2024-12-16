import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FloorsService } from './floors.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Controller('floors')
export class FloorsController {
  constructor(private readonly floorsService: FloorsService) {}

  @Post()
  async create(@Body() createFloorDto: CreateFloorDto) {
    try {
      const newFloor = await this.floorsService.create(createFloorDto);
      return newFloor;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        console.log(error);
        throw new HttpException(
          {
            HttpCode: HttpStatus.CONFLICT,
            message: `Duplicate value detected : ${error.sqlMessage} is already exists in the entity floors.`,
          },
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.floorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFloorDto: UpdateFloorDto) {
    return this.floorsService.update(+id, updateFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorsService.remove(+id);
  }
}
