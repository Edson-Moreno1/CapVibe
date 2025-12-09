import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

// Core & Shared
import { ProductService } from '../../../core/services/product.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  productId: string | null = null;
  errorMessage: string = '';

  constructor() {
    // Definimos el formulario con validaciones (Rúbrica III.5)
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      color: ['', Validators.required], // Usamos color porque tu backend lo pide
      category: ['', Validators.required], // Aquí irá el ID de la categoría
      images: [''], // Por simplicidad, manejaremos 1 imagen como URL de texto
      isActive: [true]
    });
  }

  ngOnInit(): void {
    // Verificamos si hay un ID en la URL
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loadProductData(this.productId);
      }
    });
  }

  loadProductData(id: string) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: any) => { // any temporal para flexibilidad
        // Llenamos el formulario con los datos existentes
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          brand: product.brand,
          color: product.color,
          // Si category es objeto populado, sacamos el _id, si es string, lo usamos directo
          category: product.category?._id || product.category, 
          images: product.images?.[0] || '', // Tomamos la primera imagen
          isActive: product.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudo cargar el producto.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Preparamos los datos
    const formData = this.productForm.value;

    const imageUrl = formData.images ? formData.images.trim():'';

    const imagesArray = imageUrl ? [imageUrl] : [];
    
    // Convertimos la imagen de string a array (tu backend espera array)
    const payload = {
      ...formData,
      images: imagesArray,

      price:Number(formData.price),
      stock:Number(formData.stock),
    };

    if (this.isEditMode && this.productId) {
      // --- MODO EDICIÓN (UPDATE) ---
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // --- MODO CREACIÓN (CREATE) ---
      this.productService.createProduct(payload).subscribe({
        next: () => {
          alert('Producto creado correctamente');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any) {
    console.error(err);
    this.isLoading = false;
    // Mostramos mensaje del backend si existe
    this.errorMessage = err.error?.message || 'Ocurrió un error al guardar.';
  }
}