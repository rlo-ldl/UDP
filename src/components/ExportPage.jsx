import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FiArrowLeft, FiDownload, FiFileText } from 'react-icons/fi';
import { getGuestbookMessages, getRsvps } from '../firebase';

function formatDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : value.toDate?.();
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toLocaleString('id-ID')
    : '';
}

function saveWorkbook(rows, headers, sheetName, fileName) {
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  worksheet['!cols'] = headers.map((header) => ({ wch: Math.max(header.length + 4, 18) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export function ExportPage() {
  const [exporting, setExporting] = useState('');
  const [error, setError] = useState('');

  const exportCollection = async (collectionName) => {
    setExporting(collectionName);
    setError('');

    try {
      const records = collectionName === 'rsvps'
        ? await getRsvps()
        : await getGuestbookMessages();
      const dateStamp = new Date().toISOString().slice(0, 10);

      if (collectionName === 'rsvps') {
        const rows = records.map((record) => ({
          Nama: record.name || '',
          'Jumlah Tamu': record.totalGuests ?? '',
          Status: record.status || '',
          'Waktu Konfirmasi': formatDate(record.createdAt),
        }));
        saveWorkbook(rows, ['Nama', 'Jumlah Tamu', 'Status', 'Waktu Konfirmasi'], 'RSVP', `rsvp-${dateStamp}.xlsx`);
      } else {
        const rows = records.map((record) => ({
          Nama: record.name || '',
          'Ucapan / Doa': record.message || '',
          'Waktu Dikirim': formatDate(record.createdAt),
        }));
        saveWorkbook(rows, ['Nama', 'Ucapan / Doa', 'Waktu Dikirim'], 'Ucapan', `ucapan-${dateStamp}.xlsx`);
      }
    } catch (exportError) {
      console.error('Export failed', exportError);
      setError('Data gagal diambil. Coba lagi beberapa saat; jika masalah berlanjut, periksa akses Firestore.');
    } finally {
      setExporting('');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 text-slate-700">
      <section className="w-full max-w-2xl rounded-[2rem] border border-sage-100 bg-white p-6 shadow-soft sm:p-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-sage-700 transition hover:text-sage-900">
          <FiArrowLeft /> Kembali ke undangan
        </a>

        <div className="mt-8 flex items-center gap-4">
          <div className="rounded-full bg-sage-100 p-4 text-sage-700"><FiFileText size={24} /></div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sage-700">Pengelolaan Data</p>
            <h1 className="mt-1 font-display text-4xl text-sage-900">Export Excel</h1>
          </div>
        </div>
        <p className="mt-5 leading-7 text-slate-600">
          Unduh data RSVP dan buku tamu sebagai file Excel (.xlsx). Setiap tautan mengunduh file terpisah.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => exportCollection('rsvps')}
            disabled={Boolean(exporting)}
            className="btn-primary justify-center disabled:cursor-wait disabled:opacity-60"
          >
            <FiDownload />
            {exporting === 'rsvps' ? 'Menyiapkan RSVP...' : 'Unduh Data RSVP'}
          </button>
          <button
            type="button"
            onClick={() => exportCollection('messages')}
            disabled={Boolean(exporting)}
            className="btn-secondary justify-center disabled:cursor-wait disabled:opacity-60"
          >
            <FiDownload />
            {exporting === 'messages' ? 'Menyiapkan ucapan...' : 'Unduh Ucapan'}
          </button>
        </div>

        {error ? <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Tautan ini tidak memerlukan login. Siapa pun yang memilikinya dapat mengunduh data RSVP dan ucapan; bagikan hanya kepada pihak tepercaya.
        </p>
      </section>
    </main>
  );
}
