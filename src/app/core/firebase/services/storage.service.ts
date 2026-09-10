import { Injectable, inject } from '@angular/core';
import { InstanciaFirebase } from '../instancias.service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(InstanciaFirebase).storage;

  /**
   * Sube un archivo a Firebase Storage y retorna su URL de descarga.
   * @param path Ruta donde se guardará en Storage (ej: 'notificaciones/mi-imagen.jpg')
   * @param file El archivo a subir
   */
  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }
}
