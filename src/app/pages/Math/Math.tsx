import Menu from "../../../components/layout/Menu";
import Header from "../layout";


export default function Math() {
  return (
    <>
      <Header
        title="Matemática"
        themeColor="math"

      />
      <div className="min-h-[100dvh] flex items-center justify-center px-4 py-16 sm:py-20">
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Menu
            label="Sequência Numérica"
            themeColor="math"
            to="/math/number-sequence"
          />

          <Menu
            label="Antecessor & Sucessor"
            themeColor="math"
            to="/math/number-table"
          />
        </div>
      </div>
    </>
  )
}
