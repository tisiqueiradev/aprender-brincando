import Header from "../../components/layout/Header";
import Menu from "../../components/layout/Menu";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen my-8">

        <div className="flex flex-col items-center gap-4">
          <Menu
            label="Português"
            themeColor="portuguese"
            to="/portuguese"
          />

          <Menu
            label="Matemática"
            themeColor="math"
            to="/math"
          />

          <Menu
            label="Inglês"
            themeColor="english"
            to="/english"

          />

          <Menu
            label="Geografia"
            themeColor="geo"
            to="/geo"
          />

          <Menu
            label="Ciência"
            themeColor="science"
            to="/science"

          />

          <Menu
            label="Artes"
            themeColor="arts"
            to="/arts"

          />



        </div>
      </div>
    </>
  )
}
