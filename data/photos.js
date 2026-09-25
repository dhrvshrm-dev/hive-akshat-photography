// Every photograph on the site, in one place.
//
// PLACEHOLDERS: these are Creative Commons photographs from Wikimedia Commons,
// used so the design can be judged with real travel imagery. Swap each `src`
// for Akshat's own frame (drop the file in /public/images) and update the
// fields below. The camera data is the real EXIF read from each file, so the
// viewfinder readouts are telling the truth about the picture on screen.
//
// Fields
//   discipline  one of: Sacred, People, Architecture, Landscape, Wild
//   lat / lon   decimal degrees; drives the map and the GPS readouts
//   alt         metres above sea level (null if unknown)
//   focus       where the autofocus box locks, as [x, y] fractions of the frame
//   credit      photographer + licence — keep until the photo is replaced
//   archive     false keeps a frame out of the gallery (used as a backdrop only)
//
// Generated once from the Commons metadata; edit by hand from here on.

export const disciplines = ["All", "Sacred", "Landscape", "Architecture", "People", "Wild"];

export const photos = [
  {
    id: "golden-temple",
    src: "/images/photos/golden-temple.jpg",
    w: 2200,
    h: 1467,
    title: "Harmandir Sahib, before the crowds",
    place: "Amritsar",
    region: "Punjab",
    discipline: "Sacred",
    lat: 31.62,
    lon: 74.8765,
    alt: 234,
    focus: [0.5, 0.42],
    exif: {
      camera: "Canon EOS 7D",
      lens: null,
      focal: "69mm",
      aperture: "f/8",
      shutter: "1/250",
      iso: 100,
      taken: "2010-06-28T05:28:15"
    },
    credit: {
      author: "Oleg Yunakov",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Hamandir_Sahib_(Golden_Temple).jpg"
    }
  },
  {
    id: "harmandir-sahib",
    src: "/images/photos/harmandir-sahib.jpg",
    w: 2200,
    h: 1445,
    title: "Winter fog on the sarovar",
    place: "Amritsar",
    region: "Punjab",
    discipline: "Sacred",
    lat: 31.6199,
    lon: 74.8764,
    alt: 234,
    focus: [0.5, 0.6],
    exif: {
      camera: "NIKON D90",
      lens: null,
      focal: "24mm",
      aperture: "f/8",
      shutter: "1/100",
      iso: 400,
      taken: "2018-12-27T10:32:11"
    },
    credit: {
      author: "Dey.sandip",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Harmandir_Sahib,_Amritsar,_India.jpg"
    }
  },
  {
    id: "varanasi-puja",
    src: "/images/photos/varanasi-puja.jpg",
    w: 2200,
    h: 1467,
    title: "Ganga aarti",
    place: "Varanasi",
    region: "Uttar Pradesh",
    discipline: "Sacred",
    lat: 25.3068,
    lon: 83.0104,
    alt: 80,
    focus: [0.72, 0.4],
    exif: {
      camera: "Canon EOS-1D Mark II",
      lens: "16.0-35.0 mm",
      focal: "20mm",
      aperture: "f/3.2",
      shutter: "1/13",
      iso: 400,
      taken: "2000-04-30T22:23:43"
    },
    credit: {
      author: "Jorge Royan",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:India_-_Varanasi_puja_ceremony_-_1772.jpg"
    }
  },
  {
    id: "varanasi-sadhu",
    src: "/images/photos/varanasi-sadhu.jpg",
    w: 2200,
    h: 1467,
    title: "Sadhu at Dashashwamedh",
    place: "Varanasi",
    region: "Uttar Pradesh",
    discipline: "People",
    lat: 25.3068,
    lon: 83.0104,
    alt: 80,
    focus: [0.55, 0.32],
    exif: {
      camera: "Canon EOS 5D Mark II",
      lens: null,
      focal: "85mm",
      aperture: "f/1.8",
      shutter: "1/1250",
      iso: 200,
      taken: "2009-09-27T10:16:46"
    },
    credit: {
      author: "Pierre-Emmanuel BOITON",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Sadhu_V%C3%A2r%C3%A2nas%C3%AE.jpg"
    }
  },
  {
    id: "varanasi-boatman",
    src: "/images/photos/varanasi-boatman.jpg",
    w: 1500,
    h: 2000,
    title: "The boatman",
    place: "Varanasi",
    region: "Uttar Pradesh",
    discipline: "People",
    lat: 25.3109,
    lon: 83.0107,
    alt: 80,
    focus: [0.5, 0.3],
    exif: {
      camera: "NIKON D3200",
      lens: "18.0-55.0 mm f/3.5-5.6",
      focal: "42mm",
      aperture: "f/10",
      shutter: "1/400",
      iso: 200,
      taken: "2014-03-08T07:23:52"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Boatman_Ganga_Varanasi_UP_India_Mar14_DSC_4635.jpg"
    }
  },
  {
    id: "varanasi-ghats",
    src: "/images/photos/varanasi-ghats.jpg",
    w: 2200,
    h: 1427,
    title: "The ghats at first light",
    place: "Varanasi",
    region: "Uttar Pradesh",
    discipline: "Sacred",
    lat: 25.305,
    lon: 83.01,
    alt: 80,
    focus: [0.4, 0.45],
    exif: {
      camera: null,
      lens: null,
      focal: null,
      aperture: null,
      shutter: null,
      iso: null,
      taken: null
    },
    credit: {
      author: "Marcin Białek",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Varanasi_2010_ghats3.jpg"
    }
  },
  {
    id: "pushkar-ghats",
    src: "/images/photos/pushkar-ghats.jpg",
    w: 2200,
    h: 1581,
    title: "Evening on the ghats",
    place: "Pushkar",
    region: "Rajasthan",
    discipline: "Sacred",
    lat: 26.487,
    lon: 74.554,
    alt: 510,
    focus: [0.5, 0.5],
    exif: {
      camera: "PENTAX KP",
      lens: null,
      focal: "17mm",
      aperture: "f/4.5",
      shutter: "1/100",
      iso: 100,
      taken: "2019-12-14T17:13:23"
    },
    credit: {
      author: "Jakub Hałun",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:20191214_Ghats_in_Pushkar_1713_8593.jpg"
    }
  },
  {
    id: "pushkar-camels",
    src: "/images/photos/pushkar-camels.jpg",
    w: 2200,
    h: 1463,
    title: "Camel carts, fair week",
    place: "Pushkar",
    region: "Rajasthan",
    discipline: "People",
    lat: 26.4897,
    lon: 74.5511,
    alt: 510,
    focus: [0.38, 0.45],
    exif: {
      camera: "PENTAX KP",
      lens: null,
      focal: "135mm",
      aperture: "f/8",
      shutter: "1/500",
      iso: 200,
      taken: "2019-12-15T12:06:59"
    },
    credit: {
      author: "Jakub Hałun",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:20191215_Camel-drawn_carts,_Pushkar_1207_8771.jpg"
    }
  },
  {
    id: "ajmer-jhonpra-arch",
    src: "/images/photos/ajmer-jhonpra-arch.jpg",
    w: 1647,
    h: 2000,
    title: "Adhai Din Ka Jhonpra",
    place: "Ajmer",
    region: "Rajasthan",
    discipline: "Architecture",
    lat: 26.4552,
    lon: 74.6253,
    alt: 486,
    focus: [0.5, 0.45],
    exif: {
      camera: "PENTAX KP",
      lens: null,
      focal: "30mm",
      aperture: "f/7.1",
      shutter: "1/200",
      iso: 100,
      taken: "2019-12-16T12:08:14"
    },
    credit: {
      author: "Jakub Hałun",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:20191216_Adhai_Din_Ka_Jhonpra,_Ajmer_1208_8881.jpg"
    }
  },
  {
    id: "thar-dunes",
    src: "/images/photos/thar-dunes.jpg",
    w: 2200,
    h: 1419,
    title: "Wind lines, Sam dunes",
    place: "Jaisalmer",
    region: "Rajasthan",
    discipline: "Landscape",
    lat: 26.8318,
    lon: 70.5064,
    alt: 230,
    focus: [0.55, 0.5],
    exif: {
      camera: "NIKON D610",
      lens: "28.0-300.0 mm f/3.5-5.6",
      focal: "28mm",
      aperture: "f/10",
      shutter: "1/250",
      iso: 200,
      taken: "2016-02-15T14:07:42"
    },
    credit: {
      author: "Clément Bardot",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Dunes,_D%C3%A9sert_du_Thar.jpg"
    }
  },
  {
    id: "thar-dromedary",
    src: "/images/photos/thar-dromedary.jpg",
    w: 2200,
    h: 1356,
    title: "Resting in the Thar",
    place: "Jaisalmer",
    region: "Rajasthan",
    discipline: "Wild",
    lat: 26.84,
    lon: 70.53,
    alt: 230,
    focus: [0.6, 0.3],
    exif: {
      camera: "NIKON D610",
      lens: "28.0-300.0 mm f/3.5-5.6",
      focal: "50mm",
      aperture: "f/10",
      shutter: "1/320",
      iso: 200,
      taken: "2016-02-15T14:16:38"
    },
    credit: {
      author: "Clément Bardot",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Dromedary_in_Thar_desert.jpg"
    }
  },
  {
    id: "jaisalmer-fort",
    src: "/images/photos/jaisalmer-fort.jpg",
    w: 2200,
    h: 1286,
    title: "Sonar Qila at 5:45 am",
    place: "Jaisalmer",
    region: "Rajasthan",
    discipline: "Architecture",
    lat: 26.9124,
    lon: 70.9129,
    alt: 225,
    focus: [0.5, 0.5],
    exif: {
      camera: "NIKON D610",
      lens: "28.0-300.0 mm f/3.5-5.6",
      focal: "28mm",
      aperture: "f/11",
      shutter: "1/400",
      iso: 200,
      taken: "2016-02-15T05:45:52"
    },
    credit: {
      author: "Clément Bardot",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Jaisalmer_Fort,_India.jpg"
    }
  },
  {
    id: "jaisalmer-window",
    src: "/images/photos/jaisalmer-window.jpg",
    w: 1330,
    h: 2000,
    title: "Rani Mahal jharokha",
    place: "Jaisalmer",
    region: "Rajasthan",
    discipline: "Architecture",
    lat: 26.9124,
    lon: 70.9129,
    alt: 225,
    focus: [0.5, 0.55],
    exif: {
      camera: "NIKON D3200",
      lens: "10.0-24.0 mm f/3.5-4.5",
      focal: "24mm",
      aperture: "f/10",
      shutter: "1/400",
      iso: 200,
      taken: "2014-12-14T10:39:57"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Stone_Window_Rani_Mahal_Jaisalmer_Fort_Dec14_DSC_6256.jpg"
    }
  },
  {
    id: "amber-fort",
    src: "/images/photos/amber-fort.jpg",
    w: 2200,
    h: 1375,
    title: "Amber over Maota lake",
    place: "Jaipur",
    region: "Rajasthan",
    discipline: "Architecture",
    lat: 26.9855,
    lon: 75.8513,
    alt: 431,
    focus: [0.6, 0.3],
    exif: {
      camera: "Canon EOS 7D Mark II",
      lens: "8-16mm",
      focal: "16mm",
      aperture: "f/8",
      shutter: "1/400",
      iso: 100,
      taken: "2016-03-18T11:58:50"
    },
    credit: {
      author: "A.Savin",
      license: "FAL",
      source: "https://commons.wikimedia.org/wiki/File:Jaipur_03-2016_02_Amber_Fort.jpg"
    }
  },
  {
    id: "jantar-mantar",
    src: "/images/photos/jantar-mantar.jpg",
    w: 2200,
    h: 1467,
    title: "Samrat Yantra",
    place: "Jaipur",
    region: "Rajasthan",
    discipline: "Architecture",
    lat: 26.9248,
    lon: 75.8246,
    alt: 431,
    focus: [0.52, 0.5],
    exif: {
      camera: "NIKON D810",
      lens: "14.0-24.0 mm f/2.8",
      focal: "14mm",
      aperture: "f/11",
      shutter: "1/400",
      iso: 160,
      taken: "2018-11-12T11:23:34"
    },
    credit: {
      author: "Sudipta Maulik",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Doors_of_Jantar_Mantar.jpg"
    }
  },
  {
    id: "galta-ji",
    src: "/images/photos/galta-ji.jpg",
    w: 2200,
    h: 1467,
    title: "Galta Ji, the monkey temple",
    place: "Jaipur",
    region: "Rajasthan",
    discipline: "Sacred",
    lat: 26.918,
    lon: 75.858,
    alt: 431,
    focus: [0.35, 0.4],
    exif: {
      camera: "NIKON Z 6_2",
      lens: "NIKKOR Z 24-120mm f/4 S",
      focal: "24mm",
      aperture: "f/13",
      shutter: "1/200",
      iso: 200,
      taken: "2023-02-12T09:31:59"
    },
    credit: {
      author: "Sharvarism",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Zanana_Kund_Aur_Galta_Ji_Ka_Mandir_-_edited.jpg"
    }
  },
  {
    id: "bundi-lady",
    src: "/images/photos/bundi-lady.jpg",
    w: 1285,
    h: 2000,
    title: "Bandhani",
    place: "Bundi",
    region: "Rajasthan",
    discipline: "People",
    lat: 25.4305,
    lon: 75.6499,
    alt: 268,
    focus: [0.5, 0.4],
    exif: {
      camera: "Nikon COOLSCAN V ED",
      lens: null,
      focal: null,
      aperture: null,
      shutter: null,
      iso: null,
      taken: null
    },
    credit: {
      author: "Michael Gäbler",
      license: "CC BY 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Lady_in_Bundi,_Rajasthan.JPG"
    }
  },
  {
    id: "rajasthan-shepherd",
    src: "/images/photos/rajasthan-shepherd.jpg",
    w: 2200,
    h: 1467,
    title: "The shepherd",
    place: "Marwar",
    region: "Rajasthan",
    discipline: "People",
    lat: 26.2389,
    lon: 73.0243,
    alt: 231,
    focus: [0.52, 0.3],
    exif: {
      camera: "Canon EOS R8",
      lens: "RF100-400mm F5.6-8 IS USM",
      focal: "400mm",
      aperture: "f/8",
      shutter: "1/500",
      iso: 100,
      taken: "2025-04-13T17:01:48"
    },
    credit: {
      author: "Paramanu Sarkar",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Shepherd_from_Rajasthan_03.jpg"
    }
  },
  {
    id: "bengal-tiger",
    src: "/images/photos/bengal-tiger.jpg",
    w: 2200,
    h: 1467,
    title: "She stopped, once",
    place: "Central Indian forest",
    region: "Madhya Pradesh",
    discipline: "Wild",
    lat: 23.7,
    lon: 81,
    alt: 450,
    focus: [0.45, 0.38],
    exif: {
      camera: "Canon EOS 80D",
      lens: "EF24-70mm f/4L IS USM",
      focal: "62mm",
      aperture: "f/4",
      shutter: "1/500",
      iso: 1600,
      taken: "2017-11-16T16:24:49"
    },
    credit: {
      author: "Charles J. Sharp",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Bengal_tiger_(Panthera_tigris_tigris)_female_3.jpg"
    }
  },
  {
    id: "macaque",
    src: "/images/photos/macaque.jpg",
    w: 1619,
    h: 2000,
    title: "The gatekeeper",
    place: "Old fort walls",
    region: "Rajasthan",
    discipline: "Wild",
    lat: 26.2968,
    lon: 73.0186,
    alt: 231,
    focus: [0.45, 0.3],
    exif: {
      camera: null,
      lens: null,
      focal: null,
      aperture: null,
      shutter: null,
      iso: null,
      taken: null
    },
    credit: {
      author: "Thomas Schoch",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Macaque_India_3.jpg"
    }
  },
  {
    id: "gurudongmar",
    src: "/images/photos/gurudongmar.jpg",
    w: 2200,
    h: 1467,
    title: "Gurudongmar, 5,430 m",
    place: "North Sikkim",
    region: "Sikkim",
    discipline: "Landscape",
    lat: 28.0246,
    lon: 88.709,
    alt: 5430,
    focus: [0.55, 0.3],
    exif: {
      camera: "NIKON D7100",
      lens: "18.0-105.0 mm f/3.5-5.6",
      focal: "18mm",
      aperture: "f/11",
      shutter: "1/640",
      iso: 200,
      taken: "2015-03-28T20:44:37"
    },
    credit: {
      author: "Yoghya / UnpetitproleX",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Gurudongmar_Lake_Sikkim,_India_(edit).jpg"
    }
  },
  {
    id: "sangla-snow",
    src: "/images/photos/sangla-snow.jpg",
    w: 2200,
    h: 1467,
    title: "Orchards under snow",
    place: "Sangla",
    region: "Himachal Pradesh",
    discipline: "Landscape",
    lat: 31.425,
    lon: 78.264,
    alt: 2680,
    focus: [0.5, 0.5],
    exif: {
      camera: null,
      lens: null,
      focal: null,
      aperture: null,
      shutter: null,
      iso: null,
      taken: null
    },
    credit: {
      author: "UnpetitproleX",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Orchards_in_snow,_Sangla,_Himachal_Pradesh,_India.jpg"
    }
  },
  {
    id: "ranikhet-himalaya",
    src: "/images/photos/ranikhet-himalaya.jpg",
    w: 2800,
    h: 814,
    title: "The Himalaya from Ranikhet",
    place: "Ranikhet",
    region: "Uttarakhand",
    discipline: "Landscape",
    lat: 29.6434,
    lon: 79.4322,
    alt: 1869,
    focus: [0.5, 0.25],
    exif: {
      camera: null,
      lens: null,
      focal: null,
      aperture: null,
      shutter: null,
      iso: null,
      taken: "2020-12-14T11:01:17"
    },
    credit: {
      author: "Harshit SR / UnpetitproleX",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Panorama_of_Himalayas_from_Ranikhet,_Uttarakhand,_India.jpg"
    }
  },
  {
    id: "ladakh-mustard",
    src: "/images/photos/ladakh-mustard.jpg",
    w: 2200,
    h: 1468,
    title: "Mustard season",
    place: "Leh district",
    region: "Ladakh",
    discipline: "Landscape",
    lat: 34.1526,
    lon: 77.5771,
    alt: 3500,
    focus: [0.5, 0.62],
    exif: {
      camera: "NIKON D810",
      lens: "20.0 mm f/2.8",
      focal: "20mm",
      aperture: "f/11",
      shutter: "1/125",
      iso: 64,
      taken: "2018-07-12T09:02:54"
    },
    credit: {
      author: "Chris Hunkeler / UnpetitproleX",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Mustard_Growing_in_a_Terraced_Field_in_Ladakh,_India_(edit).jpg"
    }
  },
  {
    id: "zanskar-road",
    src: "/images/photos/zanskar-road.jpg",
    w: 2200,
    h: 1467,
    title: "The road to Padum",
    place: "Zanskar",
    region: "Ladakh",
    discipline: "Landscape",
    lat: 33.466,
    lon: 76.88,
    alt: 3650,
    focus: [0.5, 0.42],
    exif: {
      camera: "ILCE-7CR",
      lens: "FE 20-70mm F4 G",
      focal: "70mm",
      aperture: "f/16",
      shutter: "1/250",
      iso: 100,
      taken: "2024-06-06T09:45:49"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Road_Padum_Zanskar_Range_Jun24_A7CR_00818.jpg"
    }
  },
  {
    id: "phuktal",
    src: "/images/photos/phuktal.jpg",
    w: 2200,
    h: 1467,
    title: "Phuktal gompa",
    place: "Zanskar",
    region: "Ladakh",
    discipline: "Sacred",
    lat: 33.248,
    lon: 77.178,
    alt: 3850,
    focus: [0.45, 0.35],
    exif: {
      camera: "ILCE-7CR",
      lens: "FE 20-70mm F4 G",
      focal: "63mm",
      aperture: "f/16",
      shutter: "1/80",
      iso: 200,
      taken: "2024-06-04T15:49:28"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:SE_Facade_Phuktal_Zanskar_Ladakh_Jun24_A7CR_00617.jpg"
    }
  },
  {
    id: "thiksey",
    src: "/images/photos/thiksey.jpg",
    w: 2200,
    h: 1639,
    title: "Thiksey prayer hall",
    place: "Leh",
    region: "Ladakh",
    discipline: "Sacred",
    lat: 34.0556,
    lon: 77.6671,
    alt: 3600,
    focus: [0.4, 0.4],
    exif: {
      camera: "Canon EOS REBEL T4i",
      lens: "EF-S18-135mm f/3.5-5.6 IS STM",
      focal: "18mm",
      aperture: "f/3.5",
      shutter: "1/40",
      iso: 1250,
      taken: "2018-05-10T10:57:05"
    },
    credit: {
      author: "Bernard Gagnon",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Thiksey_Monastery,_Ladakh_14.jpg"
    }
  },
  {
    id: "kee-monastery",
    src: "/images/photos/kee-monastery.jpg",
    w: 2200,
    h: 1639,
    title: "Key gompa in snow",
    place: "Spiti",
    region: "Himachal Pradesh",
    discipline: "Sacred",
    lat: 32.2977,
    lon: 78.0119,
    alt: 4166,
    focus: [0.55, 0.55],
    exif: {
      camera: "DSC-H7",
      lens: null,
      focal: "5mm",
      aperture: "f/6.3",
      shutter: "1/2000",
      iso: 100,
      taken: "2008-01-20T11:30:53"
    },
    credit: {
      author: "Kulbhushan Singh Suryawanshi / Aristeas",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Kee_monastery_Spiti_Valley_(edited).jpg"
    }
  },
  {
    id: "spiti-river",
    src: "/images/photos/spiti-river.jpg",
    w: 2200,
    h: 1467,
    title: "The Spiti at Kaza",
    place: "Spiti",
    region: "Himachal Pradesh",
    discipline: "Landscape",
    lat: 32.227,
    lon: 78.071,
    alt: 3650,
    focus: [0.5, 0.35],
    exif: {
      camera: "NIKON D7200",
      lens: "55.0-300.0 mm f/4.5-5.6",
      focal: "55mm",
      aperture: "f/10",
      shutter: "1/400",
      iso: 200,
      taken: "2018-06-20T15:29:07"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Spiti_River_Kaza_Himachal_Jun18_D72_7232.jpg"
    }
  },
  {
    id: "hampi-virupaksha",
    src: "/images/photos/hampi-virupaksha.jpg",
    w: 2200,
    h: 1467,
    title: "Hemakuta hill",
    place: "Hampi",
    region: "Karnataka",
    discipline: "Sacred",
    lat: 15.3353,
    lon: 76.4589,
    alt: 467,
    focus: [0.4, 0.4],
    exif: {
      camera: "ILCE-7M4",
      lens: null,
      focal: "31mm",
      aperture: "f/13",
      shutter: "1/160",
      iso: 100,
      taken: "2023-01-28T10:47:45"
    },
    credit: {
      author: "Ingo Mehling",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Hampi_-_Hemakuta_Hill,_Virupaksha_Temple.jpg"
    }
  },
  {
    id: "hampi-pushkarani",
    src: "/images/photos/hampi-pushkarani.jpg",
    w: 2200,
    h: 1393,
    title: "Krishna Pushkarani",
    place: "Hampi",
    region: "Karnataka",
    discipline: "Architecture",
    lat: 15.329,
    lon: 76.46,
    alt: 467,
    focus: [0.55, 0.55],
    exif: {
      camera: "NIKON D90",
      lens: null,
      focal: "11mm",
      aperture: "f/14",
      shutter: "1/10",
      iso: null,
      taken: "2012-12-20T07:14:15"
    },
    credit: {
      author: "Dey.sandip",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Krishna_Pushkarani_-_Hampi_Ruins.jpg"
    }
  },
  {
    id: "shore-temple",
    src: "/images/photos/shore-temple.jpg",
    w: 2200,
    h: 1467,
    title: "Shore Temple, low sun",
    place: "Mamallapuram",
    region: "Tamil Nadu",
    discipline: "Sacred",
    lat: 12.6163,
    lon: 80.1993,
    alt: 6,
    focus: [0.45, 0.35],
    exif: {
      camera: "E-P1",
      lens: "OLYMPUS M.14-42mm F3.5-5.6",
      focal: "42mm",
      aperture: "f/7.1",
      shutter: "1/640",
      iso: 200,
      taken: "2009-12-19T16:01:47"
    },
    credit: {
      author: "Vyacheslav Argenberg",
      license: "CC BY 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Mamallapuram,_Shore_Temple,_India.jpg"
    }
  },
  {
    id: "kerala-mangrove",
    src: "/images/photos/kerala-mangrove.jpg",
    w: 2200,
    h: 1467,
    title: "Mangrove arch, Ashtamudi",
    place: "Kollam",
    region: "Kerala",
    discipline: "Landscape",
    lat: 8.95,
    lon: 76.6,
    alt: 3,
    focus: [0.55, 0.45],
    exif: {
      camera: "ILCE-7C",
      lens: "FE 70-300mm F4.5-5.6 G OSS",
      focal: "88mm",
      aperture: "f/8",
      shutter: "1/160",
      iso: 200,
      taken: "2022-03-05T08:49:07"
    },
    credit: {
      author: "Timothy A. Gonsalves",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Mangrove_Arch_Boat_Ashtamudi_Kollam_Kerala_Mar22_A7C_01490.jpg"
    }
  },
  {
    id: "kerala-theyyam",
    src: "/images/photos/kerala-theyyam.jpg",
    w: 2200,
    h: 1467,
    title: "Theyyam",
    place: "Kannur",
    region: "Kerala",
    discipline: "Sacred",
    lat: 11.8745,
    lon: 75.3704,
    alt: 10,
    focus: [0.42, 0.3],
    exif: {
      camera: "NIKON D7500",
      lens: null,
      focal: "50mm",
      aperture: "f/1.8",
      shutter: "1/200",
      iso: 10000,
      taken: "2020-01-14T20:35:57"
    },
    credit: {
      author: "Shagil Kannur",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Theyyam_of_Kerala_3.jpg"
    }
  },
  {
    id: "india-night-iss",
    src: "/images/photos/india-night-iss.jpg",
    w: 2200,
    h: 1464,
    title: "Northern India at night, from orbit",
    place: "Low Earth orbit",
    region: "ISS",
    discipline: "Landscape",
    lat: 28.6,
    lon: 77.2,
    alt: 400000,
    focus: [0.5, 0.5],
    exif: {
      camera: "NIKON D4",
      lens: "28.0 mm f/1.4",
      focal: "28mm",
      aperture: "f/1.4",
      shutter: "1/3",
      iso: 10000,
      taken: "2016-01-18T18:30:41"
    },
    credit: {
      author: "NASA",
      license: "Public domain",
      source: "https://commons.wikimedia.org/wiki/File:ISS-46_Northern_India_at_night.jpg"
    },
    archive: false
  }
];

const byId = Object.fromEntries(photos.map((p) => [p.id, p]));

/** Look a photograph up by id. Throws on a typo so a broken reference fails the build, not the page. */
export function photo(id) {
  const p = byId[id];
  if (!p) throw new Error(`Unknown photo id "${id}" — check data/photos.js`);
  return p;
}
