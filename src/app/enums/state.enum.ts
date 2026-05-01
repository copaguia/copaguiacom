export enum StateEnum {
    // --- Ciclo de Vida General ---
    INICIAL         = 'inicial',      
    CARGANDO        = 'cargando',    
    PAGINANDO       = 'paginando',  
    PROCESANDO      = 'procesando',
    PENDIENTE_RED   = 'pendiente_red', 
    
    // --- Resultados ---
    EXITO           = 'exito',          
    ERROR           = 'error',          
    TIMEOUT         = 'timeout',      

    // --- Contenido ---
    VACIO           = 'vacio',          
    SIN_RESULTADOS  = 'sin_resultados', 
    
    // --- Interacción / Autorización ---
    DESHABILITADO   = 'deshabilitado', 
    AUTENTICANDO    = 'autenticando',
    AUTORIZADO      = 'autorizado',  
    NO_AUTORIZADO   = 'no_autorizado',

    // --- Conectividad / Hardware ---
    EN_LINEA        = 'en_linea',    
    FUERA_LINEA     = 'fuera_linea', 
    CONECTADO       = 'conectado',  
    DESCONECTADO    = 'desconectado',
    MONITOREANDO    = 'monitoreando',
    FALLO_SENSOR    = 'fallo_sensor',
    CALIBRANDO      = 'calibrando',

    // --- Flujo / Multimedia ---
    REPRODUCIENDO   = 'reproduciendo',
    PAUSADO         = 'pausado',      
    LISTO           = 'listo',          
    TERMINADO       = 'terminado',  
}