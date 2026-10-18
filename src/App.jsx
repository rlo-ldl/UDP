import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiHeart,
  FiInstagram,
  FiMapPin,
  FiMusic,
  FiUser,
} from 'react-icons/fi';
import { SectionTitle } from './components/SectionTitle';
import { CountdownTimer } from './components/CountdownTimer';
import { ExportPage } from './components/ExportPage';
import { addGuestbookMessage, addRsvp, subscribeToGuestbook } from './firebase';
import {
  bankAccounts,
  couple,
  envelopeAddress,
  eventDetails,
  guestNameDefault,
  weddingDate,
} from './data';

function InvitationPage() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState(guestNameDefault);
  const [copiedAccount, setCopiedAccount] = useState('');
  const [rsvpForm, setRsvpForm] = useState({ name: '', totalGuests: 2, status: 'Hadir' });
  const [guestbookForm, setGuestbookForm] = useState({ name: '', message: '' });
  const [guestbook, setGuestbook] = useState([]);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [messageStatus, setMessageStatus] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramName = params.get('to');
    setGuestName(paramName ? paramName : guestNameDefault);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToGuestbook(setGuestbook);
    return unsubscribe;
  }, []);

  const coupleFullName = `${couple.groom.name} & ${couple.bride.name}`;
  const coupleInitials = `${couple.groom.name.split(' ')[0][0]} & ${couple.bride.name.split(' ')[0][0]}`;
  const dressCodeColors = [
    { name: 'Brown', value: '#6b4d3d' },
    { name: 'Cream', value: '#eadfcf' },
    { name: 'Sage', value: '#9db7ad' },
    { name: 'Soft Gray', value: '#c9c7c1' },
    { name: 'Taupe', value: '#b7a89d' },
  ];

  const heroMessage = useMemo(
    () => `Kami mengundang ${guestName} untuk hadir pada acara pernikahan kami`,
    [guestName]
  );

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Audio playback failed', error);
    }
  };

  const openInvitation = () => {
    toggleMusic();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedAccount(label);
      setTimeout(() => setCopiedAccount(''), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  const handleRsvpSubmit = async (event) => {
    event.preventDefault();
    if (!rsvpForm.name.trim()) {
      setRsvpStatus({ type: 'error', message: 'Silakan masukkan nama Anda.' });
      return;
    }

    setIsSubmittingRsvp(true);
    setRsvpStatus(null);

    try {
      await addRsvp({
        name: rsvpForm.name.trim(),
        totalGuests: Number(rsvpForm.totalGuests),
        status: rsvpForm.status,
      });

      setRsvpStatus({
        type: 'success',
        message: 'Konfirmasi kehadiran Anda telah berhasil dikirim. Terima kasih!',
      });
      setRsvpForm({ name: '', totalGuests: 2, status: 'Hadir' });
    } catch (error) {
      setRsvpStatus({
        type: 'error',
        message: 'Gagal mengirim konfirmasi. Silakan coba beberapa saat lagi.',
      });
      console.error(error);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    if (!guestbookForm.name.trim() || !guestbookForm.message.trim()) {
      setMessageStatus({ type: 'error', message: 'Nama dan ucapan tidak boleh kosong.' });
      return;
    }

    setIsSubmittingMessage(true);
    setMessageStatus(null);

    try {
      await addGuestbookMessage({
        name: guestbookForm.name.trim(),
        message: guestbookForm.message.trim(),
      });

      setMessageStatus({
        type: 'success',
        message: 'Ucapan Anda telah terkirim. Terima kasih banyak!',
      });
      setGuestbookForm({ name: '', message: '' });
    } catch (error) {
      setMessageStatus({
        type: 'error',
        message: 'Ucapan Anda gagal terkirim. Silakan coba lagi.',
      });
      console.error(error);
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const addToCalendar = () => {
    const start = new Date(weddingDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(new Date(weddingDate).getTime() + 3 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + 'Z';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad%20Nikah%20${encodeURIComponent(coupleFullName)}&dates=${start}/${end}&details=${encodeURIComponent(`Undangan Pernikahan ${coupleFullName}`)}&location=${encodeURIComponent(eventDetails.reception.location)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream text-slate-700">
      <audio ref={audioRef} loop preload="none">
        <source src="/audio/Part%20Of%20Life.m4a.mp4" type="audio/mp4" />
      </audio>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-sage-900/45 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm text-white/90 sm:px-6">
          <div className="whitespace-nowrap font-display text-xl tracking-[0.12em] sm:text-2xl sm:tracking-[0.2em]">{coupleInitials}</div>
          <nav className="hidden gap-6 md:flex">
            <a href="#event" className="transition hover:text-white">Acara</a>
            <a href="#dress-code" className="transition hover:text-white">Dress Code</a>
            <a href="#rsvp" className="transition hover:text-white">RSVP</a>
            <a href="#digital-envelope" className="transition hover:text-white">Amplop</a>
          </nav>
          <button type="button" className="shrink-0 whitespace-nowrap rounded-full border border-white/40 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] transition hover:bg-white/10 sm:px-3 sm:text-xs sm:tracking-[0.2em]" onClick={toggleMusic}>
            {isPlaying ? 'Matikan Musik' : 'Putar Musik'}
          </button>
        </div>
      </header>

      <main id="content">
        <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-sage-900 px-4 pb-20 pt-28 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-sage-900/90 via-sage-900/80 to-sage-900/95" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="mb-4 text-xs uppercase tracking-[0.5em] text-white/70">The Wedding of</p>
              <h1 className="font-display text-5xl leading-none sm:text-7xl">{coupleFullName}</h1>
              <p className="mt-6 text-base text-white/80 sm:text-lg">{heroMessage}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button type="button" className="btn-primary" onClick={openInvitation}>
                  <FiMusic className="inline-block" />
                  <span>{isPlaying ? 'Matikan Musik' : 'Buka Undangan'}</span>
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-3 text-sm text-white/80">
                <span className="inline-block h-2 w-2 rounded-full bg-gold-300" />
                {eventDetails.ceremony.date}
                <span className="inline-block h-2 w-2 rounded-full bg-gold-300" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <motion.div whileHover={{ y: -6 }} className="soft-card overflow-hidden" data-aos="fade-right">
              <img src={couple.groom.photo} alt={couple.groom.name} className="h-[420px] w-full object-cover object-center sm:h-[500px]" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-sage-700">Mempelai Pria</p>
                <h3 className="mt-4 font-display text-4xl text-sage-900">{couple.groom.name}</h3>
                <p className="mt-3 text-sm text-slate-600">{couple.groom.parent}</p>
                <a href={`https://instagram.com/${couple.groom.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sage-700">
                  <FiInstagram />
                  {couple.groom.instagram}
                </a>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="soft-card overflow-hidden" data-aos="fade-left">
              <img src={couple.bride.photo} alt={couple.bride.name} className="h-[420px] w-full object-cover object-center sm:h-[500px]" />
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-sage-700">Mempelai Wanita</p>
                <h3 className="mt-4 font-display text-4xl text-sage-900">{couple.bride.name}</h3>
                <p className="mt-3 text-sm text-slate-600">{couple.bride.parent}</p>
                <a href={`https://instagram.com/${couple.bride.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sage-700">
                  <FiInstagram />
                  {couple.bride.instagram}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="event" className="bg-sage-900 py-20 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Wedding Event"
              title="Informasi Acara"
              description="Kami menantikan kehadiran Bapak/Ibu/Saudara/i untuk merayakan momen istimewa kami."
              titleSize="text-5xl sm:text-6xl"
              descriptionColor="text-white"
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {[eventDetails.ceremony, eventDetails.reception].map((event) => (
                <motion.div key={event.title} whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-soft backdrop-blur-sm" data-aos="zoom-in-up">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gold-200">{event.title}</p>
                      <h3 className="mt-3 font-display text-4xl text-white">{event.date}</h3>
                    </div>
                    <div className="rounded-full border border-gold-200/60 bg-gold-100/10 p-3 text-gold-200">
                      <FiCalendar size={22} />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-white/80">
                    <div className="flex items-start gap-3">
                      <FiClock className="mt-0.5 text-gold-200" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMapPin className="mt-0.5 text-gold-200" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMapPin className="mt-0.5 text-gold-200" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={eventDetails.mapUrl} target="_blank" rel="noreferrer" className="btn-primary !bg-white !text-sage-900 hover:!bg-sage-50">
                      <FiMapPin className="inline-block" />
                      <span>Google Maps</span>
                    </a>
                    <button type="button" className="btn-secondary !border-white/40 !text-white hover:!bg-white/10" onClick={addToCalendar}>
                      <FiCalendar className="inline-block" />
                      <span>Save the Date</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-10" data-aos="fade-up">
              <div className="flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-200">Countdown</p>
                <h3 className="mt-4 font-display text-4xl text-white">Menuju Hari Bahagia</h3>
                <CountdownTimer targetDate={weddingDate} />
              </div>
            </div>
          </div>
        </section>

        <section id="dress-code" className="bg-[#d7d1c5] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-8 text-center">
              <div className="mx-auto w-full max-w-3xl rounded-[1.2rem] bg-[#f4efe7] px-6 py-5 shadow-[0_10px_18px_rgba(67,53,41,0.12)] rotate-[-1deg] sm:px-10">
                <h3 className="font-display text-4xl font-bold uppercase tracking-tight text-[#6b4d3d] sm:text-7xl">Dresscode</h3>
              </div>

              <div className="mx-auto w-full max-w-2xl rounded-[1.2rem] bg-[#7a5f3c] px-6 py-5 shadow-[0_10px_18px_rgba(67,53,41,0.14)] rotate-[1deg] sm:px-10">
                <h4 className="font-display text-4xl font-bold uppercase tracking-tight text-[#f4efe7] sm:text-6xl">Color</h4>
              </div>
            </div>

            <div className="mt-12 grid max-w-4xl grid-cols-2 justify-center gap-x-12 gap-y-10 mx-auto sm:grid-cols-3 lg:grid-cols-5">
              {dressCodeColors.map((color, index) => (
                <div key={color.name} className="flex flex-col items-center gap-4" data-aos="zoom-in" data-aos-delay={index * 80}>
                  <div
                    className="h-24 w-24 rounded-full border-[4px] border-white/60 shadow-[0_8px_20px_rgba(74,58,46,0.12)] sm:h-28 sm:w-28"
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                    title={color.name}
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="mx-auto max-w-2xl text-base leading-8 text-[#4c433d] sm:text-lg">
                Mohon hadir dengan warna yang selaras dengan palet elegan kami, dengan pilihan nuansa earthy, warm neutral, dan soft natural untuk suasana yang hangat dan berkesan.
              </p>
            </div>
          </div>
        </section>

        <section id="rsvp" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="RSVP"
            title="Konfirmasi Kehadiran"
            description="Mohon bantuannya untuk mengonfirmasi kehadiran Anda agar kami dapat menyiapkan acara dengan lebih baik."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.form onSubmit={handleRsvpSubmit} className="soft-card p-6 sm:p-8" data-aos="fade-right">
              <div className="grid gap-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Nama Lengkap</span>
                  <input
                    type="text"
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sage-500"
                    placeholder="Masukkan nama Anda"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Jumlah Hadir</span>
                    <input
                      type="number"
                      min="1"
                      value={rsvpForm.totalGuests}
                      onChange={(e) => setRsvpForm((prev) => ({ ...prev, totalGuests: Number(e.target.value) || 1 }))}
                      className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sage-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
                    <select
                      value={rsvpForm.status}
                      onChange={(e) => setRsvpForm((prev) => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sage-500"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmittingRsvp}>
                  {isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>

                {rsvpStatus ? (
                  <div className={`rounded-2xl px-4 py-3 text-sm ${rsvpStatus.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {rsvpStatus.message}
                  </div>
                ) : null}
              </div>
            </motion.form>

            <motion.div className="soft-card p-6 sm:p-8" data-aos="fade-left">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sage-100 p-3 text-sage-700">
                  <FiUser size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-sage-700">Penting</p>
                  <h3 className="mt-2 font-display text-3xl text-sage-900">Aturan RSVP</h3>
                </div>
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <li className="flex gap-3"><FiCheck className="mt-1 text-sage-700" /> Minimal mengisi nama dan status kehadiran.</li>
                <li className="flex gap-3"><FiCheck className="mt-1 text-sage-700" /> Mohon konfirmasi sebelum H-7 agar kami dapat mempersiapkan undangan dengan maksimal.</li>
                <li className="flex gap-3"><FiCheck className="mt-1 text-sage-700" /> Jika hadir, jumlah tamu yang datang dapat disesuaikan dengan kapasitas lokasi.</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="bg-sage-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Guest Book"
              title="Buku Tamu & Ucapan"
              description="Berikan doa dan ucapan terbaik untuk kami di momen bahagia ini."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.form onSubmit={handleMessageSubmit} className="soft-card p-6 sm:p-8" data-aos="fade-right">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Nama</span>
                  <input
                    type="text"
                    value={guestbookForm.name}
                    onChange={(e) => setGuestbookForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sage-500"
                    placeholder="Nama Anda"
                  />
                </label>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Ucapan / Doa</span>
                  <textarea
                    rows="5"
                    value={guestbookForm.message}
                    onChange={(e) => setGuestbookForm((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-sage-500"
                    placeholder="Tulis doa atau ucapan Anda..."
                  />
                </label>

                <button type="submit" className="btn-primary mt-6 w-full justify-center" disabled={isSubmittingMessage}>
                  {isSubmittingMessage ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>

                {messageStatus ? (
                  <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${messageStatus.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {messageStatus.message}
                  </div>
                ) : null}
              </motion.form>

              <motion.div className="soft-card p-6 sm:p-8" data-aos="fade-left">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-3xl text-sage-900">Ucapan Tamu</h3>
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-xs uppercase tracking-[0.25em] text-sage-700">{guestbook.length} Ucapan</span>
                </div>

                <div className="space-y-4">
                  {guestbook.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-sage-200 bg-white/70 p-6 text-center text-sm text-slate-500">
                      Belum ada ucapan. Jadilah yang pertama menulis doa terbaik untuk kami.
                    </div>
                  ) : (
                    guestbook.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-sage-900">{item.name}</p>
                          <span className="text-xs text-slate-400">
                            {item.createdAt instanceof Date ? item.createdAt.toLocaleDateString('id-ID') : 'Baru'}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="digital-envelope" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Digital Envelope"
            title="Amplop Digital"
            description="Ucapan kebahagiaan dan bantuan dapat diberikan melalui rekening atau e-wallet."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <motion.div className="soft-card p-6 sm:p-8" data-aos="fade-right">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold-100 p-3 text-gold-500">
                  <FiCopy size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-sage-700">Rekening</p>
                  <h3 className="mt-2 font-display text-3xl text-sage-900">Transfer</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.code} className="rounded-2xl border border-sage-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{account.name}</p>
                        <p className="mt-2 font-semibold text-sage-900">{account.owner}</p>
                        <p className="mt-2 text-lg tracking-widest text-slate-700">{account.number}</p>
                      </div>
                      <button type="button" onClick={() => handleCopy(account.number, account.code)} className="rounded-full border border-sage-200 bg-sage-50 px-3 py-2 text-sm font-medium text-sage-700 transition hover:bg-sage-100">
                        {copiedAccount === account.code ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="soft-card p-6 sm:p-8" data-aos="fade-left">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sage-100 p-3 text-sage-700">
                  <FiMapPin size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-sage-700">Kado Fisik</p>
                  <h3 className="mt-2 font-display text-3xl text-sage-900">Alamat Pengiriman</h3>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
                <p className="font-semibold text-sage-900">{envelopeAddress.name}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{envelopeAddress.address}</p>
                <p className="mt-4 rounded-2xl bg-sage-50 p-4 text-sm leading-7 text-slate-600">{envelopeAddress.note}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="bg-[#f7f1ee] py-10">
          <div className="mx-auto max-w-5xl px-4 text-center text-slate-600 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-center gap-3 text-sage-800">
              <FiHeart className="text-gold-500" />
              <span className="font-display text-3xl">{coupleFullName}</span>
              <FiHeart className="text-gold-500" />
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sage-700">
              <a href={`https://instagram.com/${couple.groom.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm">
                <FiInstagram />
                Instagram
              </a>
              <button type="button" className="inline-flex items-center gap-2 text-sm" onClick={addToCalendar}>
                <FiCalendar />
                Add to Calendar
              </button>
            </div>
          </div>
        </footer>
      </main>

    </div>
  );
}

function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/export') {
    return <ExportPage />;
  }

  return <InvitationPage />;
}

export default App;
