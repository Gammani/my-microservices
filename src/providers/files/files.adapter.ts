import { UploadFilePayloadDto } from '../../modules/content/api/models/input/upload-file-payload.dto';
import { UploadFileResultDto } from '../../modules/content/api/models/output/upload-file-result.dto';
import { RemoveFilePayloadDto } from '../../modules/content/api/models/output/remove-file-payload.dto';

export abstract class IFileService {
  abstract uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto>;

  abstract removeFile(dto: RemoveFilePayloadDto): Promise<void>;
}
