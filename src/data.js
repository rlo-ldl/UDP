import groomPhoto from './img/groom.png';
import bridePhoto from './img/bride.png';

export const weddingDate = '2026-11-07T08:00:00+07:00';

export const guestNameDefault = 'Bapak/Ibu/Saudara/i';

export const couple = {
  groom: {
    name: 'Ryan Dzulfiqar Rashif',
    parent: 'Putra pertama Bapak Ade Wawan & Ibu Ika Rachmawati Candrawan',
    instagram: '@ryandzulfiqarr',
    photo: groomPhoto,
  },
  bride: {
    name: 'Tania Devinar Farasanti',
    parent: 'Putri kedua Bapak I Putu Mudhita Wahyu Prasetyo & Ibu Susan Ambarita (Almh.)',
    instagram: '@taniaadf_',
    photo: bridePhoto,
  },
};

export const eventDetails = {
  ceremony: {
    title: 'Akad Nikah',
    date: 'Sabtu, 7 November 2026',
    time: '08.00 - 10.00 WIB',
    venue: 'Arkara Social Cafe',
    location: 'Jl. Ahmad Yani KM.18, Cilegon, Banten',
  },
  reception: {
    title: 'Resepsi Pernikahan',
    date: 'Sabtu, 07 November 2026',
    time: '11.00 - 14.00 WIB',
    venue: 'Arkara Social Cafe',
    location: 'Jl. Ahmad Yani KM.18, Cilegon, Banten',
  },
  mapUrl: 'https://maps.app.goo.gl/8XLtbSvZtAg9Vjxj7',
};

export const bankAccounts = [
  {
    name: 'Bank Mandiri',
    owner: 'Tania Devinar Farasanti',
    number: '1630004321371',
    code: 'MANDIRI',
  },
  {
    name: 'Bank Mandiri',
    owner: 'Ryan Dzulfiqar Rashif',
    number: '1310019448283',
    code: 'MANDIRI',
  },
];

export const envelopeAddress = {
  title: 'Alamat Pengiriman Kado',
  name: 'Tania Devinar Farasanti',
  address: 'Taman Cilegon Indah Blok H.6 No.27 RT.002 RW.005, Kelurahan Sukmajaya, Kecamatan Jombang, Kota Cilegon, Banten 42435',
  note: 'Alamat ini dapat dipakai untuk kiriman kado fisik jika Bapak/Ibu/Saudara ingin mengirimkan hadiah secara langsung.',
};
