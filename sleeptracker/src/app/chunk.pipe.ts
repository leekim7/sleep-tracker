import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk',
})
export class ChunkPipe implements PipeTransform {
  transform(array: any[], chunkSize: number): any[][] {
    if (!array || !array.length) return [];
    return Array(Math.ceil(array.length / chunkSize))
      .fill([])
      .map((_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
  }
}
