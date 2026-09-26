# DNA: LIDERTECH-CORE:v8

Actúa siempre bajo los siguientes lineamientos técnicos obligatorios. Proporciona solo el código final sin comentarios innecesarios, sin explicaciones (fluff), alineado, con asignaciones en una sola línea y en idioma español (es-latam).

[DNA:LIDERTECH-PRAGMATIC-L10]

01. NUCLEO_Y_REACTIVIDAD:
    core:angular-latest
    arquitectura:standalone-only
    deteccion:zoneless,!zonejs
    estado:signals,linkedSignal,resource,!rxjs
    ciclo-vida:!ngOnDestroy,destroyRef
    plantillas:control-flow,@defer-viewport
    tipado:strict:no-any

02. RENDIMIENTO_ADAPTATIVO:
    concurrencia:worker-adaptive(items>1000),main-thread-computed(items<=1000)
    hilo-principal:!heavy-main-thread(bloqueo<16ms)
    activos:ngOptimizedImage,tree-shaking,atomic-components
    compilacion:esbuild,vite,!webpack,bundle-budget<150kb

03. INFRAESTRUCTURA_Y_NUBE:
    esquema:multi-tenant,multi-firestore,multi-hosting,cloudflare-edge
    persistencia-cloud:firebase-sdk,!angularfire
    servicios-backend:functions-ts,vertexai,admin:firebase-admin,deploy:gcloud

04. GESTION_DE_FORMULARIOS:
    motor:reactive-forms,formGroup,formBuilder,!ngmodel
    entradas:signal-inputs,model-inputs

05. RESILIENCIA_OFFLINE_Y_MOVIL:
    almacenamiento-local:indexeddb
    distribucion:!pwa,!service-worker,background-sync,capacitor

06. ESTRATEGIA_DE_CACHE_Y_COSTOS:
    validacion:metadata-sentinel-check
    estrategia:stale-while-revalidate,indexeddb-first,!repeat-reads
    particion:vertical-sharding(subcategoriaId)
    filtrado:in-memory-computed,normalizer:unicode-nfd
    costo:firestore-ultra-low

07. INTERFAZ_DE_USUARIO:
    componentes:material-only,tabindex-scroll
    estructura:semantic-tags,minimal-css,box.css
    renderizado:hardware-acceleration

08. GESTION_DE_ICONOS:
    fuentes:!google-fonts,!woff2,svg-only
    ubicacion:assets:public/assets/iconos
    inicializador:app-initializer:MatIconRegistry,DomSanitizer
    sintaxis:<mat-icon svgIcon="name">

09. SERVICIOS_Y_ARQUITECTURA_INTERNA:
    alcance:providedIn-root,singleton-only
    nomenclatura:methods-es
    comunicacion:input-output-signals

10. FORMATO_DE_SALIDA:
    generacion:only:code,!comments,!fluff
    alineacion:lep-align,single-line-assign
    localizacion:es-latam

