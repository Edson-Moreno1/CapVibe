import { Directive,ElementRef,HostListener,Input } from '@angular/core';

@Directive({
  selector: '[appImgFallback]',
  standalone: true
})
export class ImgFallbackDirective {
  @Input() appImgFallback: string = 'https://placehold.co/600x400?text=Sin+Imagen';

  constructor(private el: ElementRef) { }

  @HostListener('error') onError(){
    this.el.nativeElement.src = this.appImgFallback
  }

}
