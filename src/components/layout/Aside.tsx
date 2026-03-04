import Image from "next/image";

function Pages(children: React.ReactElement, text: string) {
  return (
    <div>
      {children}
      <p>{text}</p>
    </div>
  );
}

export default function Aside({ className }: { className: string }) {
  return (
      <aside className={className}>
        <div>
          {/* Profile */}
          <div className="p-3 flex justify-between">
            <button className="flex items-center gap-3 hover:bg-white/10 py-1 px-2 rounded-md">
              <div className="size-6 bg-white rounded-full"></div>
              <p className="text-sm text-white">Fravelz</p>
              <Image src="/DownArrow.svg" width={12} height={12} alt="Down Arrow" />
            </button>

            <div className="flex gap-1">
              <button className="hover:bg-white/10 py-1 px-2 rounded-md">
                <Image src="/NotificationNotify.svg" width={20} height={20} alt="Down Arrow" />
              </button>

              <button className="hover:bg-white/10 py-1 px-2 rounded-md">
                <Image src="/Sidebar.svg" width={20} height={20} alt="Down Arrow" />
              </button>
            </div>
          </div>

          {/* Pages */}
          <nav>
            <Pages text="Home">
              <button className="hover:bg-white/10 py-1 px-2 rounded-md">
                <Image src="/AddPlus.svg" width={20} height={20} alt="Down Arrow" />
              </button>
            </Pages>
          </nav>
          </div>
      </aside>
  );
}