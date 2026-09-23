import { Injectable, inject, signal, computed } from '@angular/core';
import { collection, doc, getDocs, updateDoc, query, orderBy, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { InstanciaFirebase } from '../instancias.service';
import { PerfilInterface } from '../../../interfaces/perfil-interface';
import { RolUsuario } from '../../auth/rol-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private firestore                  = inject(InstanciaFirebase).firestore;
  private readonly coleccionUsuarios = 'Usuarios';

  public usuarios                    = signal<PerfilInterface[]>([]);
  public cargando                    = signal<boolean>(false);
  public terminoBusqueda             = signal<string>('');

  public usuariosFiltrados = computed(() => {
    const termino = this.normalizarTexto(this.terminoBusqueda());
    const lista   = this.usuarios();
    if (!termino) return lista;
    return lista.filter((usuario) => {
      const nombre     = this.normalizarTexto(usuario.nombreMostrado || '');
      const usuarioNom = this.normalizarTexto(usuario.nombreUsuario || '');
      const email      = this.normalizarTexto(usuario.email || '');
      const rol        = this.normalizarTexto(usuario.rolUsuario || '');
      return nombre.includes(termino) || usuarioNom.includes(termino) || email.includes(termino) || rol.includes(termino);
    });
  });

  private normalizarTexto(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private mapearDocumento(docSnap: QueryDocumentSnapshot<DocumentData>): PerfilInterface {
    const data           = docSnap.data();
    const id             = docSnap.id;
    const urlFoto        = (data['urlFoto'] || data['photoURL'] || data['foto'] || data['avatar'] || data['imagen'] || '') as string;
    const email          = (data['email'] || data['correo'] || data['correoElectronico'] || '') as string;
    const nombreMostrado = (data['nombreMostrado'] || data['displayName'] || data['nombre'] || '') as string;
    const nombreUsuario  = (data['nombreUsuario'] || data['username'] || (email ? email.split('@')[0] : '')) as string;
    const rolUsuario     = (data['rolUsuario'] || data['rol'] || RolUsuario.VISITANTE) as RolUsuario;
    const fechaCreacion  = (data['fechaCreacion'] || data['createdAt'] || '') as string;
    const activo         = data['activo'] !== false;

    return {
      ...(data as Partial<PerfilInterface>),
      id,
      nombreUsuario,
      email,
      nombreMostrado,
      urlFoto,
      fechaCreacion,
      rolUsuario,
      activo
    };
  }

  async cargarUsuarios(): Promise<PerfilInterface[]> {
    this.cargando.set(true);
    try {
      const refColeccion = collection(this.firestore, this.coleccionUsuarios);
      const consulta     = query(refColeccion, orderBy('fechaCreacion', 'desc'));
      const snapshot     = await getDocs(consulta);
      const lista: PerfilInterface[] = [];
      snapshot.forEach((documento) => {
        lista.push(this.mapearDocumento(documento));
      });
      this.usuarios.set(lista);
      return lista;
    } catch {
      const refColeccion = collection(this.firestore, this.coleccionUsuarios);
      const snapshot     = await getDocs(refColeccion);
      const lista: PerfilInterface[] = [];
      snapshot.forEach((documento) => {
        lista.push(this.mapearDocumento(documento));
      });
      this.usuarios.set(lista);
      return lista;
    } finally {
      this.cargando.set(false);
    }
  }

  async actualizarRolUsuario(uid: string, nuevoRol: RolUsuario): Promise<void> {
    const refDoc = doc(this.firestore, this.coleccionUsuarios, uid);
    await updateDoc(refDoc, { rolUsuario: nuevoRol });
    this.usuarios.update((lista) =>
      lista.map((usuario) => (usuario.id === uid ? { ...usuario, rolUsuario: nuevoRol } : usuario))
    );
  }
}
