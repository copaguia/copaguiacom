import { Injectable } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BannerInterface } from '../../components/build/carrusel/carrusel.component';

export interface PublicidadCategoria {
  categoriaId: string;
  slots: BannerInterface[];
  toolbarSlot?: BannerInterface | null;
}

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {
  private db = getFirestore(getApp());
  private storage = getStorage(getApp());

  // Caché en memoria para evitar repetidas lecturas (Firestore-ultra-low cost strategy)
  private cache = new Map<string, BannerInterface[]>();
  private cacheToolbar = new Map<string, BannerInterface | null>();

  constructor() {}

  async obtenerBanners(categoriaId: string): Promise<BannerInterface[]> {
    if (this.cache.has(categoriaId)) {
      return this.cache.get(categoriaId)!;
    }

    try {
      const docRef = doc(this.db, 'ads', categoriaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PublicidadCategoria;
        const slots = data.slots && data.slots.length === 3 ? data.slots : this.generarSlotsVacios();
        this.cache.set(categoriaId, slots);
        this.cacheToolbar.set(categoriaId, data.toolbarSlot || null);
        return slots;
      } else {
        const slotsVacios = this.generarSlotsVacios();
        this.cache.set(categoriaId, slotsVacios);
        this.cacheToolbar.set(categoriaId, null);
        return slotsVacios;
      }
    } catch (error) {
      console.error('Error obteniendo banners:', error);
      return this.generarSlotsVacios();
    }
  }

  async obtenerToolbarAd(categoriaId: string): Promise<BannerInterface | null> {
    if (this.cacheToolbar.has(categoriaId)) {
      return this.cacheToolbar.get(categoriaId)!;
    }
    
    // Si no está en caché, intentamos cargar los banners generales (que cargarán también el toolbar)
    await this.obtenerBanners(categoriaId);
    return this.cacheToolbar.get(categoriaId) || null;
  }

  async guardarBanner(
    categoriaId: string, 
    slotIndex: number, 
    file: File | null, 
    patrocinador: string,
    whatsapp?: number,
    phoneFijo?: number
  ): Promise<void> {
    try {
      let imageUrl = '';
      const currentBanners = await this.obtenerBanners(categoriaId);
      
      if (file) {
        const storageRef = ref(this.storage, `publicidad/${categoriaId}/slot-${slotIndex}-${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        imageUrl = currentBanners[slotIndex].image;
      }

      currentBanners[slotIndex] = {
        id: slotIndex.toString(),
        image: imageUrl,
        patrocinador: patrocinador || '',
        whatsapp: whatsapp,
        phoneFijo: phoneFijo
      };

      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, slots: currentBanners }, { merge: true });
      
      this.cache.set(categoriaId, currentBanners);

    } catch (error) {
      console.error('Error guardando banner:', error);
      throw error;
    }
  }

  async eliminarBanner(categoriaId: string, slotIndex: number): Promise<void> {
    try {
      const currentBanners = await this.obtenerBanners(categoriaId);
      currentBanners[slotIndex] = { id: slotIndex.toString(), image: '', patrocinador: '' };
      
      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, slots: currentBanners }, { merge: true });
      
      this.cache.set(categoriaId, currentBanners);
    } catch (error) {
      console.error('Error eliminando banner:', error);
      throw error;
    }
  }

  async guardarToolbarAd(
    categoriaId: string, 
    file: File | null, 
    patrocinador: string,
    whatsapp?: number,
    phoneFijo?: number
  ): Promise<void> {
    try {
      let imageUrl = '';
      const currentToolbarAd = await this.obtenerToolbarAd(categoriaId);
      
      if (file) {
        const storageRef = ref(this.storage, `publicidad/${categoriaId}/toolbar-${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        imageUrl = currentToolbarAd?.image || '';
      }

      const toolbarSlot: BannerInterface = {
        id: 'toolbar',
        image: imageUrl,
        patrocinador: patrocinador || '',
        whatsapp: whatsapp,
        phoneFijo: phoneFijo
      };

      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, toolbarSlot }, { merge: true });
      
      this.cacheToolbar.set(categoriaId, toolbarSlot);

    } catch (error) {
      console.error('Error guardando toolbar ad:', error);
      throw error;
    }
  }

  async eliminarToolbarAd(categoriaId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, toolbarSlot: null }, { merge: true });
      this.cacheToolbar.set(categoriaId, null);
    } catch (error) {
      console.error('Error eliminando toolbar ad:', error);
      throw error;
    }
  }

  private generarSlotsVacios(): BannerInterface[] {
    return [
      { id: '0', image: '', patrocinador: '' },
      { id: '1', image: '', patrocinador: '' },
      { id: '2', image: '', patrocinador: '' }
    ];
  }
}
