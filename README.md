# เว็บดาวน์โหลดคอร์ดเพลงไทย

ระบบดาวน์โหลดคอร์ดเพลงไทยแบบ full-stack พร้อม API

## ฟีเจอร์

✅ ค้นหาเพลงตามชื่อหรือศิลปิน  
✅ ฟิลเตอร์ตามระดับความยากและคีย์  
✅ ดูรูปภาพเพลง  
✅ ดาวน์โหลดคอร์ดเป็น PDF  
✅ ดาวน์โหลดคอร์ดเป็น TXT  
✅ คัดลอกคอร์ดไปยังคลิปบอร์ด  
✅ API RESTful สำหรับจัดการข้อมูล  

## ความต้องการ

- Node.js 14+
- npm หรือ yarn

## การติดตั้ง

1. Clone โปรเจค
```bash
cd thai-chord-downloader
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. เริ่มต้นเซิร์ฟเวอร์
```bash
npm start
```

4. เปิด browser ไปที่
```
http://localhost:3000
```

## ใช้งาน

### เนื้อหาของโปรเจค

```
thai-chord-downloader/
├── server.js              # Express server + API
├── package.json          # Dependencies
├── public/
│   ├── index.html       # HTML หลัก
│   ├── style.css        # Styling
│   └── app.js           # Frontend JavaScript
└── README.md            # ไฟล์นี้
```

### API Endpoints

#### ดึงรายการเพลงทั้งหมด
```
GET /api/songs
Query params:
  - search: ค้นหาตามชื่อหรือศิลปิน
  - difficulty: easy|medium|hard
  - key: คีย์เพลง
```

#### ดึงข้อมูลเพลงเดียว
```
GET /api/songs/:id
```

#### ดึงรายการคีย์ทั้งหมด
```
GET /api/keys
```

#### ดาวน์โหลด PDF
```
POST /api/download/pdf/:id
```

#### ดาวน์โหลด TXT
```
POST /api/download/txt/:id
```

## เพิ่มเพลงใหม่

แก้ไขไฟล์ `server.js` ในส่วน `const songs = [...]` แล้วเพิ่มข้อมูล:

```javascript
{
  id: 5,
  title: 'ชื่อเพลง',
  artist: 'ชื่อศิลปิน',
  chords: 'คอร์ด\nของเพลง',
  key: 'G',
  difficulty: 'easy',
  image: 'URL รูปภาพ'
}
```

## ระดับความยากของเพลง

- **easy** - ง่าย: เพลงที่ใช้คอร์ดพื้นฐาน
- **medium** - ปานกลาง: มีคอร์ดที่ซับซ้อนพอสมควร
- **hard** - ยาก: มีคอร์ดเสริมและการเปลี่ยนคีย์

## การพัฒนาเพิ่มเติม

เพื่อใช้ nodemon สำหรับ auto-reload:
```bash
npm run dev
```

## โครงสร้างข้อมูลเพลง

```javascript
{
  id: Number,           // ID เฉพาะ
  title: String,        // ชื่อเพลง
  artist: String,       // ชื่อศิลปิน
  chords: String,       // คอร์ดเพลง (สามารถขึ้นบรรทัดใหม่ได้)
  key: String,          // คีย์เพลง (C, G, D, Em, etc.)
  difficulty: String,   // ระดับ (easy, medium, hard)
  image: String         // URL รูปภาพเพลง
}
```

## License

MIT

## ติดต่อ

หากมีปัญหาหรือข้อเสนอแนะ สามารถเปิด Issue ได้
