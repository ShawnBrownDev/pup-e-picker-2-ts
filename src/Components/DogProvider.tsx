import {
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import { Dog, TNewDog } from "../types";
import { Requests } from "../api";
import toast from "react-hot-toast";

type TPage = "all" | "favorite" | "unfavorite" | "form";

type TDogProvider = {
  dogs: Dog[];
  loading: boolean;
  removeDog: (id: number) => Promise<void>;
  toggleDogFavorite: (favorited: boolean, id: number) => Promise<unknown>;
  updateAllDogs: () => Promise<void>;
  addDog: (dog: TNewDog) => Promise<void>;
  currentPage: TPage;
  setActivePage: (page: TPage) => void;
  getDogsPage: () => Dog[];
};

export const DogContext = createContext<TDogProvider | undefined>(undefined);

export default function DogProviders({ children }: { children: ReactNode }) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [currentPage, setCurrentPage] = useState<TPage>("all");
  const [loading, setLoading] = useState(false);

  const setActivePage = (page: TPage) => {
    setCurrentPage(page === currentPage ? "all" : page);
  };

  const getDogsPage = (): Dog[] => {
    switch (currentPage) {
      case "all":
        return dogs;
      case "favorite":
        return dogs.filter((dog) => dog.isFavorite);
      case "unfavorite":
        return dogs.filter((dog) => !dog.isFavorite);
      case "form":
        return [];
    }
  };

  const toggleDogFavorite = async (favorited: boolean, id: number) => {
    try {
      setDogs(
        dogs.map((dog) =>
          dog.id === id ? { ...dog, isFavorite: favorited } : dog
        )
      );
      await Requests.patchDog({ isFavorite: favorited }, id);
    } catch (error) {
      setDogs(dogs);
      toast.error("Failed to update favorite status");
    }
  };

  const removeDog = async (id: number) => {
    try {
      setDogs(dogs.filter((dog) => dog.id !== id));
      await Requests.deleteDogRequest(id);
    } catch (error) {
      setDogs(dogs);
      toast.error("Failed to delete dog");
    }
  };

  const updateAllDogs = async () => {
    setLoading(true);
    try {
      const allDogs = await Requests.getAllDogs();
      setDogs(allDogs);
    } catch (error) {
      toast.error("There was an Error getting Dogs");
    } finally {
      setLoading(false);
    }
  };

  const addDog = async (dog: TNewDog) => {
    setLoading(true);
    try {
      await Requests.postDog(dog);
      toast.success("Dog Created 🐶");
      await updateAllDogs();
    } catch (error) {
      toast.error("Failed to create dog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void updateAllDogs().catch((error) => {
      console.error("Failed to fetch initial dogs:", error);
    });
  }, []);

  return (
    <DogContext.Provider
      value={{
        dogs,
        loading,
        toggleDogFavorite,
        removeDog,
        updateAllDogs,
        addDog,
        currentPage,
        setActivePage,
        getDogsPage,
      }}
    >
      {children}
    </DogContext.Provider>
  );
}
