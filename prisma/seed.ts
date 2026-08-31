import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Settings
  await prisma.setting.upsert({ where: { key: 'hero_title' }, update: { value: 'GIÁO XỨ THIÊN HOA' }, create: { key: 'hero_title', value: 'GIÁO XỨ THIÊN HOA' } })
  await prisma.setting.upsert({ where: { key: 'hero_subtitle' }, update: { value: 'Giáo Phận Buôn Ma Thuột' }, create: { key: 'hero_subtitle', value: 'Giáo Phận Buôn Ma Thuột' } })
  await prisma.setting.upsert({ where: { key: 'hero_verse' }, update: { value: '"Trên đá này, Thầy sẽ xây Hội Thánh của Thầy" - Mt 16:18' }, create: { key: 'hero_verse', value: '"Trên đá này, Thầy sẽ xây Hội Thánh của Thầy" - Mt 16:18' } })
  await prisma.setting.upsert({ where: { key: 'about_text' }, update: { value: 'Hình thành từ năm 1993 do giáo phu Y Mớt truyền đạo. Ngày 25.01.2005, TGM-BMT thành lập Giáo xứ Thiên Hoa. Năm 2007: xây dựng Nhà thờ. Năm thành lập: 25.01.2005. Bổn mạng Giáo xứ: Đức Mẹ Vô Nhiễm. Số Giáo dân: 2036.' }, create: { key: 'about_text', value: 'Hình thành từ năm 1993 do giáo phu Y Mớt truyền đạo. Ngày 25.01.2005, TGM-BMT thành lập Giáo xứ Thiên Hoa. Năm 2007: xây dựng Nhà thờ. Năm thành lập: 25.01.2005. Bổn mạng Giáo xứ: Đức Mẹ Vô Nhiễm. Số Giáo dân: 2036.' } })
  await prisma.setting.upsert({ where: { key: 'contact_address' }, update: { value: 'Xã Quảng Tín, huyện Đăk R’lấp, Đăk Nông' }, create: { key: 'contact_address', value: 'Xã Quảng Tín, huyện Đăk R’lấp, Đăk Nông' } })

  // 2. Posts (Featured) - Keeping dummy for now
  const existingPost = await prisma.post.findFirst({ where: { title: 'Thánh lễ Tạ ơn' } })
  if (!existingPost) {
    await prisma.post.create({
      data: {
        title: 'Thánh lễ Tạ ơn',
        content: 'Một ngày hồng phúc của Giáo xứ Thiên Hoa...',
        type: 'FEATURED',
        imageUrl: '/images/thanh-le-ta-on-hong-an-linh-muc-poster.jpg'
      }
    })
  }

  // 3. Services
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      { day: 'Chúa Nhật', time: '4:30 - 6:45 - 16:15', description: 'Thánh lễ trọng thể với bài giảng sâu sắc và thánh ca trang nghiêm.', icon: 'bi-sun', order: 1 },
      { day: 'Thứ Bảy', time: '16:15', description: 'Thánh lễ chiều thứ Bảy, chuẩn bị tâm hồn đón Chúa Nhật.', icon: 'bi-moon-stars', order: 2 },
      { day: 'Ngày Thường', time: '4:30 - 17:00', description: 'Thánh lễ sáng và chiều hàng ngày để cầu nguyện và kết nối với Chúa.', icon: 'bi-calendar-week', order: 3 },
      { day: 'Chầu Thánh Thể', time: 'Thứ Năm Đầu Tháng', description: 'Giờ chầu Thánh Thể, suy niệm và cầu nguyện trước Chúa Giêsu Thánh Thể.', icon: 'bi-heart-pulse', order: 4 },
    ]
  });

  // 4. Activities
  await prisma.activity.deleteMany();
  await prisma.activity.createMany({
    data: [
      { title: 'Ca Đoàn', description: 'Tham gia ca đoàn, ban nhạc hoặc đội âm thanh. Dùng tài năng âm nhạc để tôn vinh Chúa.', icon: 'bi-music-note-beamed', imageUrl: '/images/activity-worship.jpg' },
      { title: 'Thiếu Nhi Thánh Thể', description: 'Chương trình giáo dục đức tin cho thiếu nhi với các hoạt động vui nhộn và ý nghĩa.', icon: 'bi-emoji-smile', imageUrl: '/images/activity-kids.jpg' },
    ]
  });

  // 5. Priests
  await prisma.$transaction([
    prisma.priest.deleteMany(),
    prisma.councilMember.deleteMany()
  ]);

  await prisma.priest.createMany({
    data: [
      { name: 'Cha Giuse Trần Ngọc Cầu', role: 'Linh mục tiên khởi', period: '2005 - 2012', description: 'Cha xứ tiên khởi từ khi mới thành lập giáo xứ.', imageUrl: 'https://i.pravatar.cc/300?img=11', isCurrent: false, order: 1 },
      { name: 'Cha Giuse Trần Văn Roãn', role: 'Linh mục đương nhiệm', period: '2012 - 2024', description: 'Được đề cập trong lịch sử là linh mục đương nhiệm thời điểm 2015-2016.', imageUrl: 'https://i.pravatar.cc/300?img=68', isCurrent: false, order: 2 },
      { name: 'Cha Phêrô Vũ Hồng Ân', role: 'Linh mục Quản xứ', period: '2024 - Nay', description: 'Theo Danh sách Thuyên chuyển Linh mục năm 2024 của Văn phòng TGM.', imageUrl: '/images/chaxu.jpeg', isCurrent: true, order: 3 },
      { name: 'Cha Phó Gioan Baotixita', role: 'Linh mục Phó xứ', period: '2024 - Nay', description: 'Cùng đồng hành với Cha Quản xứ trong việc chăm sóc mục vụ cho cộng đoàn.', imageUrl: '/images/chapho.jpeg', isCurrent: true, order: 4 },
    ]
  });

  // 6. Zones (Giáo Khu)
  await prisma.zone.deleteMany();
  await prisma.zone.createMany({
    data: [
      { name: 'Giáo Khu Giuse', patron: 'Thánh Giuse', description: 'Giáo khu trung tâm nhà thờ.', contactInfo: 'Ông Nguyễn Văn A - 0987.654.321', membersCount: 350, order: 1, imageUrl: 'https://images.unsplash.com/photo-1548625361-26c92176b5c0?q=80&w=400&auto=format&fit=crop' },
      { name: 'Giáo Khu Phêrô', patron: 'Thánh Phêrô', description: 'Khu vực phía Đông giáo xứ.', contactInfo: 'Ông Lê Văn B - 0912.345.678', membersCount: 280, order: 2, imageUrl: 'https://images.unsplash.com/photo-1601058269601-5272a81878d6?q=80&w=400&auto=format&fit=crop' },
      { name: 'Giáo Khu Mân Côi', patron: 'Đức Mẹ Mân Côi', description: 'Khu vực phía Tây.', contactInfo: 'Bà Trần Thị C - 0905.111.222', membersCount: 410, order: 3, imageUrl: 'https://images.unsplash.com/photo-1519097721868-b328a6fdf942?q=80&w=400&auto=format&fit=crop' },
      { name: 'Giáo Khu Anrê (Giáo Bon)', patron: 'Thánh Anrê', description: 'Cộng đoàn anh em sắc tộc.', contactInfo: 'Y Tuân - 0935.999.888', membersCount: 520, order: 4, imageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f8510dd9?q=80&w=400&auto=format&fit=crop' },
    ]
  });

  // 7. Organizations (Đoàn Thể)
  await prisma.organization.deleteMany();
  await prisma.organization.createMany({
    data: [
      { name: 'Thiếu Nhi Thánh Thể', patron: 'Chúa Giêsu Hài Đồng', description: 'Giáo dục thiếu nhi về đức tin và nhân bản.', contactInfo: 'Trưởng: Maria Nguyễn Thị D - 0968.123.456', membersCount: 450, order: 1, imageUrl: 'https://images.unsplash.com/photo-1606376887556-9e90098bf8c9?q=80&w=400&auto=format&fit=crop' },
      { name: 'Giới Trẻ', patron: 'Thánh Gioan Bosco', description: 'Tập hợp thanh niên sinh hoạt, học hỏi và tông đồ.', contactInfo: 'Trưởng: Giuse Phạm Văn E - 0914.789.012', membersCount: 150, order: 2, imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop' },
      { name: 'Hội Các Bà Mẹ Công Giáo', patron: 'Thánh Monica', description: 'Cầu nguyện cho gia đình và giáo xứ.', contactInfo: 'Hội trưởng: Anna Lê Thị F - 0909.555.666', membersCount: 200, order: 3, imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop' },
      { name: 'Ca Đoàn Tổng Hợp', patron: 'Thánh Cecilia', description: 'Phục vụ thánh ca trong các thánh lễ.', contactInfo: 'Ca trưởng: Phêrô Trần Văn G - 0988.111.999', membersCount: 80, order: 4, imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop' },
    ]
  });

  // 8. Gallery
  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({
    data: [
      { url: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop', type: 'IMAGE', title: 'Lễ Phục Sinh 2026', description: 'Thánh lễ đêm canh thức Phục Sinh.', date: '12/04/2026', tags: 'Thánh Lễ', order: 1 },
      { url: 'https://images.unsplash.com/photo-1544819777-62283e30f143?q=80&w=800&auto=format&fit=crop', type: 'IMAGE', title: 'Rước Lễ Lần Đầu', description: 'Các em Thiếu nhi xưng tội và rước lễ lần đầu.', date: '30/05/2026', tags: 'Thiếu Nhi', order: 2 },
      { url: 'https://images.unsplash.com/photo-1606376887556-9e90098bf8c9?q=80&w=800&auto=format&fit=crop', type: 'IMAGE', title: 'Hội Chợ Trung Thu', description: 'Phát quà cho thiếu nhi trong giáo xứ.', date: '25/09/2026', tags: 'Sinh Hoạt', order: 3 },
      { url: 'https://images.unsplash.com/photo-1473172828238-d636db8a2b53?q=80&w=800&auto=format&fit=crop', type: 'IMAGE', title: 'Khánh thành nhà xứ', description: 'Nghi thức làm phép nhà xứ mới.', date: '10/01/2026', tags: 'Sự Kiện', order: 4 },
      { url: 'https://www.youtube.com/embed/59kCnuT1m1M', type: 'VIDEO', title: 'Video Trùng Tu Nhà Thờ', description: 'Tiến độ trùng tu thánh đường.', date: '10/2024', tags: 'Video', order: 5 },
    ]
  });



  // 8. Videos
  await prisma.video.deleteMany();

  // --- SEED COUNCIL MEMBERS ---
  console.log('Inserting Council Members...');
  await prisma.councilMember.createMany({
    data: [
      { name: 'Ông Giuse Nguyễn Văn A', role: 'Chủ Tịch', phone: '0901.234.567', imageUrl: 'https://i.pravatar.cc/150?img=11', order: 1 },
      { name: 'Ông Phêrô Trần Văn B', role: 'Phó Chủ Tịch Nội Vụ', phone: '0912.345.678', imageUrl: 'https://i.pravatar.cc/150?img=12', order: 2 },
      { name: 'Ông Đaminh Lê Văn C', role: 'Phó Chủ Tịch Ngoại Vụ', phone: '0923.456.789', imageUrl: 'https://i.pravatar.cc/150?img=13', order: 3 },
      { name: 'Ông Antôn Phạm Văn D', role: 'Thư Ký', phone: '0934.567.890', imageUrl: 'https://i.pravatar.cc/150?img=14', order: 4 },
      { name: 'Bà Maria Nguyễn Thị E', role: 'Thủ Quỹ', phone: '0945.678.901', imageUrl: 'https://i.pravatar.cc/150?img=5', order: 5 }
    ]
  });

  console.log('Database seeded fully with Thien Hoa data!');
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() });
