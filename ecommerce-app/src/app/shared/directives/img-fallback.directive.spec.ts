import { ImgFallbackDirective } from './img-fallback.directive';
import { ElementRef } from '@angular/core';

describe('ImgFallbackDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('img') } as ElementRef;
    const directive = new ImgFallbackDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
