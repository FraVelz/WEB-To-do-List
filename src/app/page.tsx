import Header from "../components/layout/Header";
import Aside  from "../components/layout/Aside";
import Main from "../components/layout/Main";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <Aside className="w-70 h-screen bg-background-sidebar" />

      <div className="flex-1 h-screen bg-background-main">
        <Header className="" />
        <Main />
      </div>
   </div>
  );
}
