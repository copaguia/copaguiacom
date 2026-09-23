export interface MunicipioAntioquia {
  id: string;
  nombre: string;
  subregion: string;
  dominioPropuesto: string;
  descripcion: string;
  estado: "PENDIENTE" | "PROVISIONANDO" | "ACTIVO";
  mapaActivo?: boolean;
  limitePoligonal?: any;
}

export const MUNICIPIOS_ANTIOQUIA: MunicipioAntioquia[] = [
  {
    id: 'medellin',
    nombre: 'Medellín',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiamedellin.com',
    descripcion: 'Directorio comercial y cultural del municipio de Medellín, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'bello',
    nombre: 'Bello',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiabello.com',
    descripcion: 'Directorio comercial y cultural del municipio de Bello, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'itagui',
    nombre: 'Itagüí',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiaitagui.com',
    descripcion: 'Directorio comercial y cultural del municipio de Itagüí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'envigado',
    nombre: 'Envigado',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiaenvigado.com',
    descripcion: 'Directorio comercial y cultural del municipio de Envigado, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sabaneta',
    nombre: 'Sabaneta',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiasabaneta.com',
    descripcion: 'Directorio comercial y cultural del municipio de Sabaneta, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'copacabana',
    nombre: 'Copacabana',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiacopacabana.com',
    descripcion: 'Directorio comercial y cultural del municipio de Copacabana, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'laestrella',
    nombre: 'La Estrella',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guialaestrella.com',
    descripcion: 'Directorio comercial y cultural del municipio de La Estrella, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caldas',
    nombre: 'Caldas',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiacaldas.com',
    descripcion: 'Directorio comercial y cultural del municipio de Caldas, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'girardota',
    nombre: 'Girardota',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiagirardota.com',
    descripcion: 'Directorio comercial y cultural del municipio de Girardota, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'barbosa',
    nombre: 'Barbosa',
    subregion: 'Valle de Aburrá',
    dominioPropuesto: 'guiabarbosa.com',
    descripcion: 'Directorio comercial y cultural del municipio de Barbosa, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'rionegro',
    nombre: 'Rionegro',
    subregion: 'Oriente',
    dominioPropuesto: 'guiarionegro.com',
    descripcion: 'Directorio comercial y cultural del municipio de Rionegro, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'marinilla',
    nombre: 'Marinilla',
    subregion: 'Oriente',
    dominioPropuesto: 'guiamarinilla.com',
    descripcion: 'Directorio comercial y cultural del municipio de Marinilla, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'laceja',
    nombre: 'La Ceja',
    subregion: 'Oriente',
    dominioPropuesto: 'guialaceja.com',
    descripcion: 'Directorio comercial y cultural del municipio de La Ceja, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'guarne',
    nombre: 'Guarne',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaguarne.com',
    descripcion: 'Directorio comercial y cultural del municipio de Guarne, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'elcarmendeviboral',
    nombre: 'El Carmen de Viboral',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaelcarmendeviboral.com',
    descripcion: 'Directorio comercial y cultural del municipio de El Carmen de Viboral, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'elretiro',
    nombre: 'El Retiro',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaelretiro.com',
    descripcion: 'Directorio comercial y cultural del municipio de El Retiro, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'santuario',
    nombre: 'Santuario',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasantuario.com',
    descripcion: 'Directorio comercial y cultural del municipio de Santuario, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'abejorral',
    nombre: 'Abejorral',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaabejorral.com',
    descripcion: 'Directorio comercial y cultural del municipio de Abejorral, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'alejandria',
    nombre: 'Alejandría',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaalejandria.com',
    descripcion: 'Directorio comercial y cultural del municipio de Alejandría, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'argelia',
    nombre: 'Argelia',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaargelia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Argelia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'cocorna',
    nombre: 'Cocorná',
    subregion: 'Oriente',
    dominioPropuesto: 'guiacocorna.com',
    descripcion: 'Directorio comercial y cultural del municipio de Cocorná, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'concepcion',
    nombre: 'Concepción',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaconcepcion.com',
    descripcion: 'Directorio comercial y cultural del municipio de Concepción, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'elpenol',
    nombre: 'El Peñol',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaelpenol.com',
    descripcion: 'Directorio comercial y cultural del municipio de El Peñol, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'granada',
    nombre: 'Granada',
    subregion: 'Oriente',
    dominioPropuesto: 'guiagranada.com',
    descripcion: 'Directorio comercial y cultural del municipio de Granada, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'guatape',
    nombre: 'Guatapé',
    subregion: 'Oriente',
    dominioPropuesto: 'guiaguatape.com',
    descripcion: 'Directorio comercial y cultural del municipio de Guatapé, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'launion',
    nombre: 'La Unión',
    subregion: 'Oriente',
    dominioPropuesto: 'guialaunion.com',
    descripcion: 'Directorio comercial y cultural del municipio de La Unión, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'narino',
    nombre: 'Nariño',
    subregion: 'Oriente',
    dominioPropuesto: 'guianarino.com',
    descripcion: 'Directorio comercial y cultural del municipio de Nariño, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sancarlos',
    nombre: 'San Carlos',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasancarlos.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Carlos, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanfrancisco',
    nombre: 'San Francisco',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasanfrancisco.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Francisco, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanluis',
    nombre: 'San Luis',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasanluis.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Luis, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanrafael',
    nombre: 'San Rafael',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasanrafael.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Rafael, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanvicenteferrer',
    nombre: 'San Vicente Ferrer',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasanvicenteferrer.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Vicente Ferrer, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sonson',
    nombre: 'Sonsón',
    subregion: 'Oriente',
    dominioPropuesto: 'guiasonson.com',
    descripcion: 'Directorio comercial y cultural del municipio de Sonsón, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'santafedeantioquia',
    nombre: 'Santa Fe de Antioquia',
    subregion: 'Occidente',
    dominioPropuesto: 'guiasantafedeantioquia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Santa Fe de Antioquia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanjeronimo',
    nombre: 'San Jerónimo',
    subregion: 'Occidente',
    dominioPropuesto: 'guiasanjeronimo.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Jerónimo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sopetran',
    nombre: 'Sopetrán',
    subregion: 'Occidente',
    dominioPropuesto: 'guiasopetran.com',
    descripcion: 'Directorio comercial y cultural del municipio de Sopetrán, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'olaya',
    nombre: 'Olaya',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaolaya.com',
    descripcion: 'Directorio comercial y cultural del municipio de Olaya, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'liborina',
    nombre: 'Liborina',
    subregion: 'Occidente',
    dominioPropuesto: 'guialiborina.com',
    descripcion: 'Directorio comercial y cultural del municipio de Liborina, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sabanalarga',
    nombre: 'Sabanalarga',
    subregion: 'Occidente',
    dominioPropuesto: 'guiasabanalarga.com',
    descripcion: 'Directorio comercial y cultural del municipio de Sabanalarga, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'peque',
    nombre: 'Peque',
    subregion: 'Occidente',
    dominioPropuesto: 'guiapeque.com',
    descripcion: 'Directorio comercial y cultural del municipio de Peque, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'buritica',
    nombre: 'Buriticá',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaburitica.com',
    descripcion: 'Directorio comercial y cultural del municipio de Buriticá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'giraldo',
    nombre: 'Giraldo',
    subregion: 'Occidente',
    dominioPropuesto: 'guiagiraldo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Giraldo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'canasgordas',
    nombre: 'Cañasgordas',
    subregion: 'Occidente',
    dominioPropuesto: 'guiacanasgordas.com',
    descripcion: 'Directorio comercial y cultural del municipio de Cañasgordas, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'uramita',
    nombre: 'Uramita',
    subregion: 'Occidente',
    dominioPropuesto: 'guiauramita.com',
    descripcion: 'Directorio comercial y cultural del municipio de Uramita, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'frontino',
    nombre: 'Frontino',
    subregion: 'Occidente',
    dominioPropuesto: 'guiafrontino.com',
    descripcion: 'Directorio comercial y cultural del municipio de Frontino, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'abriaqui',
    nombre: 'Abriaquí',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaabriaqui.com',
    descripcion: 'Directorio comercial y cultural del municipio de Abriaquí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'anza',
    nombre: 'Anzá',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaanza.com',
    descripcion: 'Directorio comercial y cultural del municipio de Anzá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caicedo',
    nombre: 'Caicedo',
    subregion: 'Occidente',
    dominioPropuesto: 'guiacaicedo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Caicedo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'ebejico',
    nombre: 'Ebéjico',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaebejico.com',
    descripcion: 'Directorio comercial y cultural del municipio de Ebéjico, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'armeniamantequilla',
    nombre: 'Armenia Mantequilla',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaarmeniamantequilla.com',
    descripcion: 'Directorio comercial y cultural del municipio de Armenia Mantequilla, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'heliconia',
    nombre: 'Heliconia',
    subregion: 'Occidente',
    dominioPropuesto: 'guiaheliconia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Heliconia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'dabeiba',
    nombre: 'Dabeiba',
    subregion: 'Occidente',
    dominioPropuesto: 'guiadabeiba.com',
    descripcion: 'Directorio comercial y cultural del municipio de Dabeiba, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'andes',
    nombre: 'Andes',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaandes.com',
    descripcion: 'Directorio comercial y cultural del municipio de Andes, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'jerico',
    nombre: 'Jericó',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiajerico.com',
    descripcion: 'Directorio comercial y cultural del municipio de Jericó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'jardin',
    nombre: 'Jardín',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiajardin.com',
    descripcion: 'Directorio comercial y cultural del municipio de Jardín, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'ciudadbolivar',
    nombre: 'Ciudad Bolívar',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaciudadbolivar.com',
    descripcion: 'Directorio comercial y cultural del municipio de Ciudad Bolívar, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'tamesis',
    nombre: 'Támesis',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiatamesis.com',
    descripcion: 'Directorio comercial y cultural del municipio de Támesis, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'urrao',
    nombre: 'Urrao',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaurrao.com',
    descripcion: 'Directorio comercial y cultural del municipio de Urrao, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'amaga',
    nombre: 'Amagá',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaamaga.com',
    descripcion: 'Directorio comercial y cultural del municipio de Amagá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'fredonia',
    nombre: 'Fredonia',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiafredonia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Fredonia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'titiribi',
    nombre: 'Titiribí',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiatitiribi.com',
    descripcion: 'Directorio comercial y cultural del municipio de Titiribí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'venecia',
    nombre: 'Venecia',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiavenecia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Venecia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'tarso',
    nombre: 'Tarso',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiatarso.com',
    descripcion: 'Directorio comercial y cultural del municipio de Tarso, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'pueblorrico',
    nombre: 'Pueblorrico',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiapueblorrico.com',
    descripcion: 'Directorio comercial y cultural del municipio de Pueblorrico, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'hispania',
    nombre: 'Hispania',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiahispania.com',
    descripcion: 'Directorio comercial y cultural del municipio de Hispania, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'betania',
    nombre: 'Betania',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiabetania.com',
    descripcion: 'Directorio comercial y cultural del municipio de Betania, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'concordia',
    nombre: 'Concordia',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaconcordia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Concordia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'salgar',
    nombre: 'Salgar',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiasalgar.com',
    descripcion: 'Directorio comercial y cultural del municipio de Salgar, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'betulia',
    nombre: 'Betulia',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiabetulia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Betulia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caramanta',
    nombre: 'Caramanta',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiacaramanta.com',
    descripcion: 'Directorio comercial y cultural del municipio de Caramanta, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'valparaiso',
    nombre: 'Valparaíso',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiavalparaiso.com',
    descripcion: 'Directorio comercial y cultural del municipio de Valparaíso, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'lapintada',
    nombre: 'La Pintada',
    subregion: 'Suroeste',
    dominioPropuesto: 'guialapintada.com',
    descripcion: 'Directorio comercial y cultural del municipio de La Pintada, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'santabarbara',
    nombre: 'Santa Bárbara',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiasantabarbara.com',
    descripcion: 'Directorio comercial y cultural del municipio de Santa Bárbara, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'montebello',
    nombre: 'Montebello',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiamontebello.com',
    descripcion: 'Directorio comercial y cultural del municipio de Montebello, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'angelopolis',
    nombre: 'Angelópolis',
    subregion: 'Suroeste',
    dominioPropuesto: 'guiaangelopolis.com',
    descripcion: 'Directorio comercial y cultural del municipio de Angelópolis, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'santarosadeosos',
    nombre: 'Santa Rosa de Osos',
    subregion: 'Norte',
    dominioPropuesto: 'guiasantarosadeosos.com',
    descripcion: 'Directorio comercial y cultural del municipio de Santa Rosa de Osos, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'yarumal',
    nombre: 'Yarumal',
    subregion: 'Norte',
    dominioPropuesto: 'guiayarumal.com',
    descripcion: 'Directorio comercial y cultural del municipio de Yarumal, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'entrerrios',
    nombre: 'Entrerríos',
    subregion: 'Norte',
    dominioPropuesto: 'guiaentrerrios.com',
    descripcion: 'Directorio comercial y cultural del municipio de Entrerríos, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'donmatias',
    nombre: 'Donmatías',
    subregion: 'Norte',
    dominioPropuesto: 'guiadonmatias.com',
    descripcion: 'Directorio comercial y cultural del municipio de Donmatías, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanpedrodelosmilagros',
    nombre: 'San Pedro de los Milagros',
    subregion: 'Norte',
    dominioPropuesto: 'guiasanpedrodelosmilagros.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Pedro de los Milagros, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'belmira',
    nombre: 'Belmira',
    subregion: 'Norte',
    dominioPropuesto: 'guiabelmira.com',
    descripcion: 'Directorio comercial y cultural del municipio de Belmira, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanjosedelamontana',
    nombre: 'San José de la Montaña',
    subregion: 'Norte',
    dominioPropuesto: 'guiasanjosedelamontana.com',
    descripcion: 'Directorio comercial y cultural del municipio de San José de la Montaña, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'toledo',
    nombre: 'Toledo',
    subregion: 'Norte',
    dominioPropuesto: 'guiatoledo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Toledo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanandresdecuerquia',
    nombre: 'San Andrés de Cuerquia',
    subregion: 'Norte',
    dominioPropuesto: 'guiasanandresdecuerquia.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Andrés de Cuerquia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'valdivia',
    nombre: 'Valdivia',
    subregion: 'Norte',
    dominioPropuesto: 'guiavaldivia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Valdivia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'campamento',
    nombre: 'Campamento',
    subregion: 'Norte',
    dominioPropuesto: 'guiacampamento.com',
    descripcion: 'Directorio comercial y cultural del municipio de Campamento, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'angostura',
    nombre: 'Angostura',
    subregion: 'Norte',
    dominioPropuesto: 'guiaangostura.com',
    descripcion: 'Directorio comercial y cultural del municipio de Angostura, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'guadalupe',
    nombre: 'Guadalupe',
    subregion: 'Norte',
    dominioPropuesto: 'guiaguadalupe.com',
    descripcion: 'Directorio comercial y cultural del municipio de Guadalupe, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'carolinadelprincipe',
    nombre: 'Carolina del Príncipe',
    subregion: 'Norte',
    dominioPropuesto: 'guiacarolinadelprincipe.com',
    descripcion: 'Directorio comercial y cultural del municipio de Carolina del Príncipe, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'gomezplata',
    nombre: 'Gómez Plata',
    subregion: 'Norte',
    dominioPropuesto: 'guiagomezplata.com',
    descripcion: 'Directorio comercial y cultural del municipio de Gómez Plata, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'briceno',
    nombre: 'Briceño',
    subregion: 'Norte',
    dominioPropuesto: 'guiabriceno.com',
    descripcion: 'Directorio comercial y cultural del municipio de Briceño, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'ituango',
    nombre: 'Ituango',
    subregion: 'Norte',
    dominioPropuesto: 'guiaituango.com',
    descripcion: 'Directorio comercial y cultural del municipio de Ituango, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'apartado',
    nombre: 'Apartadó',
    subregion: 'Urabá',
    dominioPropuesto: 'guiaapartado.com',
    descripcion: 'Directorio comercial y cultural del municipio de Apartadó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'turbo',
    nombre: 'Turbo',
    subregion: 'Urabá',
    dominioPropuesto: 'guiaturbo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Turbo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'carepa',
    nombre: 'Carepa',
    subregion: 'Urabá',
    dominioPropuesto: 'guiacarepa.com',
    descripcion: 'Directorio comercial y cultural del municipio de Carepa, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'chigorodo',
    nombre: 'Chigorodó',
    subregion: 'Urabá',
    dominioPropuesto: 'guiachigorodo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Chigorodó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'mutata',
    nombre: 'Mutatá',
    subregion: 'Urabá',
    dominioPropuesto: 'guiamutata.com',
    descripcion: 'Directorio comercial y cultural del municipio de Mutatá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'necocli',
    nombre: 'Necoclí',
    subregion: 'Urabá',
    dominioPropuesto: 'guianecocli.com',
    descripcion: 'Directorio comercial y cultural del municipio de Necoclí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanjuandeuraba',
    nombre: 'San Juan de Urabá',
    subregion: 'Urabá',
    dominioPropuesto: 'guiasanjuandeuraba.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Juan de Urabá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'arboletes',
    nombre: 'Arboletes',
    subregion: 'Urabá',
    dominioPropuesto: 'guiaarboletes.com',
    descripcion: 'Directorio comercial y cultural del municipio de Arboletes, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanpedrodeuraba',
    nombre: 'San Pedro de Urabá',
    subregion: 'Urabá',
    dominioPropuesto: 'guiasanpedrodeuraba.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Pedro de Urabá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'murindo',
    nombre: 'Murindó',
    subregion: 'Urabá',
    dominioPropuesto: 'guiamurindo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Murindó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'vigiadelfuerte',
    nombre: 'Vigía del Fuerte',
    subregion: 'Urabá',
    dominioPropuesto: 'guiavigiadelfuerte.com',
    descripcion: 'Directorio comercial y cultural del municipio de Vigía del Fuerte, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caucasia',
    nombre: 'Caucasia',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guiacaucasia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Caucasia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'elbagre',
    nombre: 'El Bagre',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guiaelbagre.com',
    descripcion: 'Directorio comercial y cultural del municipio de El Bagre, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'zaragoza',
    nombre: 'Zaragoza',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guiazaragoza.com',
    descripcion: 'Directorio comercial y cultural del municipio de Zaragoza, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'nechi',
    nombre: 'Nechí',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guianechi.com',
    descripcion: 'Directorio comercial y cultural del municipio de Nechí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'taraza',
    nombre: 'Tarazá',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guiataraza.com',
    descripcion: 'Directorio comercial y cultural del municipio de Tarazá, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caceres',
    nombre: 'Cáceres',
    subregion: 'Bajo Cauca',
    dominioPropuesto: 'guiacaceres.com',
    descripcion: 'Directorio comercial y cultural del municipio de Cáceres, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'segovia',
    nombre: 'Segovia',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiasegovia.com',
    descripcion: 'Directorio comercial y cultural del municipio de Segovia, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'remedios',
    nombre: 'Remedios',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiaremedios.com',
    descripcion: 'Directorio comercial y cultural del municipio de Remedios, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'amalfi',
    nombre: 'Amalfi',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiaamalfi.com',
    descripcion: 'Directorio comercial y cultural del municipio de Amalfi, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'vegachi',
    nombre: 'Vegachí',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiavegachi.com',
    descripcion: 'Directorio comercial y cultural del municipio de Vegachí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'yali',
    nombre: 'Yalí',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiayali.com',
    descripcion: 'Directorio comercial y cultural del municipio de Yalí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'yolombo',
    nombre: 'Yolombó',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiayolombo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Yolombó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'cisneros',
    nombre: 'Cisneros',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiacisneros.com',
    descripcion: 'Directorio comercial y cultural del municipio de Cisneros, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'sanroque',
    nombre: 'San Roque',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiasanroque.com',
    descripcion: 'Directorio comercial y cultural del municipio de San Roque, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'maceo',
    nombre: 'Maceo',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiamaceo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Maceo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'anori',
    nombre: 'Anorí',
    subregion: 'Nordeste',
    dominioPropuesto: 'guiaanori.com',
    descripcion: 'Directorio comercial y cultural del municipio de Anorí, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'puertoberrio',
    nombre: 'Puerto Berrío',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiapuertoberrio.com',
    descripcion: 'Directorio comercial y cultural del municipio de Puerto Berrío, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'puertonare',
    nombre: 'Puerto Nare',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiapuertonare.com',
    descripcion: 'Directorio comercial y cultural del municipio de Puerto Nare, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'puertotriunfo',
    nombre: 'Puerto Triunfo',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiapuertotriunfo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Puerto Triunfo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'yondo',
    nombre: 'Yondó',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiayondo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Yondó, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'maceo',
    nombre: 'Maceo',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiamaceo.com',
    descripcion: 'Directorio comercial y cultural del municipio de Maceo, Antioquia',
    estado: "PENDIENTE"
  },
  {
    id: 'caracoli',
    nombre: 'Caracolí',
    subregion: 'Magdalena Medio',
    dominioPropuesto: 'guiacaracoli.com',
    descripcion: 'Directorio comercial y cultural del municipio de Caracolí, Antioquia',
    estado: "PENDIENTE"
  },
];
