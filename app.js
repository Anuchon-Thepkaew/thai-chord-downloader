const API_URL = 'http://localhost:3000/api';
let currentSongId = null;

const searchInput = document.getElementById('searchInput');
const difficultyFilter = document.getElementById('difficultyFilter');
const keyFilter = document.getElementById('keyFilter');
const resetBtn = document.getElementById('resetBtn');
const songsList = document.getElementById('songsList');
const songDetail = document.getElementById('songDetail');
const closeBtn = document.querySelector('.close-btn');

document.addEventListener('DOMContentLoaded', () => {
  loadKeys();
  loadSongs();
  setupEventListeners();
});

function setupEventListeners() {
  searchInput.addEventListener('input', debounce(loadSongs, 300));
  difficultyFilter.addEventListener('change', loadSongs);
  keyFilter.addEventListener('change', loadSongs);
  resetBtn.addEventListener('click', resetFilters);
  closeBtn.addEventListener('click', closeSongDetail);
  
  document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
  document.getElementById('downloadTxtBtn').addEventListener('click', downloadTXT);
  document.getElementById('copyBtn').addEventListener('click', copyChordsToClipboard);
  
  songDetail.addEventListener('click', (e) => {
    if (e.target === songDetail) closeSongDetail();
  });
}

async function loadKeys() {
  try {
    const response = await fetch(`${API_URL}/keys`);
    const keys = await response.json();
    
    const keyOptions = keys.map(key => `<option value="${key}">${key}</option>`).join('');
    keyFilter.innerHTML = '<option value="">ทุกคีย์</option>' + keyOptions;
  } catch (error) {
    console.error('Error loading keys:', error);
  }
}

async function loadSongs() {
  const search = searchInput.value;
  const difficulty = difficultyFilter.value;
  const key = keyFilter.value;
  
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (difficulty) params.append('difficulty', difficulty);
  if (key) params.append('key', key);
  
  try {
    const response = await fetch(`${API_URL}/songs?${params}`);
    const songs = await response.json();
    
    renderSongs(songs);
  } catch (error) {
    console.error('Error loading songs:', error);
    songsList.innerHTML = '<div class="loading">เกิดข้อผิดพลาด กรุณาลองใหม่</div>';
  }
}

function renderSongs(songs) {
  if (songs.length === 0) {
    songsList.innerHTML = '<div class="loading">ไม่พบเพลงที่ตรงกับการค้นหา</div>';
    return;
  }
  
  songsList.innerHTML = songs.map(song => `
    <div class="song-card" onclick="openSongDetail(${song.id})">
      <img src="${song.image}" alt="${song.title}" class="song-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%228b5a2b%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎸%3C/text%3E%3C/svg%3E'">
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
        <div class="song-meta">
          <span class="badge">${song.key}</span>
          <span class="badge">${getDifficultyLabel(song.difficulty)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getDifficultyLabel(difficulty) {
  const labels = {
    easy: 'ง่าย',
    medium: 'ปานกลาง',
    hard: 'ยาก'
  };
  return labels[difficulty] || difficulty;
}

async function openSongDetail(songId) {
  currentSongId = songId;
  
  try {
    const response = await fetch(`${API_URL}/songs/${songId}`);
    const song = await response.json();
    
    document.getElementById('detailImage').src = song.image;
    document.getElementById('detailImage').onerror = function() {
      this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%228b5a2b%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2260%22 fill=%22%23d4af37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🎸%3C/text%3E%3C/svg%3E';
    };
    
    document.getElementById('detailTitle').textContent = song.title;
    document.getElementById('detailArtist').textContent = `ศิลปิน: ${song.artist}`;
    document.getElementById('detailKey').textContent = `คีย์: ${song.key}`;
    document.getElementById('detailDifficulty').textContent = getDifficultyLabel(song.difficulty);
    document.getElementById('detailChords').textContent = song.chords;
    
    songDetail.classList.remove('hidden');
  } catch (error) {
    console.error('Error loading song detail:', error);
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลเพลง');
  }
}

function closeSongDetail() {
  songDetail.classList.add('hidden');
  currentSongId = null;
}

async function downloadPDF() {
  if (!currentSongId) return;
  
  try {
    const response = await fetch(`${API_URL}/download/pdf/${currentSongId}`, {
      method: 'POST'
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chord_${currentSongId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
  }
}

async function downloadTXT() {
  if (!currentSongId) return;
  
  try {
    const response = await fetch(`${API_URL}/download/txt/${currentSongId}`, {
      method: 'POST'
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chord_${currentSongId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading TXT:', error);
    alert('เกิดข้อผิดพลาดในการดาวน์โหลด');
  }
}

function copyChordsToClipboard() {
  const chords = document.getElementById('detailChords').textContent;
  navigator.clipboard.writeText(chords).then(() => {
    const btn = document.getElementById('copyBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ คัดลอกแล้ว';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(() => {
    alert('ไม่สามารถคัดลอกได้');
  });
}

function resetFilters() {
  searchInput.value = '';
  difficultyFilter.value = '';
  keyFilter.value = '';
  loadSongs();
}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
