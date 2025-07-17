import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TDog, TNewDog } from "../types";
import { Requests } from "../api";
import toast from "react-hot-toast";

type TPage = "all" | "favorite" | "unfavorite" | "form";

type TDogProvider = {
  dogs: TDog[];
  loading: boolean;
  removeDog: (id: number) => Promise<void>;
  toggleDogFavorite: (favorited: boolean, id: number) => Promise<unknown>;
  updateAllDogs: () => Promise<void>;
  addDog: (dog: TNewDog) => Promise<void>;
  currentPage: TPage;
  setActivePage: (page: TPage) => void;
  getDogsPage: () => TDog[];
};

export const DogContext = createContext<TDogProvider | undefined>(undefined);

export default function DogProviders({ children }: { children: ReactNode }) {
  const [dogs, setDogs] = useState<TDog[]>([]);
  const [currentPage, setCurrentPage] = useState<TPage>("all");
  const [loading, setLoading] = useState(false);

  const setActivePage = (page: TPage) => {
    setCurrentPage(page === currentPage ? "all" : page);
  };

  const getDogsPage = (): TDog[] => {
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

  const toggleDogFavorite = (favorited: boolean, id: number) => {
    setDogs(
      dogs.map((dog) =>
        dog.id === id ? { ...dog, isFavorite: favorited } : dog
      )
    );
    return Requests.patchDog({ isFavorite: favorited }, id).catch((error) => {
      if (error) {
        setDogs(dogs);
      }
    });
  };

  const removeDog = (id: number) => {
    setDogs(dogs.filter((dog) => dog.id != id));
    return Requests.deleteDogRequest(id).catch((error) => {
      if (error) {
        setDogs(dogs);
      }
    });
  };

  const updateAllDogs = () => {
    setLoading(true);
    return Requests.getAllDogs()
      .then(setDogs)
      .catch((error) => {
        if (error) {
          toast.error("There was an Error getting Dogs");
        }
      })
      .finally(() => setLoading(false));
  };

  const addDog = (dog: TNewDog) => {
    setLoading(true);
    return Requests.postDog(dog)
      .then(() => {
        toast.success("Dog Created 🐶");
        updateAllDogs().catch((error) => console.log(error));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    updateAllDogs().catch((error) => {
      console.log(error);
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

export const useDogContext = () => {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error("Context is not defined");
  }
  return context;
};
