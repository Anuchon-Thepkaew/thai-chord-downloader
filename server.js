const express = require('express');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const songs = [
  {
    id: 1,
    title: 'ขอเพียงหนึ่งเดียว',
    artist: 'ลูกเทพ จิตรา',
    chords: 'Em Am Em Am\nEm - ขอเพียงหนึ่งเดียวในชีวิตนี้ Am\nB7 - ให้รักกับเธอ Em\nEm - วันดีความสุขจากไกล Am\nB7 - สมหวังเจอพบ Em',
    key: 'Em',
    difficulty: 'easy',
    image: 'https://via.placeholder.com/300x300?text=ขอเพียงหนึ่งเดียว'
  },
  {
    id: 2,
    title: 'คนไม่เข้าใจ',
    artist: 'สีแดง แคลลิโซนิก',
    chords: 'G - คนไม่เข้าใจ Em\nA7 - ความรู้สึกสบายใจ D\nG - คืนนี้ฉันไม่ได้เหน่ Bm\nE7 - ว่างานที่ทำนั้นมีค่า A',
    key: 'G',
    difficulty: 'medium',
    image: 'https://via.placeholder.com/300x300?text=คนไม่เข้าใจ'
  },
  {
    id: 3,
    title: 'กระหม่อม',
    artist: 'ผ่องนวล',
    chords: 'C - กระหม่อมนั้น F\nG - สวยงามความเห่อเหน',
    key: 'C',
    difficulty: 'easy',
    image: 'https://via.placeholder.com/300x300?text=กระหม่อม'
  },
  {
    id: 4,
    title: 'ลำเพลินตรามหาราช',
    artist: 'ศรีนครินทร์',
    chords: 'D - ท่องโลกข้ามประเทศไป A\nB7 - จิตใจสบาย Em',
    key: 'D',
    difficulty: 'hard',
    image: 'https://via.placeholder.com/300x300?text=ลำเพลินตรามหาราช'
  }
];

app.get('/api/songs', (req, res) => {
  const { search, difficulty, key } = req.query;
  
  let filtered = songs;
  
  if (search) {
    filtered = filtered.filter(song => 
      song.title.includes(search) || song.artist.includes(search)
    );
  }
  
  if (difficulty) {
    filtered = filtered.filter(song => song.difficulty === difficulty);
  }
  
  if (key) {
    filtered = filtered.filter(song => song.key === key);
  }
  
  res.json(filtered);
});

app.get('/api/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ error: 'ไม่พบเพลง' });
  res.json(song);
});

app.post('/api/download/pdf/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ error: 'ไม่พบเพลง' });

  const doc = new PDFDocument();
  const filename = `${song.title.replace(/\s+/g, '_')}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  doc.pipe(res);
  
  doc.fontSize(20).font('Helvetica-Bold').text(song.title, 50, 50);
  doc.fontSize(12).font('Helvetica').text(`ศิลปิน: ${song.artist}`, 50, 90);
  doc.fontSize(12).text(`คีย์: ${song.key}`, 50, 110);
  doc.fontSize(12).text(`ระดับ: ${song.difficulty}`, 50, 130);
  
  doc.fontSize(11).font('Courier').text(song.chords, 50, 170, {
    width: 500,
    align: 'left'
  });
  
  doc.end();
});

app.post('/api/download/txt/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) return res.status(404).json({ error: 'ไม่พบเพลง' });

  const content = `${song.title}\nศิลปิน: ${song.artist}\nคีย์: ${song.key}\nระดับ: ${song.difficulty}\n\n${song.chords}`;
  const filename = `${song.title.replace(/\s+/g, '_')}.txt`;
  
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(content);
});

app.get('/api/keys', (req, res) => {
  const keys = [...new Set(songs.map(s => s.key))];
  res.json(keys);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
