import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  static readonly EXTERNAL_IMAGE_BASE_URL = 'https://valkylit-image-bucket.s3.eu-west-3.amazonaws.com/';
  static readonly EXTERNAL_IMAGE_DEFAULT_URL = 'https://valkylit-image-bucket.s3.eu-west-3.amazonaws.com/No_Cover.jpg';

  transform(value?: string | null): string {
    if (value !== null && value !== undefined && value !== '') {
      return `${ImageUrlPipe.EXTERNAL_IMAGE_BASE_URL}${value}`;
    }
    return ImageUrlPipe.EXTERNAL_IMAGE_DEFAULT_URL;
  }
}
