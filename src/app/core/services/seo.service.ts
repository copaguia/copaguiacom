import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  /**
   * Actualiza las etiquetas básicas y de Open Graph
   */
  public updateSeoTags(config: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
  }): void {
    // 1. Título
    this.titleService.setTitle(config.title);

    // 2. Metadatos Estándar
    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords && config.keywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    // 3. Open Graph (Redes Sociales)
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    
    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
    }
  }

  /**
   * Inyecta JSON-LD Schema de forma dinámica en el Head para Rich Snippets
   */
  public insertSchema(schema: Record<string, any>, schemaType: string = 'LocalBusiness'): void {
    const scriptType = 'application/ld+json';
    const scriptId = `seo-schema-${schemaType.toLowerCase()}`;

    // Remover anterior si existe
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement;
    if (scriptElement) {
      scriptElement.remove();
    }

    // Crear nuevo script
    scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.type = scriptType;
    scriptElement.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': schemaType,
      ...schema
    });

    document.head.appendChild(scriptElement);
  }
}
