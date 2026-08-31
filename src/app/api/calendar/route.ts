import { NextResponse } from 'next/server';
import romcal from 'romcal';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearStr = searchParams.get('year');
  const monthStr = searchParams.get('month');

  if (!yearStr || !monthStr) {
    return NextResponse.json({ error: 'Missing year or month' }, { status: 400 });
  }

  const year = parseInt(yearStr);
  const month = parseInt(monthStr);

  try {
    const calendarData = romcal.calendarFor({ year });
    
    // Lọc theo tháng và map về định dạng giống inadiutorium
    const daysMap = new Map();
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Khởi tạo tất cả các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(Date.UTC(year, month - 1, i));
      const dateStr = d.toISOString().split('T')[0];
      const isSunday = d.getUTCDay() === 0;
      daysMap.set(dateStr, {
        date: dateStr,
        season: isSunday ? 'Chúa Nhật' : 'Ngày Thường',
        celebrations: []
      });
    }

    calendarData.forEach((day: any) => {
      const d = new Date(day.moment);
      // Đảm bảo là cùng tháng
      if (d.getUTCMonth() + 1 === month) {
        const dateStr = d.toISOString().split('T')[0];
        
        // Loại bỏ các lễ thường
        if (day.type === 'FERIA' || day.name.toLowerCase().includes("week of") || day.type === 'OPT_MEMORIAL') return;

        // Dịch tên lễ chuẩn
        let vnTitle = day.name;
        const key = day.key;
        if (key === 'maryMotherOfGod') vnTitle = 'Đức Maria, Mẹ Thiên Chúa';
        else if (key === 'epiphany') vnTitle = 'Chúa Hiển Linh';
        else if (key === 'baptismOfTheLord') vnTitle = 'Chúa Giêsu Chịu Phép Rửa';
        else if (key === 'ashWednesday') vnTitle = 'Thứ Tư Lễ Tro';
        else if (key === 'palmSunday') vnTitle = 'Chúa Nhật Lễ Lá';
        else if (key === 'holyThursday') vnTitle = 'Thứ Năm Tuần Thánh';
        else if (key === 'goodFriday') vnTitle = 'Thứ Sáu Tuần Thánh';
        else if (key === 'holySaturday') vnTitle = 'Thứ Bảy Tuần Thánh';
        else if (key === 'easterSunday') vnTitle = 'Chúa Nhật Phục Sinh';
        else if (key === 'ascension') vnTitle = 'Chúa Thăng Thiên';
        else if (key === 'pentecostSunday') vnTitle = 'Chúa Thánh Thần Hiện Xuống';
        else if (key === 'holyTrinity') vnTitle = 'Chúa Ba Ngôi';
        else if (key === 'corpusChristi') vnTitle = 'Mình Máu Thánh Chúa';
        else if (key === 'sacredHeartOfJesus') vnTitle = 'Thánh Tâm Chúa Giêsu';
        else if (key === 'assumption') vnTitle = 'Đức Mẹ Lên Trời';
        else if (key === 'allSaints') vnTitle = 'Các Thánh Nam Nữ';
        else if (key === 'allSouls') vnTitle = 'Cầu Cho Các Tín Hữu Đã Qua Đời';
        else if (key === 'christTheKing') vnTitle = 'Chúa Kitô Vua Vũ Trụ';
        else if (key === 'immaculateConceptionOfMary') vnTitle = 'Đức Mẹ Vô Nhiễm Nguyên Tội';
        else if (key === 'nativity') vnTitle = 'Chúa Giáng Sinh';
        else if (key === 'queenshipOfBlessedVirginMary') vnTitle = 'Đức Maria Nữ Vương';
        else if (key === 'transfiguration') vnTitle = 'Chúa Hiển Dung';
        else if (key === 'exaltationOfTheHolyCross') vnTitle = 'Suy Tôn Thánh Giá';
        else {
          // Các lễ Chúa Nhật Mùa Thường Niên
          const sundayMatch = vnTitle.match(/(\d+)(st|nd|rd|th) Sunday of Ordinary Time/i);
          if (sundayMatch) {
            vnTitle = `Chúa Nhật ${sundayMatch[1]} Mùa Thường Niên`;
          } else {
            vnTitle = vnTitle.replace(/The /g, "");
            vnTitle = vnTitle.replace(/Saint /gi, "Thánh ");
            vnTitle = vnTitle.replace(/Saints /gi, "Các Thánh ");
            vnTitle = vnTitle.replace(/Martyr/gi, "Tử Đạo");
            vnTitle = vnTitle.replace(/Apostle/gi, "Tông Đồ");
            vnTitle = vnTitle.replace(/Evangelist/gi, "Thánh Sử");
            vnTitle = vnTitle.replace(/Pope/gi, "Giáo Hoàng");
            vnTitle = vnTitle.replace(/Bishop/gi, "Giám Mục");
            vnTitle = vnTitle.replace(/Priest/gi, "Linh Mục");
            vnTitle = vnTitle.replace(/Doctor/gi, "Tiến Sĩ");
            vnTitle = vnTitle.replace(/Virgin/gi, "Đồng Trinh");
            vnTitle = vnTitle.replace(/Abbot/gi, "Viện Phụ");
            vnTitle = vnTitle.replace(/ of /gi, " của ");
            vnTitle = vnTitle.replace(/the Church/gi, "Hội Thánh");
            vnTitle = vnTitle.replace(/Companions/gi, "Các Bạn");
            vnTitle = vnTitle.replace(/ and /gi, " và ");
          }
        }

        const existing = daysMap.get(dateStr);
        if (existing) {
          existing.celebrations.push({
            title: vnTitle,
            colour: (day.data?.meta?.liturgicalColor?.key || 'WHITE').toLowerCase(),
            rank_num: day.type === 'SOLEMNITY' ? 1 : day.type === 'FEAST' ? 2 : day.type === 'MEMORIAL' ? 3 : 4
          });
        }
      }
    });

    // Sắp xếp lại theo mảng
    const result = Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Calendar API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
