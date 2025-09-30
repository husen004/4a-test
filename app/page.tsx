import ReturnQuarenty from "@/components/ReturnQuarenty";
import Tariffs from "@/components/Tariffs";

export default function Home() {
  return (
    <>
      <main className="wrapper">

        <h1 className="h1 my-6 md:ml-0 ml-6">
          Выбери подходящий для себя <span className="warning">тариф</span>
        </h1>

        <Tariffs />
        <ReturnQuarenty />
      </main>
    </>
  );
}
