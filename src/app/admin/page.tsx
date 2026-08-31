import { getPosts, getSettings, getServices } from "../actions";

export default async function AdminDashboard() {
  const posts = await getPosts();
  const settings = await getSettings();
  const services = await getServices();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
          <h3 className="text-zinc-500 text-sm font-medium">Tổng bài viết</h3>
          <p className="text-4xl font-bold mt-2">{posts.length}</p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm">
          <h3 className="text-zinc-500 text-sm font-medium">Giờ lễ</h3>
          <p className="text-4xl font-bold mt-2">{services.length}</p>
        </div>
      </div>
    </div>
  );
}
