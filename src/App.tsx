import { CreateDogForm } from "./Components/CreateDogForm";
import { Dogs } from "./Components/Dogs";
import { Section } from "./Components/Section";
import { useDogContext } from "./providers/DogProvider";

export function App() {
  const { currentPage } = useDogContext() ?? {};

  return (
    <div className="App" style={{ backgroundColor: "skyblue" }}>
      <header>
        <h1>pup-e-picker (Functional)</h1>
      </header>
      <Section label={"Dogs: "}>
        <Dogs />
        {currentPage === "form" && <CreateDogForm />}
      </Section>
    </div>
  );
}
