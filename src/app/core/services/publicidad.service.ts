import { Injectable, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BannerInterface } from '../../components/build/carrusel/carrusel.component';

export interface PublicidadCategoria {
  categoriaId: string;
  slots: BannerInterface[];
  toolbarSlot?: BannerInterface | null;
  ofertaCentralSlot?: BannerInterface | null;
}

@Injectable({
  providedIn: 'root'
})
export class PublicidadService {
  private db = getFirestore(getApp());
  private storage = getStorage(getApp());

  // Caché en memoria para evitar repetidas lecturas (Firestore-ultra-low cost strategy)
  private cache             = new Map<string, BannerInterface[]>();
  private cacheToolbar      = new Map<string, BannerInterface | null>();
  private cacheOfertaCentral = new Map<string, BannerInterface | null>();

  // Signal: Set de categoríaIds cuya promo ya vio este usuario (persiste en localStorage)
  promosVistasLocalmente = signal<Set<string>>(this.leerVistasLocales());

  private leerVistasLocales(): Set<string> {
    try {
      const raw = localStorage.getItem('promos_vistas') ?? '[]';
      return new Set<string>(JSON.parse(raw));
    } catch { return new Set(); }
  }

  marcarPromoVista(categoriaId: string): void {
    const actual = new Set(this.promosVistasLocalmente());
    actual.add(categoriaId);
    this.promosVistasLocalmente.set(actual);
    try { localStorage.setItem('promos_vistas', JSON.stringify([...actual])); } catch {}
  }

  async registrarVistaEnFirestore(categoriaId: string): Promise<void> {
    const sessionKey = `promo_vista_session_${categoriaId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');
    try {
      const docRef = doc(this.db, 'ads', categoriaId);
      await updateDoc(docRef, { toolbarSlotVistas: increment(1) });
    } catch {}
  }

  async obtenerBanners(categoriaId: string): Promise<BannerInterface[]> {
    if (this.cache.has(categoriaId)) {
      return this.cache.get(categoriaId)!;
    }

    try {
      const docRef = doc(this.db, 'ads', categoriaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as PublicidadCategoria;
        const slots = data.slots && data.slots.length === 5 ? data.slots : this.generarSlotsVacios();
        this.cache.set(categoriaId, slots);
        this.cacheToolbar.set(categoriaId, data.toolbarSlot || null);
        this.cacheOfertaCentral.set(categoriaId, data.ofertaCentralSlot || null);
        return slots;
      } else {
        const slotsVacios = this.generarSlotsVacios();
        this.cache.set(categoriaId, slotsVacios);
        this.cacheToolbar.set(categoriaId, null);
        this.cacheOfertaCentral.set(categoriaId, null);
        return slotsVacios;
      }
    } catch (error) {
      console.error('Error obteniendo banners:', error);
      return this.generarSlotsVacios();
    }
  }

  async obtenerTodosLosAnuncios(): Promise<Record<string, PublicidadCategoria>> {
    const todos: Record<string, PublicidadCategoria> = {};
    try {
      const colRef = collection(this.db, 'ads');
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach(doc => {
        todos[doc.id] = doc.data() as PublicidadCategoria;
      });
      return todos;
    } catch (error) {
      console.error('Error obteniendo todos los anuncios:', error);
      return todos;
    }
  }

  async obtenerCategoriasConPromo(categoriaIds: string[]): Promise<Set<string>> {
    const conPromo = new Set<string>();
    await Promise.all(
      categoriaIds.map(async id => {
        const ad = await this.obtenerToolbarAd(id);
        if (ad?.image) conPromo.add(id);
      })
    );
    return conPromo;
  }

  escucharPromocionesActivas(
    categoriaIds: string[],
    onUpdate: (conPromo: Set<string>) => void
  ): () => void {
    const idsSet = new Set(categoriaIds);
    const colRef  = collection(this.db, 'ads');
    const unsub   = onSnapshot(colRef, snapshot => {
      const conPromo = new Set<string>();
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as PublicidadCategoria;
        if (idsSet.has(docSnap.id) && data.toolbarSlot?.image) {
          conPromo.add(docSnap.id);
          this.cacheToolbar.set(docSnap.id, data.toolbarSlot);
        } else {
          this.cacheToolbar.set(docSnap.id, null);
        }
      });
      onUpdate(conPromo);
    });
    return unsub;
  }

  async obtenerToolbarAd(categoriaId: string): Promise<BannerInterface | null> {
    if (this.cacheToolbar.has(categoriaId)) {
      return this.cacheToolbar.get(categoriaId)!;
    }
    
    // Si no está en caché, intentamos cargar los banners generales (que cargarán también el toolbar)
    await this.obtenerBanners(categoriaId);
    return this.cacheToolbar.get(categoriaId) || null;
  }

  async obtenerOfertaCentralAd(categoriaId: string): Promise<BannerInterface | null> {
    if (this.cacheOfertaCentral.has(categoriaId)) {
      return this.cacheOfertaCentral.get(categoriaId)!;
    }
    
    await this.obtenerBanners(categoriaId);
    return this.cacheOfertaCentral.get(categoriaId) || null;
  }

  async guardarBanner(
    categoriaId: string, 
    slotIndex: number, 
    file: File | null, 
    patrocinador: string,
    whatsapp?: number,
    phoneFijo?: number,
    fechaCaducidad?: string
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

      const currentBanner: BannerInterface = {
        id: slotIndex.toString(),
        image: imageUrl,
        patrocinador: patrocinador || ''
      };
      if (whatsapp !== undefined) currentBanner.whatsapp = whatsapp;
      if (phoneFijo !== undefined) currentBanner.phoneFijo = phoneFijo;
      if (fechaCaducidad) currentBanner.fechaCaducidad = fechaCaducidad;

      currentBanners[slotIndex] = currentBanner;

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
        patrocinador: patrocinador || ''
      };
      if (whatsapp !== undefined) toolbarSlot.whatsapp = whatsapp;
      if (phoneFijo !== undefined) toolbarSlot.phoneFijo = phoneFijo;

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

  async guardarOfertaCentralAd(
    categoriaId: string, 
    file: File | null, 
    patrocinador: string,
    whatsapp?: number,
    phoneFijo?: number,
    fechaCaducidad?: string
  ): Promise<void> {
    try {
      let imageUrl = '';
      const currentOfertaAd = await this.obtenerOfertaCentralAd(categoriaId);
      
      if (file) {
        const storageRef = ref(this.storage, `publicidad/${categoriaId}/oferta-central-${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        imageUrl = currentOfertaAd?.image || '';
      }

      const ofertaCentralSlot: BannerInterface = {
        id: 'oferta-central',
        image: imageUrl,
        patrocinador: patrocinador || ''
      };
      if (whatsapp !== undefined) ofertaCentralSlot.whatsapp = whatsapp;
      if (phoneFijo !== undefined) ofertaCentralSlot.phoneFijo = phoneFijo;
      if (fechaCaducidad) ofertaCentralSlot.fechaCaducidad = fechaCaducidad;

      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, ofertaCentralSlot }, { merge: true });
      
      this.cacheOfertaCentral.set(categoriaId, ofertaCentralSlot);

    } catch (error) {
      console.error('Error guardando oferta central ad:', error);
      throw error;
    }
  }

  async eliminarOfertaCentralAd(categoriaId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'ads', categoriaId);
      await setDoc(docRef, { categoriaId, ofertaCentralSlot: null }, { merge: true });
      this.cacheOfertaCentral.set(categoriaId, null);
    } catch (error) {
      console.error('Error eliminando oferta central ad:', error);
      throw error;
    }
  }

  private generarSlotsVacios(): BannerInterface[] {
    return [
      { id: '0', image: '', patrocinador: '' },
      { id: '1', image: '', patrocinador: '' },
      { id: '2', image: '', patrocinador: '' },
      { id: '3', image: '', patrocinador: '' },
      { id: '4', image: '', patrocinador: '' }
    ];
  }
}
