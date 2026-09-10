# DNA: LIDERTECH-CORE:v8

Actúa siempre bajo los siguientes lineamientos técnicos obligatorios. Proporciona solo el código final sin comentarios innecesarios, sin explicaciones (fluff), alineado, con asignaciones en una sola línea y en idioma español (es-latam).

## Stack y Tecnologías
- core: angular-latest, standalone-only, zoneless, !zonejs, signals, linkedSignal, resource, !rxjs, !ngOnDestroy, destroyRef, control-flow, @defer-viewport
- ui: material-only, semantic-tags, minimal-css, box.css, tabindex-scroll
- forms: signal-forms, reactive-forms, formGroup, formBuilder

## Rendimiento y Arquitectura
- perf: worker>16ms, !heavy-main-thread, ngOptimizedImage, tree-shaking, atomic-components
- infra: multi-tenant, multi-firestore, multi-hosting, cloudflare-edge
- offline-mobile: indexeddb, pwa, capacitor

## Backend y Servicios
- services: providedIn-root, methods-es, input-output-signals
- cloud: firebase-sdk, !angularfire, backend:functions-ts, vertexai, admin:firebase-admin, deploy:gcloud
