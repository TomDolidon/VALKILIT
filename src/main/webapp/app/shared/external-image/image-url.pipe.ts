import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  private bucketUrl = 'https://valkylit-image-bucket.s3.eu-west-3.amazonaws.com/';
  private noImageUrl = 'https://valkylit-image-bucket.s3.eu-west-3.amazonaws.com/No_Cover.jpg';
  transform(value?: string | null): string {
    if (value !== null && value !== undefined && value !== '') {
      return `${this.bucketUrl}${value}`;
    }
    return this.noImageUrl;
  }
}
