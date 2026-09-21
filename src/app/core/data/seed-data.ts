import { Category, City, Coupon, Product } from '../models/product.model';

export const CATEGORIAS: Category[] = [
  { id: 'running', nombre: 'Running' },
  { id: 'futbol', nombre: 'Futbol' },
  { id: 'ciclismo', nombre: 'Ciclismo' },
  { id: 'gimnasio', nombre: 'Gimnasio' },
  { id: 'montana', nombre: 'Montana' },
  { id: 'natacion', nombre: 'Natacion' },
];

export const PRODUCTOS: Product[] = [
  {
    id: 'p01',
    nombre: 'Camiseta Trail E-commerce Volt',
    categoria: 'running',
    tipo: 'prenda',
    tallas: { S: 4, M: 9, L: 6, XL: 0 },
    precio: 89900,
    precioOriginal: 119900,
    imagenes: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ46viZnmDFPmxD2uckbeRArafp04YqvsU_3Ibug3qHfDF4rYTHpBTNJOA&s=10',
    ],
    descripcion:
      'Camiseta tecnica de secado rapido para trote en montana, con costuras planas y tela transpirable de 4 vias. Ideal para clima cambiante del eje cafetero.',
    rating: 4.6,
    resenas: [
      {
        usuario: 'Camila R.',
        estrellas: 5,
        texto:
          'Muy fresca, la use en un ascenso de 12 km y no se sintio pesada.',
        fecha: '2026-07-02',
      },
      {
        usuario: 'Julian M.',
        estrellas: 4,
        texto: 'Buena calidad, la talla M me quedo algo ajustada.',
        fecha: '2026-06-18',
      },
    ],
    destacado: true,
  },

  {
    id: 'p02',
    nombre: 'Tenis Running ImpulsoX',
    categoria: 'running',
    tipo: 'prenda',
    tallas: { '38': 3, '39': 5, '40': 7, '41': 6, '42': 2, '43': 0 },
    precio: 289900,
    precioOriginal: null,
    imagenes: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8pTEPXfslAfXuLzng9cMFRXJdaQ8abqehincBRM7qg&s=10',
    ],
    descripcion:
      'Zapatilla de running con espuma de reaccion rapida y suela de agarre multi-terreno, pensada para asfalto y senderos destapados.',
    rating: 4.8,
    resenas: [
      {
        usuario: 'Andrea R.',
        estrellas: 5,
        texto:
          'El mejor amortiguamiento que he probado en esta gama de precio.',
        fecha: '2026-08-10',
      },
    ],
    destacado: true,
  },

  {
    id: 'p03',
    nombre: 'Balon de Futbol Cordillera Pro',
    categoria: 'futbol',
    tipo: 'objeto',
    stock: 14,
    precio: 129900,
    precioOriginal: 149900,
    imagenes: [
      'https://http2.mlstatic.com/D_NQ_NP_983962-MLA100052372335_122025-O.webp',
    ],
    descripcion:
      'Balon oficial No. 5, camara de butilo para mejor retencion de aire y cubierta termosellada resistente a cancha sintetica y grama.',
    rating: 4.5,
    resenas: [
      {
        usuario: 'Diego T.',
        estrellas: 4,
        texto: 'Buen bote, despues de tres meses de uso semanal sigue firme.',
        fecha: '2026-05-22',
      },
    ],
    destacado: false,
  },

  {
    id: 'p04',
    nombre: 'Camiseta Local Quindio FC',
    categoria: 'futbol',
    tipo: 'prenda',
    tallas: { S: 5, M: 2, L: 8, XL: 5 },
    precio: 149900,
    precioOriginal: null,
    imagenes: [
      'https://www.sportline.com.co/media/catalog/product/f/n/fn8797-456_phsfh001-1000.jpeg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:',
    ],
    descripcion:
      'Jersey de juego con tejido tipo malla en zonas de alta transpiracion y escudo bordado. Corte atletico.',
    rating: 4.3,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p05',
    nombre: 'Bicicleta MTB Rocamadre 27.5',
    categoria: 'ciclismo',
    tipo: 'objeto',
    stock: 3,
    precio: 2890000,
    precioOriginal: 3290000,
    imagenes: [
      'https://wuilpy.com/wp-content/uploads/2022/03/Bicicleta-Profit-Montana-27.5-Wuilpy-Bike-Fucsia.jpg',
    ],
    descripcion:
      'Bicicleta de montana rigida, cuadro de aluminio 6061, 21 velocidades y frenos de disco mecanicos. Lista para rodar en trochas del Quindio.',
    rating: 4.7,
    resenas: [
      {
        usuario: 'Laura P.',
        estrellas: 5,
        texto: 'Excelente relacion precio-calidad para empezar en MTB.',
        fecha: '2026-04-30',
      },
    ],
    destacado: true,
  },

  {
    id: 'p06',
    nombre: 'Casco Ciclismo AeroPeak',
    categoria: 'ciclismo',
    tipo: 'objeto',
    stock: 9,
    precio: 179900,
    precioOriginal: null,
    imagenes: [
      'https://i5.walmartimages.com/asr/8c887bc2-80bd-4a1f-b030-76f996e3c7eb.ab0364f31f12777f90ceba46df59a9a3.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
    ],
    descripcion:
      'Casco ventilado de 18 entradas de aire con sistema de ajuste giratorio y certificacion de seguridad vial.',
    rating: 4.4,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p07',
    nombre: 'Mancuernas Ajustables 20kg (par)',
    categoria: 'gimnasio',
    tipo: 'objeto',
    stock: 6,
    precio: 349900,
    precioOriginal: 399900,
    imagenes: [
      'https://media.falabella.com/sodimacCO/3006080_02/w=1500,h=1500',
    ],
    descripcion:
      'Set de mancuernas ajustables por disco, de 2 a 20 kg cada una. Ideal para entrenamiento en casa con espacio reducido.',
    rating: 4.6,
    resenas: [
      {
        usuario: 'Mateo G.',
        estrellas: 5,
        texto: 'El sistema de ajuste es rapido y no hace ruido.',
        fecha: '2026-07-28',
      },
    ],
    destacado: true,
  },

  {
    id: 'p08',
    nombre: 'Licra Deportiva Compresion',
    categoria: 'gimnasio',
    tipo: 'prenda',
    tallas: { XS: 2, S: 6, M: 7, L: 4 },
    precio: 79900,
    precioOriginal: null,
    imagenes: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQ8m9Ba8GQOfDGsjPsBpqO7_NbvTJzP9_iMfslfIYG3j06M10vwOgOEQ&s=10',
    ],
    descripcion:
      'Legging de compresion media, cintura alta y bolsillo lateral para celular. Tela opaca incluso en sentadilla profunda.',
    rating: 4.5,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p09',
    nombre: 'Chaqueta Impermeable Paramo',
    categoria: 'montana',
    tipo: 'prenda',
    tallas: { S: 3, M: 5, L: 5, XL: 2 },
    precio: 259900,
    precioOriginal: 299900,
    imagenes: [
      'https://http2.mlstatic.com/D_NQ_NP_945934-CBT92518795698_092025-O.webp',
    ],
    descripcion:
      'Chaqueta cortavientos con membrana impermeable, costuras selladas y capucha ajustable. Pensada para caminatas de alta montana.',
    rating: 4.9,
    resenas: [
      {
        usuario: 'Sofia A.',
        estrellas: 5,
        texto: 'La use subiendo al nevado y no entro ni una gota de agua.',
        fecha: '2026-06-05',
      },
    ],
    destacado: true,
  },

  {
    id: 'p10',
    nombre: 'Carpa de Camping 2 Personas',
    categoria: 'montana',
    tipo: 'objeto',
    stock: 5,
    precio: 319900,
    precioOriginal: null,
    imagenes: [
      'https://http2.mlstatic.com/D_NQ_NP_646729-MCO113678028203_062026-O.webp',
    ],
    descripcion:
      'Carpa doble techo, armado en menos de 5 minutos, resistente a viento moderado y lluvia. Incluye piso de suelo reforzado.',
    rating: 4.2,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p11',
    nombre: 'Gafas de Natacion ClearView',
    categoria: 'natacion',
    tipo: 'objeto',
    stock: 20,
    precio: 59900,
    precioOriginal: null,
    imagenes: [
      'https://contents.mediadecathlon.com/p3066098/k$2819f58cc6ea64def5fc201a7ff43d55/gafas-natacion-spirit-pola-gris-negro-lentes-polarizados.jpg',
    ],
    descripcion:
      'Gafas antiempanantes con proteccion UV y sello de silicona hipoalergenico, ajuste de correa dividida.',
    rating: 4.3,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p12',
    nombre: 'Vestido de Bano Competicion',
    categoria: 'natacion',
    tipo: 'prenda',
    tallas: { S: 4, M: 4, L: 3, XL: 0 },
    precio: 139900,
    precioOriginal: 159900,
    imagenes: [
      'https://image.made-in-china.com/318f0j00dQgUNHtFnVby/WM-Athlete-Swimsuit-mp4.webp',
    ],
    descripcion:
      'Vestido de bano de tela clorada resistente al desgaste, corte competitivo de baja resistencia al agua.',
    rating: 4.1,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p13',
    nombre: 'Cronometro Deportivo Digital',
    categoria: 'running',
    tipo: 'objeto',
    stock: 11,
    precio: 49900,
    precioOriginal: null,
    imagenes: [
      'https://http2.mlstatic.com/D_NQ_NP_935452-MLA107257248339_022026-O.webp',
    ],
    descripcion:
      'Cronometro de mano con memoria de 100 vueltas, resistente a salpicaduras y clip para cinturon.',
    rating: 4.0,
    resenas: [],
    destacado: false,
  },

  {
    id: 'p14',
    nombre: 'Colchoneta de Yoga Grip Pro',
    categoria: 'gimnasio',
    tipo: 'objeto',
    stock: 16,
    precio: 69900,
    precioOriginal: 84900,
    imagenes: [
      'https://media.falabella.com/falabellaCO/129305673_03/w=1500,h=1500,fit=cover',
    ],
    descripcion:
      'Colchoneta antideslizante de 6 mm de grosor, material TPE libre de PVC, incluye correa de transporte.',
    rating: 4.7,
    resenas: [
      {
        usuario: 'Valentina C.',
        estrellas: 5,
        texto: 'No resbala nada incluso sudando mucho.',
        fecha: '2026-08-01',
      },
    ],
    destacado: false,
  },
];
export const CIUDADES_ENVIO: City[] = [
  { ciudad: 'Armenia', distanciaKm: 0, costo: 0, dias: 'Mismo día' },
  { ciudad: 'Pereira', distanciaKm: 45, costo: 9900, dias: '1 día hábil' },
  {
    ciudad: 'Manizales',
    distanciaKm: 95,
    costo: 14900,
    dias: '1-2 días hábiles',
  },
  { ciudad: 'Cali', distanciaKm: 210, costo: 19900, dias: '2 días hábiles' },
  {
    ciudad: 'Medellín',
    distanciaKm: 260,
    costo: 22900,
    dias: '2-3 días hábiles',
  },
  { ciudad: 'Bogotá', distanciaKm: 285, costo: 24900, dias: '3 días hábiles' },
  {
    ciudad: 'Ibagué',
    distanciaKm: 250,
    costo: 22900,
    dias: '2-3 días hábiles',
  },
  { ciudad: 'Neiva', distanciaKm: 370, costo: 29900, dias: '3-4 días hábiles' },
  {
    ciudad: 'Popayán',
    distanciaKm: 320,
    costo: 27900,
    dias: '3-4 días hábiles',
  },
  { ciudad: 'Pasto', distanciaKm: 530, costo: 34900, dias: '4-5 días hábiles' },
  {
    ciudad: 'Bucaramanga',
    distanciaKm: 430,
    costo: 32900,
    dias: '3-4 días hábiles',
  },
  { ciudad: 'Tunja', distanciaKm: 390, costo: 31900, dias: '3-4 días hábiles' },
  { ciudad: 'Soacha', distanciaKm: 300, costo: 25900, dias: '3 días hábiles' },
  {
    ciudad: 'Villavicencio',
    distanciaKm: 410,
    costo: 32900,
    dias: '3-4 días hábiles',
  },
  {
    ciudad: 'Montería',
    distanciaKm: 570,
    costo: 35900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Valledupar',
    distanciaKm: 800,
    costo: 39900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Barranquilla',
    distanciaKm: 780,
    costo: 39900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Cartagena de Indias',
    distanciaKm: 750,
    costo: 38900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Santa Marta',
    distanciaKm: 820,
    costo: 40900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Sincelejo',
    distanciaKm: 650,
    costo: 37900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Riohacha',
    distanciaKm: 900,
    costo: 42900,
    dias: '5-6 días hábiles',
  },
  {
    ciudad: 'Cúcuta',
    distanciaKm: 600,
    costo: 36900,
    dias: '4-5 días hábiles',
  },
  { ciudad: 'Yopal', distanciaKm: 500, costo: 34900, dias: '4-5 días hábiles' },
  {
    ciudad: 'Florencia',
    distanciaKm: 500,
    costo: 34900,
    dias: '4-5 días hábiles',
  },
  {
    ciudad: 'Quibdó',
    distanciaKm: 350,
    costo: 31900,
    dias: '4-5 días hábiles',
  },
  { ciudad: 'Mocoa', distanciaKm: 520, costo: 35900, dias: '5-6 días hábiles' },
  {
    ciudad: 'San Andrés',
    distanciaKm: 950,
    costo: 59900,
    dias: '5-7 días hábiles',
  },
  {
    ciudad: 'San José del Guaviare',
    distanciaKm: 700,
    costo: 42900,
    dias: '5-6 días hábiles',
  },
  {
    ciudad: 'Arauca',
    distanciaKm: 700,
    costo: 42900,
    dias: '5-6 días hábiles',
  },
  {
    ciudad: 'Leticia',
    distanciaKm: 1100,
    costo: 69900,
    dias: '7-10 días hábiles',
  },
  {
    ciudad: 'Inírida',
    distanciaKm: 1000,
    costo: 64900,
    dias: '7-10 días hábiles',
  },
  { ciudad: 'Mitú', distanciaKm: 900, costo: 64900, dias: '7-10 días hábiles' },
  {
    ciudad: 'Puerto Carreño',
    distanciaKm: 850,
    costo: 54900,
    dias: '6-8 días hábiles',
  },
];

export const CUPONES: Record<string, Coupon> = {
  ECOMMERCE10: {
    tipo: 'porcentaje',
    valor: 10,
    descripcion: '10% de descuento en todo el pedido',
  },
  BIENVENIDA: {
    tipo: 'porcentaje',
    valor: 15,
    descripcion: '15% de descuento primera compra',
  },
  ENVIOGRATIS: {
    tipo: 'envio',
    valor: 100,
    descripcion: 'Envío gratis sin importar la ciudad',
  },
};

export const NUMERO_WHATSAPP_TIENDA = '573233426228';
