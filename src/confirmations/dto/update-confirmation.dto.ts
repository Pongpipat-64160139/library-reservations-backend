import { PartialType } from '@nestjs/mapped-types';
import { CreateConfirmationDto } from './create-confirmation.dto';

export class UpdateConfirmationDto extends PartialType(CreateConfirmationDto) {
//   roleId?: number;
//   roomId?: number;
//   userId?: number;
}
