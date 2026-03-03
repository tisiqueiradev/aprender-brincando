import Menu from "../../../components/layout/Menu";
import Header from "../layout";


export default function MenuMath() {
  return (
    <>
      <Header
        title="Matemática"
        themeColor="math"

      />
      <div className="flex items-center justify-center min-h-[100dvh] py-24 px-4 gap-6">
        <Menu
          label="Sequência númerica"
          themeColor="math"
          to="/math"
        />

        <Menu
          label="Antecessor & Sucessor"
          themeColor="math"
          to="/math"
        />

      </div>
    </>
  )
}
