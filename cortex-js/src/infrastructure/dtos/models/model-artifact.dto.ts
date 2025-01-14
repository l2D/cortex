import { IsString } from 'class-validator';
import { ModelArtifact } from '@/domain/models/model.interface';
import { ApiProperty } from '@nestjs/swagger';

export class ModelArtifactDto implements ModelArtifact {
  @ApiProperty({ description: 'The mmproj bin file url.' })
  @IsString()
  mmproj?: string;
  @ApiProperty({ description: 'The llama model bin file url.' })
  @IsString()
  llama_model_path?: string;
}
