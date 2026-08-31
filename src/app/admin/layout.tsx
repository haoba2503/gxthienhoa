import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b dark:border-zinc-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Dashboard
          </Link>
          <Link href="/admin/posts" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Bài Viết
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Cài Đặt
          </Link>
          <Link href="/admin/council" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Ban Hành Giáo
          </Link>
          <Link href="/admin/priests" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Quý Cha
          </Link>
          <Link href="/admin/gallery" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
            Thư Viện Ảnh
          </Link>
          <Link href="/" className="block px-4 py-2 rounded-md text-blue-600 hover:bg-blue-50 mt-8">
            ← Trở về trang chủ
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
