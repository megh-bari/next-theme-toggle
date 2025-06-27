import ExampleCard from "./components/ExampleCard"
import Header from "./components/layout/Header"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors">
      <Header />
      <main>
        <ExampleCard />
      </main>
    </div>
  )
}
