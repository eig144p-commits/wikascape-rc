export type Phrase = { native: string; english: string }

export type Language = {
  slug: string
  name: string
  altName?: string
  color: string
  textColor: string
  region: string
  description: string
  speakers: string
  provinces: string[]
  phrases: Phrase[]
  yes: string
  no: string
  passwords: string[]
}

export const LANGUAGES: Language[] = [
  {
    slug: 'tagalog',
    name: 'Tagalog',
    color: '#D7263D',
    textColor: '#ffffff',
    region: 'Central & Southern Luzon',
    description:
      'Tagalog is the basis of Filipino, the national language. It is spoken around Metro Manila and the provinces of Central and Southern Luzon.',
    speakers: 'About 28 million native speakers',
    provinces: [
      'Metropolitan Manila',
      'Bulacan',
      'Bataan',
      'Nueva Ecija',
      'Aurora',
      'Cavite',
      'Laguna',
      'Batangas',
      'Rizal',
      'Quezon',
      'Marinduque',
      'Occidental Mindoro',
      'Oriental Mindoro',
    ],
    phrases: [
      { native: 'Magandang umaga', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
      { native: 'Paalam', english: 'Goodbye' },
    ],
    yes: 'Oo',
    no: 'Hindi',
    passwords: ['salamat', 'maraming salamat'],
  },
  {
    slug: 'bisaya',
    name: 'Bisaya',
    altName: 'Binisaya',
    color: '#F2B705',
    textColor: '#1f2333',
    region: 'Northern & Eastern Mindanao',
    description:
      'Bisaya (Binisaya) is the Mindanao variety of the Visayan language family. It is the everyday lingua franca across much of Mindanao, from Davao to Cagayan de Oro.',
    speakers: 'Widely spoken across Mindanao',
    provinces: [
      'Davao del Norte',
      'Davao del Sur',
      'Davao Oriental',
      'Compostela Valley',
      'Misamis Occidental',
      'Misamis Oriental',
      'Bukidnon',
      'Camiguin',
      'Agusan del Norte',
      'Agusan del Sur',
      'Surigao del Norte',
      'Surigao del Sur',
      'Dinagat Islands',
      'Zamboanga del Norte',
      'Zamboanga del Sur',
      'Zamboanga Sibugay',
      'Lanao del Norte',
      'Sarangani',
    ],
    phrases: [
      { native: 'Maayong buntag', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kumusta man ka?', english: 'How are you?' },
      { native: 'Amping', english: 'Take care' },
    ],
    yes: 'Oo',
    no: 'Dili',
    passwords: ['salamat', 'daghang salamat'],
  },
  {
    slug: 'hiligaynon',
    name: 'Hiligaynon',
    altName: 'Ilonggo',
    color: '#1B998B',
    textColor: '#ffffff',
    region: 'Western Visayas & SOCCSKSARGEN',
    description:
      'Hiligaynon, also called Ilonggo, is known for its gentle, sweet-sounding tone. It is spoken in Panay, Negros Occidental, and parts of Mindanao.',
    speakers: 'About 9 million speakers',
    provinces: [
      'Iloilo',
      'Aklan',
      'Capiz',
      'Guimaras',
      'Negros Occidental',
      'South Cotabato',
      'Sultan Kudarat',
      'North Cotabato',
    ],
    phrases: [
      { native: 'Maayong aga', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kamusta ka?', english: 'How are you?' },
      { native: 'Halong', english: 'Take care' },
    ],
    yes: 'Huo',
    no: 'Indi',
    passwords: ['salamat', 'salamat gid'],
  },
  {
    slug: 'ilocano',
    name: 'Ilocano',
    altName: 'Iloko',
    color: '#6A4C93',
    textColor: '#ffffff',
    region: 'Northern Luzon',
    description:
      'Ilocano is the third most spoken native language in the country and the lingua franca of Northern Luzon, from the Ilocos coast to the Cagayan Valley.',
    speakers: 'About 8 million speakers',
    provinces: [
      'Ilocos Norte',
      'Ilocos Sur',
      'La Union',
      'Abra',
      'Apayao',
      'Batanes',
      'Cagayan',
      'Isabela',
      'Quirino',
      'Nueva Vizcaya',
    ],
    phrases: [
      { native: 'Naimbag a bigat', english: 'Good morning' },
      { native: 'Agyamanak', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
      { native: 'Agpakadaakon', english: 'Goodbye' },
    ],
    yes: 'Wen',
    no: 'Saan',
    passwords: ['agyamanak', 'agyamanak unay'],
  },
  {
    slug: 'cebuano',
    name: 'Cebuano',
    color: '#2E86DE',
    textColor: '#ffffff',
    region: 'Central Visayas',
    description:
      'Cebuano is the language of Cebu and Central Visayas. With more native speakers than any other Philippine language besides Tagalog, it is a cornerstone of Visayan culture.',
    speakers: 'About 20 million speakers',
    provinces: ['Cebu', 'Bohol', 'Negros Oriental', 'Siquijor', 'Southern Leyte'],
    phrases: [
      { native: 'Maayong buntag', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
      { native: 'Amping', english: 'Take care' },
    ],
    yes: 'Oo',
    no: 'Dili',
    passwords: ['salamat', 'daghang salamat'],
  },
  {
    slug: 'bikol',
    name: 'Bikol',
    altName: 'Bicol',
    color: '#7CB518',
    textColor: '#1f2333',
    region: 'Bicol Region',
    description:
      'Bikol is spoken in the Bicol Peninsula, home of the famous Mayon Volcano. Instead of "salamat", Bikolanos say "Dios mabalos" — "May God repay you".',
    speakers: 'About 4.5 million speakers',
    provinces: [
      'Camarines Norte',
      'Camarines Sur',
      'Albay',
      'Sorsogon',
      'Catanduanes',
      'Masbate',
    ],
    phrases: [
      { native: 'Marhay na aga', english: 'Good morning' },
      { native: 'Dios mabalos', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
      { native: 'Paaram', english: 'Goodbye' },
    ],
    yes: 'Iyo',
    no: 'Dai',
    passwords: ['dios mabalos', 'diyos mabalos', 'mabalos'],
  },
  {
    slug: 'waray',
    name: 'Waray',
    altName: 'Waray-Waray',
    color: '#F46036',
    textColor: '#ffffff',
    region: 'Eastern Visayas',
    description:
      'Waray is spoken in Samar, Leyte, and Biliran. Fun fact: "waray" itself means "nothing" or "none" in the language.',
    speakers: 'About 3.5 million speakers',
    provinces: ['Samar', 'Eastern Samar', 'Northern Samar', 'Leyte', 'Biliran'],
    phrases: [
      { native: 'Maupay nga aga', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
    ],
    yes: 'Oo',
    no: 'Diri',
    passwords: ['salamat', 'damo nga salamat'],
  },
  {
    slug: 'kapampangan',
    name: 'Kapampangan',
    color: '#E056A0',
    textColor: '#ffffff',
    region: 'Central Luzon',
    description:
      'Kapampangan is spoken in Pampanga and parts of Tarlac. Pampanga is celebrated as the culinary capital of the Philippines.',
    speakers: 'About 2.8 million speakers',
    provinces: ['Pampanga', 'Tarlac'],
    phrases: [
      { native: 'Mayap a abak', english: 'Good morning' },
      { native: 'Dakal a salamat', english: 'Thank you very much' },
      { native: 'Kumusta ka?', english: 'How are you?' },
    ],
    yes: 'Wa',
    no: 'Ali',
    passwords: ['salamat', 'dakal a salamat'],
  },
  {
    slug: 'maguindanao',
    name: 'Maguindanao',
    altName: 'Maguindanaon',
    color: '#0B3C5D',
    textColor: '#ffffff',
    region: 'Bangsamoro (BARMM)',
    description:
      'Maguindanaon is spoken in Maguindanao and nearby areas of Cotabato. Its word for thank you, "sukran", comes from Arabic.',
    speakers: 'About 1.5 million speakers',
    provinces: ['Maguindanao', 'Shariff Kabunsuan'],
    phrases: [
      { native: 'Mapia kapipita', english: 'Good morning' },
      { native: 'Sukran', english: 'Thank you' },
    ],
    yes: 'Uway',
    no: 'Di',
    passwords: ['sukran', 'salamat'],
  },
  {
    slug: 'pangasinan',
    name: 'Pangasinan',
    altName: 'Panggalato',
    color: '#8D6E63',
    textColor: '#ffffff',
    region: 'Pangasinan Province',
    description:
      'Pangasinan (Panggalato) is spoken along the Lingayen Gulf. The province name means "land of salt" — salt-making is a centuries-old tradition there.',
    speakers: 'About 1.8 million speakers',
    provinces: ['Pangasinan'],
    phrases: [
      { native: 'Masantos ya kabwasan', english: 'Good morning' },
      { native: 'Salamat', english: 'Thank you' },
      { native: 'Kumusta ka?', english: 'How are you?' },
    ],
    yes: 'On',
    no: 'Andi',
    passwords: ['salamat', 'salamat ed sika'],
  },
]

export function displayName(language: Language) {
  return language.altName ? `${language.name} / ${language.altName}` : language.name
}

export function getLanguage(slug: string) {
  return LANGUAGES.find((language) => language.slug === slug)
}

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
}
