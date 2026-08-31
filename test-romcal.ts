import { Romcal } from "romcal";
const romcal = new Romcal();
romcal.generateCalendar(2026).then(c => console.log(Object.values(c).slice(0,2).map(d => d.name)));
